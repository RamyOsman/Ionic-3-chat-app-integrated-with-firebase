import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class FriendsProvider {


	UserUid = window.localStorage.getItem('userid');


  Friends = []

  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase, public evente: Events) {


  }



  getAllFriends() {
  	var promise = new Promise((resolve, reject) => {
  		let Details = []
  		this.afDB.database.ref('Users').once('value', snap => {
  			var res = snap.val()
  			let userDetails = []
  			for (var i in res) {
  				userDetails.push(res[i])
  			}
	  		this.afDB.database.ref('Friends').child(this.UserUid).once('value', snap => {
	  			var res = snap.val()
	  			let array = []
	  			for (var i in res) {
	  				array.push(res[i])
	  			}

	  			for(var ia in userDetails) {
	  				for (var ii in array) {
	  					if (userDetails[ia].Id === array[ii].Id) {
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




  getFriends(){
      this.afDB.database.ref('Users').on('value', snap => {
        
        var res = snap.val()
        let userDetails = []
        for (var i in res) {
          userDetails.push(res[i])
        }
        this.afDB.database.ref('Friends').child(this.UserUid).on('value', snap => {
          this.Friends = []
          var res = snap.val()
          let array = []
          for (var i in res) {
            array.push(res[i])
          }

          for(var ia in userDetails) {
            for (var ii in array) {
              if (userDetails[ia].Id === array[ii].Id) {
                this.Friends.push(userDetails[ia])
              }
            }
          }

          this.evente.publish('Friends')

        })
      })    
  }













  unFriend(userDetails) {
  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('Friends').child(this.UserUid).orderByChild('Id').equalTo(userDetails.Id).once('value', snap => {
  			var res = snap.val()
  			let tempstore = Object.keys(res)
  			this.afDB.database.ref('Friends').child(this.UserUid).child(tempstore[0]).remove().then(() => {
  				this.afDB.database.ref('Friends').child(userDetails.Id).orderByChild('Id').equalTo(this.UserUid).once('value', snap => {
  					var res = snap.val()
  					let tempstore = Object.keys(res)
  					this.afDB.database.ref('Friends').child(userDetails.Id).child(tempstore[0]).remove().then(() => {
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
  		}).catch((err) => {
  			reject(err)
  		})
  	})
  	return promise
  }
















}