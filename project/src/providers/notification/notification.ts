import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'Firebase';





@Injectable()
export class NotificationProvider {


  UserUid = window.localStorage.getItem('userid');


  NotificationsUnread = []
  buddyUsersUnread = []

  NotificationsRead = []
  buddyUsersRead = []


  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase, public evente: Events) {

  }



  getMyNotificationsUnread() {
     this.afDB.database.ref('Notifications').child(this.UserUid).child('Un Read').on('value', snap => {
        this.NotificationsUnread = []

        var res = snap.val()
        var array1 = []
        for (var i in res){
          this.NotificationsUnread.push(res[i])
          array1.push(res[i].Id)
        }

		this.afDB.database.ref('Users').on('value', snap => {
          this.buddyUsersUnread = []

          var res = snap.val()
          var array = []
          for (var i in res){
            array.push(res[i])
          }
            
          for(var d in array1) {
            for(var c in array){
              if(array[c].Id === array1[d]) {
                this.buddyUsersUnread.push(array[c])
              }              
            }
          }


          this.evente.publish('Notifications')

        })


      })    
  }

  getMyNotificationsRead() {
     this.afDB.database.ref('Notifications').child(this.UserUid).child('Read').on('value', snap => {
        this.NotificationsRead = []

        var res = snap.val()
        var array1 = []
        for (var i in res){
          this.NotificationsRead.push(res[i])
          array1.push(res[i].Id)
        }

		this.afDB.database.ref('Users').on('value', snap => {
          this.buddyUsersRead = []

          var res = snap.val()
          var array = []
          for (var i in res){
            array.push(res[i])
          }
            
          for(var d in array1) {
            for(var c in array){
              if(array[c].Id === array1[d]) {
                this.buddyUsersRead.push(array[c])
              }              
            }
          }


          this.evente.publish('Notifications')

        })


      })    
  }






  pushNotification(userDetails, notificationDetails) {
  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('dsa').push({
  			Id: 'fdf'
  		}).then((snap) => {
  			var key = snap.key

	  		this.afDB.database.ref('Notifications').child(userDetails.Id).child('Un Read').child(key).set({
	  			Type: notificationDetails.Type,
	  			Id: this.UserUid,
	  			Key: key
	  		}).then(() => {
	  			this.afDB.database.ref('dsa').child(key).remove().then(() => {
	  				resolve(true)
	  			}).catch((err) => {
	  				reject(err)
	  			})
	  		})


  		})
  	})
  	return promise
  }




  makeNotificationAsRead(notificationDetails) {
  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('Notifications').child(this.UserUid).child('Read').child(notificationDetails.Key).set(notificationDetails).then(() => {
  			this.afDB.database.ref('Notifications').child(this.UserUid).child('Un Read').child(notificationDetails.Key).remove().then(() => {
  				resolve(true)
  			}).catch((err) => {
  				reject(err)
  			})
  		})
  	})
  	return promise
  }





}