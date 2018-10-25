import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';


import { AuthProvider } from '../../providers/auth/auth';


declare var window: any;


@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {

	userDetails = {
		Name: '',
		Phone: '',
		about: ''
	}



  constructor(public navCtrl: NavController, public loadCtrl: LoadingController, private platform: Platform, public navParams: NavParams, public authProvider: AuthProvider) {
  	this.userDetails = this.navParams.get('userDetails')

  	var res = this.navParams.get('userDetails')
  	this.userDetails.Name = res.Name
  	this.userDetails.Phone = res.Phone
  	this.userDetails.about = res.about

  }




  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })  	
  }



  updateProfile() {
  	let load = this.loadCtrl.create({
		content: 'Processing ....'
	})

  	if (this.userDetails.Name.length < 6) {
  		this.showToast('Name should be at least 6 characters')
  	} else {
  		if (this.userDetails.Phone.length < 11) {
  			this.showToast('Phone should be 11 numbers')
  		} else {
  			if (this.userDetails.about == '') {
				 	this.showToast('about should not be empty')			
  			} else {
  				load.present()
			  	this.authProvider.updateProfile(this.userDetails).then(() => {
			  		load.dismiss()
			  		this.navCtrl.pop()
			  		this.showToast('Details have been updated')
			  	}).catch((err) => {
			  		load.dismiss()
			  		this.showToast(err)
			  	}) 
  			}
  		}
  	}


  }








}