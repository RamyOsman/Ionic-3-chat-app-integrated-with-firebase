import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'Firebase';




@Injectable()
export class AuthProvider {


  UserUid = window.localStorage.getItem('userid');


  ProfileDetails
  myDetails
  
  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase, public evente: Events) {

  }



  getUserDetails() {
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Users').child(this.UserUid).once('value', snap => {
        var res = snap.val()
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  }



  updateProfile(userDetails){
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Users').child(this.UserUid).update({
        Name: userDetails.Name,
        Phone: userDetails.Phone,
        about: userDetails.about,
      }).then(() => {
        resolve(true)
      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  }










  getMyDetails(){
      this.afDB.database.ref('Users').child(this.UserUid).on('value', snap => {
        this.myDetails;
        this.myDetails = snap.val()

        this.evente.publish('myDetails')
      })
  }


  getProfileDetails(userDetails){
      this.afDB.database.ref('Users').child(userDetails.Id).on('value', snap => {
        this.ProfileDetails;
        this.ProfileDetails = snap.val()

        this.evente.publish('ProfileDetails')
      })
  }




  uploadProfilePhoto(picURL){
    var promise = new Promise((resolve, reject) => {
      firebase.storage().ref('Profile Picture').child(this.UserUid + '.jpg').putString(picURL, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.afDB.database.ref('Users').child(this.UserUid).update({
            Photo: downloadURL
          }).then(() => {
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
    return promise
  }


  uploadCover(picURL){
    var promise = new Promise((resolve, reject) => {
      firebase.storage().ref('Covers').child(this.UserUid + '.jpg').putString(picURL, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.afDB.database.ref('Users').child(this.UserUid).update({
            bgPhoto: downloadURL
          }).then(() => {
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
    return promise
  }







  login(userDetails) {
  	var promise = new Promise((resolve, reject) => {
  		this.afAuth.auth.signInWithEmailAndPassword(userDetails.Email, userDetails.Password).then(() => {
  			resolve(true)
  		}).catch((err) => {
  			reject(err)
  		})
  	})
  	return promise
  }



  forgetPassword(userDetails) {
  	var promise = new Promise((resolve, reject) => {
  		this.afAuth.auth.sendPasswordResetEmail(userDetails.Email).then(() => {
  			resolve(true)
  		}).catch((err) => {
  			reject(err)
  		})
  	})
  	return promise  	
  }




    register(userDetails) {
  	var promise = new Promise((resolve, reject) => {
  		this.afAuth.auth.createUserWithEmailAndPassword(userDetails.Email, userDetails.Password).then(() => {
  			this.afDB.database.ref('Users').child(this.afAuth.auth.currentUser.uid).set({
  				Name: userDetails.Name,
  				Email: userDetails.Email,
  				Phone: userDetails.Phone,
  				Id: this.afAuth.auth.currentUser.uid,
          Status: 'Offline',
          about: "Hey there! I'm using Chat App.",
          Photo: 'https://firebasestorage.googleapis.com/v0/b/chat-app-f6a12.appspot.com/o/user.png?alt=media&token=79419e48-423a-42c3-92b2-16027651b931'
  			}).then(() => {
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





  logOut() {
  	var promise = new Promise((resolve, reject) => {
  		this.afAuth.auth.signOut().then(() => {
  			resolve(true)
  		}).catch((err) => {
  			reject(err)
  		})
  	})
  	return  promise;
  }




  onlineStatus(){
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Users').child(this.UserUid).update({
        Status: 'Online'
      }).then(() => {
        resolve(true)
      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  }


  offlineStatuss(){
    var promise = new Promise((resolve, reject) => {
      this.afDB.database.ref('Users').child(this.UserUid).update({
        Status: 'Offline'
      }).then(() => {
        resolve(true)
      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  }

  offlineStatus(){
    var promise = new Promise((resolve, reject) => {
      var ref = this.afDB.database.ref('Users').child(this.UserUid)
      ref.onDisconnect().update({
        Status: 'Offline'
      }).then(() => {
        resolve(true)
      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  }











}