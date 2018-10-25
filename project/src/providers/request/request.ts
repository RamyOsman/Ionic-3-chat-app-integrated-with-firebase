import { Injectable } from '@angular/core';


import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';



import { NotificationProvider } from '../notification/notification';
import { AuthProvider } from '../auth/auth';



@Injectable()
export class RequestProvider {

	UserUid = window.localStorage.getItem('userid');

  myDetails

  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase, public authProvider: AuthProvider, public notificationProvider: NotificationProvider) {
    
  }







  getSentRequests() {
  	var promise = new Promise((resolve, reject) => {
  		let Details = []
  		this.afDB.database.ref('Users').once('value', snap => {
  			var res = snap.val()
  			let userDetails = []
  			for (var i in res) {
  				userDetails.push(res[i])
  			}
	  		this.afDB.database.ref('Requests').child(this.UserUid).child('Sent Requests').once('value', snap => {
	  			var res = snap.val()
	  			let sentArray = []
	  			for (var i in res) {
	  				sentArray.push(res[i])
	  			} 

	  			for(var ia in userDetails) {
	  				for (var ii in sentArray) {
	  					if (userDetails[ia].Id === sentArray[ii].Id) {
	  						Details.push(userDetails[ia])
	  					}
	  				}
	  			}

	  			resolve(Details)
	  		}).catch((err) => {
	  			reject(err)
	  		})

  		}).catch((err) => {
  			reject(err)
  		})
  	})
  	return promise
  }




  getReceivedRequests() {
  	var promise = new Promise((resolve, reject) => {
  		let Details = []
  		this.afDB.database.ref('Users').once('value', snap => {
  			var res = snap.val()
  			let userDetails = []
  			for (var i in res) {
  				userDetails.push(res[i])
  			}
	  		this.afDB.database.ref('Requests').child(this.UserUid).child('Received Requests').once('value', snap => {
	  			var res = snap.val()
	  			let receivedArray = []
	  			for (var i in res) {
	  				receivedArray.push(res[i])
	  			} 


	  			for(var ia in userDetails) {
	  				for (var ii in receivedArray) {
	  					if (userDetails[ia].Id === receivedArray[ii].Id) {
	  						Details.push(userDetails[ia])
	  					}
	  				}
	  			}

	  			resolve(Details)


	  			resolve()
	  		}).catch((err) => {
	  			reject(err)
	  		})

  		}).catch((err) => {
  			reject(err)
  		})
  	})
  	return promise	
  }




  makeRequest(userDetails) {    
    var notificationDetails = {
      Type: 'Request'
    }

  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('Requests').child(this.UserUid).child('Sent Requests').push({
  			Id: userDetails.Id
  		}).then(() => {
  			this.afDB.database.ref('Requests').child(userDetails.Id).child('Received Requests').push({
  				Id: this.UserUid
  			}).then(() => {
  				
          this.notificationProvider.pushNotification(userDetails, notificationDetails).then(() => {
            resolve(true)
          }).catch((err) => {
            reject(err)
          })


  			})
  		})
  	})
  	return promise
  }




  deleteSentRequest(userDetails) {
  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('Requests').child(this.UserUid).child('Sent Requests').orderByChild('Id').equalTo(userDetails.Id).once('value', snap => {
  			var res = snap.val()
  			let tempstore = Object.keys(res)
  			this.afDB.database.ref('Requests').child(this.UserUid).child('Sent Requests').child(tempstore[0]).remove().then(() => {
  				this.afDB.database.ref('Requests').child(userDetails.Id).child('Received Requests').orderByChild('Id').equalTo(this.UserUid).once('value', snap => {
  					var res = snap.val()
  					let tempstore = Object.keys(res)
  					this.afDB.database.ref('Requests').child(userDetails.Id).child('Received Requests').child(tempstore[0]).remove().then(() => {
  						resolve(true)
  					}).catch((err) => {
  						reject(err)
  					})
  				}).catch((err) => {
  					reject(err)
  				})
  			}).catch((err) => {
  				reject(err)
  			})
  		})
  	})
  	return promise
  }



  deleteReceivedRequest(userDetails) {
    var promise = new Promise((resolve, reject) => {
         this.afDB.database.ref('Requests').child(this.UserUid).child('Received Requests').orderByChild('Id').equalTo(userDetails.Id).once('value', snap => {
           var res = snap.val()
            let tempstore = Object.keys(res)
            this.afDB.database.ref('Requests').child(this.UserUid).child('Received Requests').child(tempstore[0]).remove().then(() => {
              this.afDB.database.ref('Requests').child(userDetails.Id).child('Sent Requests').orderByChild('Id').equalTo(this.UserUid).once('value', snap => {
                var res = snap.val()
                let tempstore = Object.keys(res)
                this.afDB.database.ref('Requests').child(userDetails.Id).child('Sent Requests').child(tempstore[0]).remove().then(() => {
                  resolve(true)
                }).catch((err) => {
                  reject(err)
                })
              })
            }).catch((err) => {
              reject(err)
            })
           }).catch((err) => {
             reject(err)
           })
    })
    return promise
  }





  acceptRquest(userDetails) {
    var notificationDetails = {
      Type: 'Friend'
    }


  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('Friends').child(userDetails.Id).push({
  			Id: this.UserUid
  		}).then(() => {
  			this.afDB.database.ref('Friends').child(this.UserUid).push({
  				Id: userDetails.Id
  			}).then(() => {

          this.deleteReceivedRequest(userDetails).then(() => {
            
            this.notificationProvider.pushNotification(userDetails, notificationDetails).then(() => {
              resolve(true)
            }).catch((err) => {
              reject(err)
            })


          }).catch((err) => {
            reject(err)
          })

  			})
  		})
  	})
  	return promise
  }







  blockSentRequest(userDetails) {
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Block List').child(userDetails.Id).push({
        Id: this.UserUid
      }).then(() => {
        this.afDB.database.ref('Block List').child(this.UserUid).push({
          Id: userDetails.Id
        }).then(() => {
          this.deleteSentRequest(userDetails).then(() => {
            resolve(true)
          }).catch((err) => {
            reject(err)
          })
        })
      })
    })
    return promise
  }




  blockReceivedRequest(userDetails) {
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Block List').child(userDetails.Id).push({
        Id: this.UserUid
      }).then(() => {
        this.afDB.database.ref('Block List').child(this.UserUid).push({
          Id: userDetails.Id
        }).then(() => {
          this.deleteReceivedRequest(userDetails).then(() => {
            resolve(true)
          }).catch((err) => {
            reject(err)
          })
        })
      })
    })
    return promise
  }





}