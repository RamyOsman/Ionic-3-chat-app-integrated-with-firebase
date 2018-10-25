import { Injectable } from '@angular/core';


import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';




@Injectable()
export class UsersProvider {

	UserUid = window.localStorage.getItem('userid');

  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase) {

  }





  getAllUsers(){
  	var promise = new Promise((resolve, reject) => {
  		this.afDB.database.ref('Users').once('value', snap => {
  			var res = snap.val()
  			let array = []

  			for(var i in res) {
  				array.push(res[i])
  			}


  			for (var aa = array.length - 1; aa >= 0; aa--) {
  				if (array[aa].Id === this.UserUid) {
  					array.splice(aa, 1)
  				}
  			}



  			this.afDB.database.ref('Requests').child(this.UserUid).child('Sent Requests').once('value', snap => {
  				var res = snap.val()
  				let array2 = []
  				for(var i in res) {
  					array2.push(res[i])
  				}


          for (var aa = array.length - 1; aa >= 0; aa--) {
            for(var bb = 0; bb < array2.length; bb++){
              if(array[aa].Id === array2[bb].Id){
                array.splice(aa, 1)
              }
            }
          }


	  			this.afDB.database.ref('Requests').child(this.UserUid).child('Received Requests').once('value', snap => {
	  				var res = snap.val()
	  				let array3 = []
	  				for(var i in res) {
	  					array3.push(res[i])
	  				}

            for (var aa = array.length - 1; aa >= 0; aa--) {
	  				  for (var bb = array3.length - 1; bb >= 0; bb--) {
	  						if(array[aa].Id === array3[bb].Id){
	  							array.splice(aa, 1)
	  						}
	  					}
	  				}


	  				this.afDB.database.ref('Friends').child(this.UserUid).once('value', snap => {
		  				var res = snap.val()
		  				let array4 = []
		  				for(var i in res) {
		  					array4.push(res[i])
		  				}

		  				for (var aa = array.length - 1; aa >= 0; aa--) {
		  					for(var bb = 0; bb < array4.length; bb++){
		  						if(array[aa].Id === array4[bb].Id){
		  							array.splice(aa, 1)
		  						}
		  					}
		  				}	



              this.afDB.database.ref('Block List').child(this.UserUid).once('value', snap => {
                var res = snap.val()
                let array5 = []
                for(var i in res) {
                  array5.push(res[i])
                }

                for (var aa = array.length - 1; aa >= 0; aa--) {
                  for(var bb = 0; bb < array5.length; bb++){
                    if(array[aa].Id === array5[bb].Id){
                      array.splice(aa, 1)
                    }
                  }
                }  

                resolve(array)


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

  		}).catch((err) => {
  			reject(err)
  		})
  	})
  	return promise
  }






}