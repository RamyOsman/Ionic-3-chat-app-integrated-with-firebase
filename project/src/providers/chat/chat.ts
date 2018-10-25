import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'Firebase';




@Injectable()
export class ChatProvider {


  UserUid = window.localStorage.getItem('userid');

  userDetails


  allMessages = []

  Conversations = []
  buddyUsers = []


  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase, public evente: Events) {

  }


  initialize(user) {
  	this.userDetails = user
  }





  getMessages(userDetails){
     this.afDB.database.ref('Chat').child(this.UserUid).child(userDetails.Id).on('value', snap => {
        this.allMessages = []

        var res = snap.val()
        for (var i in res){
          this.allMessages.push(res[i])
        }

        this.evente.publish('messages')
      })    
  }











  sendMessage(messageDetails){
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Chat').child(this.UserUid).child(this.userDetails.Id).push({
        Body : messageDetails.body,
        Id: this.UserUid,
        Time: firebase.database.ServerValue.TIMESTAMP
      }).then((snap) => {
        var key = snap.key
        this.afDB.database.ref('Chat').child(this.userDetails.Id).child(this.UserUid).child(key).set({
          Body : messageDetails.body,
          Id: this.UserUid,
          Time: firebase.database.ServerValue.TIMESTAMP,
          Key: key
        }).then(() => {
          this.afDB.database.ref('Chat').child(this.UserUid).child(this.userDetails.Id).child(key).update({
            Key: key
          }).then(() => {
            






            this.afDB.database.ref('Conversations').child(this.UserUid).orderByChild('Id').equalTo(this.userDetails.Id).once('value', snapshot => {
              var res = snapshot.val()


              if (res != null){
                var store = Object.keys(res)
                this.afDB.database.ref('Conversations').child(this.UserUid).child(store[0]).remove().then(() => {
                  this.afDB.database.ref('Conversations').child(this.UserUid).push({
                    Id: this.userDetails.Id,
                    Body: messageDetails.body,
                    Time: firebase.database.ServerValue.TIMESTAMP
                  }).then(() => {
                    this.afDB.database.ref('Conversations').child(this.userDetails.Id).orderByChild('Id').equalTo(this.UserUid).once('value', snapshot => {
                      var res = snapshot.val()

                      if (res != null) {
                        let store = Object.keys(res)
                         this.afDB.database.ref('Conversations').child(this.userDetails.Id).child(store[0]).remove().then(() => {
                           this.afDB.database.ref('Conversations').child(this.userDetails.Id).push({
                            Id: this.UserUid,
                            Body: messageDetails.body,
                            Time: firebase.database.ServerValue.TIMESTAMP
                          }).then(() => {
                            resolve(true)
                          })
                         }).catch((err) => {
                           reject(err)
                         })
                      } else {
                        this.afDB.database.ref('Conversations').child(this.userDetails.Id).push({
                          Id: this.UserUid,
                          Body: messageDetails.body,
                          Time: firebase.database.ServerValue.TIMESTAMP
                        }).then(() => {
                          resolve(true)
                        })
                      }

                    }).catch((err) => {
                      reject(err)
                    })
                  })
                }).catch((err) => {
                  reject(err)
                })

              } else {
                this.afDB.database.ref('Conversations').child(this.UserUid).push({
                  Id: this.userDetails.Id,
                  Body: messageDetails.body,
                  Time: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                  this.afDB.database.ref('Conversations').child(this.userDetails.Id).orderByChild('Id').equalTo(this.userDetails.Id).once('value', snapshot => {
                    var res = snapshot.val()

                    if (res != null) {
                      let store = Object.keys(res)
                      this.afDB.database.ref('Conversations').child(this.userDetails.Id).child(store[0]).remove().then(() => {
                        this.afDB.database.ref('Conversations').child(this.userDetails.Id).push({
                          Id: this.UserUid,
                          Body: messageDetails.body,
                          Time: firebase.database.ServerValue.TIMESTAMP
                        }).then(() => {
                          resolve(true)
                        })
                      }).catch((err) => {
                        reject(err)
                      })
                    } else {
                      this.afDB.database.ref('Conversations').child(this.userDetails.Id).push({
                        Id: this.UserUid,
                        Body: messageDetails.body,
                        Time: firebase.database.ServerValue.TIMESTAMP
                      }).then(() => {
                        resolve(true)
                      })
                    }

                  }).catch((err) => {
                    reject(err)
                  })
                })
              }

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







  getConversations(){
    this.afDB.database.ref('Conversations').child(this.UserUid).on('value', snap => {
      this.Conversations = []
      var res = snap.val()
      var array1 = []
      for (var i in res){
        this.Conversations.push(res[i])
        this.Conversations
        array1.push(res[i].Id)
      }
       this.afDB.database.ref('Users').on('value', snap => {
          this.buddyUsers = []

          var res = snap.val()
          var array = []
          for (var i in res){
            array.push(res[i])
          }
            
            array1.reverse()
            
          for(var d in array1) {
            for(var c in array){
              if(array[c].Id === array1[d]) {
                this.buddyUsers.push(array[c])
                this.buddyUsers
              }              
            }
          }

          this.evente.publish('Conversations')

        })
      })    
  }





/*

        this.afDB.database.ref('Chat').child(myDetails.Id).child(friendDetails.Id).limitToLast(1).once('value', snap => {
          var res = snap.val()
          this.afDB.database.ref('Conversations').child(myDetails.Id).orderByChild('Id').equalTo(friendDetails.Id).once('value', snapshot => {
            var res1 = snapshot.val()
            var temp = Object.keys(res1)
            this.afDB.database.ref('Conversations').child(friendDetails.Id).orderByChild('Id').equalTo(myDetails.Id).once('value', snapshot => {
              var res2 = snapshot.val()
              var temp1 = Object.keys(res2)
              for(var i in res){
                this.afDB.database.ref('Conversations').child(myDetails.Id).child(temp[0]).update({
                  Body: res[i].Body,
                  Time: res[i].Time
                }).then(() => {
                  this.afDB.database.ref('Conversations').child(friendDetails.Id).child(temp1[0]).update({
                    Body: res[i].Body,
                    Time: res[i].Time
                  }).then(() => {
                    resolve(true)
                  })
                })
              }
            }).catch((err) => {
              reject(err)
            })
          }).catch((err) => {
            reject(err)
          })
        }).catch((err) => {
          reject(err)
        })
*/


  deleteMessageForMe(message, myDetails, friendDetails){
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Chat').child(myDetails.Id).child(friendDetails.Id).child(message.Key).remove().then(() => {


        this.afDB.database.ref('Chat').child(myDetails.Id).child(friendDetails.Id).limitToLast(1).once('value', snap => {
          var res = snap.val()
          this.afDB.database.ref('Conversations').child(myDetails.Id).orderByChild('Id').equalTo(friendDetails.Id).once('value', snapshot => {
            var res1 = snapshot.val()
            var temp = Object.keys(res1)

              for(var i in res){
                this.afDB.database.ref('Conversations').child(myDetails.Id).child(temp[0]).update({
                  Body: res[i].Body,
                  Time: res[i].Time
                }).then(() => {
                  resolve(true)
                })
              }

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
    return promise
  }









  deleteMessageForAll(message, myDetails, friendDetails){
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Chat').child(myDetails.Id).child(friendDetails.Id).child(message.Key).remove().then(() => {
        this.afDB.database.ref('Chat').child(friendDetails.Id).child(myDetails.Id).child(message.Key).remove().then(() => {
          resolve(true)
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  }



































}