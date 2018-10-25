import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'Firebase';


@Injectable()
export class GroupProvider {


  UserUid = window.localStorage.getItem('userid');


  Groups = []

  groupDetails


  AllFriends = []
  groupMembers = []



  messages = []
  users = []


  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase, public evente: Events) {

  }


  initialize(groupDetails) {
  	this.groupDetails = groupDetails
  }








  uploadGroupPicture(picURL){
  	var promise = new Promise((resolve, reject) => {
  		firebase.storage().ref('Group Picture').child(this.UserUid).child(this.uid() + '.jpg').putString(picURL, firebase.storage.StringFormat.DATA_URL).then((snap) => {
  			snap.ref.getDownloadURL().then((downloadURL) => {
  				resolve(true)
  			})
  		}).catch((err) => {
  			reject(err)
  		})
  	})
  	return  promise
  }



  uid(){
  	var d = new Date().getTime()
  	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
  		var r = (d + Math.random() * 16) % 16 | 0
  		d = Math.floor(d / 16)
  		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  	})
  	return uuid
  }








  creaeGroup(groupDetails){
  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('hhhh').push({
  			key : "ket"
  		}).then((snap) => {
  			var key = snap.key
  			this.afDB.database.ref('hhhh').child(key).remove().then(() => {
  				this.afDB.database.ref('Groups').child(this.UserUid).child(key).set({
  					Owner: this.UserUid,
  					Key: key,
  					Name: groupDetails.Name,
  					Picture: groupDetails.Picture
  				}).then(() => {
  					this.afDB.database.ref('Groups').child(this.UserUid).child(key).child('Members').push({
  						Id: this.UserUid
  					}).then(() => {
  						resolve(true)
  					})
  				})
  			}).catch((err) => {
  				reject(err)
  			})
  		})
  	})
  	return promise
  }







  getGroups(){
     this.afDB.database.ref('Groups').child(this.UserUid).on('value', snap => {
        this.Groups = []
        var res = snap.val()
        for (var i in res){
          this.Groups.push(res[i])
        }
        this.evente.publish('Groups')
      })    
  }









  getAllFriends(groupDetails) {
  		
  		this.afDB.database.ref('Users').on('value', snap => {
  			var res = snap.val()
  			let userDetails = []
  			for (var i in res) {
  				userDetails.push(res[i])
  			}
	  		this.afDB.database.ref('Friends').child(this.UserUid).on('value', snap => {
	  			var res = snap.val()
	  			let array = []
	  			for (var i in res) {
	  				array.push(res[i])
	  			}

	  			this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').on('value', snap => {
            this.AllFriends = []
	  				var res = snap.val()
		  			let array1 = []
		  			for (var io in res) {
		  				array1.push(res[io])
		  			}

	  				for( var bb = array.length - 1; bb >= 0; bb--){
						for( var cc = 0; cc < array1.length; cc++){
							if(array[bb].Id === array1[cc].Id){
								array.splice(bb, 1);
							}
						}
					}

			  		for (var c in array) {
		  				for (var d in userDetails) {
		  					if (array[c].Id === userDetails[d].Id) {
		  						this.AllFriends.push(userDetails[d]);
		  					}
		  				}
		  			}

            this.evente.publish('AllFriends')

	  			})
	  		})
  		})
  }








  addMember(userDetails, groupDetails) {
  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').push({
  			Id: userDetails.Id
  		}).then(() => {
  			this.afDB.database.ref('Groups').child(userDetails.Id).child(groupDetails.Key).set(groupDetails).then(() => {
  				this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').once('value', snap => {
  					var res = snap.val()
            for(var i in res) {
              this.afDB.database.ref('Groups').child(res[i].Id).child(groupDetails.Key).child('Members').set(res).then(() => {
                


                this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Chats').once('value', snap => {
                  var res1 = snap.val()
                  this.afDB.database.ref('Groups').child(userDetails.Id).child(groupDetails.Key).child('Chats').set(res1).then(() => {
                    resolve(true)
                  }).catch((err) => {
                    reject(err)
                  })
                }).catch((err) => {
                  reject(err)
                })

                
              })
            }
  				}).catch((err) => {
  					reject(err)
  				})
  			})
  		})
  	})
  	return promise
  }






  deleteGroup(groupDetails){
  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').once('value', snap => {
  			var res = snap.val()
  			for (var i in res) {
	  			this.afDB.database.ref('Groups').child(res[i].Id).child(groupDetails.Key).remove().then(() => {
	  				resolve(true)
	  			}).catch((err) => {
	  				reject(err)
	  			})  				
  			}
  		}).catch((err) => {
  			reject(err)
  		})
  	})
  	return promise
  }





  leaveGroup(groupDetails){
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').once('value', snap => {
        var res = snap.val()
        this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').orderByChild('Id').equalTo(this.UserUid).once('value', snapshot => {
          var res1 = snapshot.val()
          var temp = Object.keys(res1)


          for (var i in res) {
            this.afDB.database.ref('Groups').child(res[i].Id).child(groupDetails.Key).child('Members').child(temp[0]).remove().then(() => {
              this.afDB.database.ref('Groups').child(this.UserUid).child(groupDetails.Key).remove().then(() => {
                resolve(true)
              }).catch((err) => {
                reject(err)
              })
            }).catch((err) => {
              reject(err)
            })
          }


        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  }





  getGroupMembers(groupDetails) {
      
      this.afDB.database.ref('Users').on('value', snap => {
        this.groupMembers = []
        var res = snap.val()
        let userDetails = []
        for (var i in res) {
          userDetails.push(res[i])
        }
        this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').on('value', snap => {
          this.groupMembers = []
          var res = snap.val()
          let array = []
          for (var i in res) {
            array.push(res[i])
          } 

          for(var ia in userDetails) {
            for (var ii in array) {
              if (userDetails[ia].Id === array[ii].Id) {
                this.groupMembers.push(userDetails[ia])
              }
            }
          }

          this.evente.publish('GroupMembers')

        })

      })
  }






  deleteMember(userDetails, groupDetails){
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').once('value', snap => {
        var res = snap.val()

        this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').orderByChild('Id').equalTo(userDetails.Id).once('value', snapshot => {
          var res1 = snapshot.val()
          var temp = Object.keys(res1)

          for(var i in res) {
            this.afDB.database.ref('Groups').child(res[i].Id).child(groupDetails.Key).child('Members').child(temp[0]).remove().then(() => {
              this.afDB.database.ref('Groups').child(userDetails.Id).child(groupDetails.Key).remove().then(() => {
                resolve(true)
              }).catch((err) => {
                reject(err)
              })
            }).catch((err) => {
              reject(err)
            })
          }

        }).catch((err) => {
          reject(err)
        })

      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  }







  sendMessage(messageDetails, groupDetails) {
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Groups').child(groupDetails.Owner).child(groupDetails.Key).child('Members').once('value', snap => {
        var res = snap.val()

        this.afDB.database.ref('dsad').push({
          Id: 'fasdf'
        }).then((snapshot) => {
          var key = snapshot.key

          for (var i in res) {
            this.afDB.database.ref('Groups').child(res[i].Id).child(groupDetails.Key).child('Chats').child(key).set({
              Body : messageDetails.body,
              Id: this.UserUid,
              Time: firebase.database.ServerValue.TIMESTAMP,
              Key: key
            }).then(() => {
              this.afDB.database.ref('dsad').child(key).remove().then(() => {
                resolve(true)
              }).catch((err) => {
                reject(err)
              })
            })
          }

        })

      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  }





  getAllMessages() {
    let array1 = []

    this.afDB.database.ref('Groups').child(this.UserUid).child(this.groupDetails.Key).child('Chats').on('value', snap => {
      this.messages = []
      array1 = []
      var res = snap.val()

      for(var i in res) {
        this.messages.push(res[i])
        array1.push(res[i].Id)
      }

      this.users = []
      this.afDB.database.ref('Users').once('value', snapshot => {
        var res = snapshot.val()
        let array = []
        for (var a in res) {
          array.push(res[a])
        }

        for(var c in array1) {
          for (var d in array) {
            if(array1[c] === array[d].Id) {
              this.users.push(array[d])
            }
          }
        }

        this.evente.publish('Messages')

      })
    })
  }










}