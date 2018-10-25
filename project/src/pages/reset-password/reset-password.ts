import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';


import { AuthProvider } from '../../providers/auth/auth';

declare var window: any;


@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {



	userDetails = {
		Email: ''
	}



	isenabled = false
	email = false



  constructor(public navCtrl: NavController, public authProvider: AuthProvider, public loadCtrl: LoadingController, private platform: Platform) {
  }


  ionViewWillEnter() {
  	this.userDetails.Email = ''
  }


  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })  	
  }


  forgrtPassword() {
	let load = this.loadCtrl.create({
		content: 'Reseting Password ...'
	})

	load.present()
	this.authProvider.forgetPassword(this.userDetails).then(() => {
		load.dismiss()
		this.showToast('Follow your email instructions')
		this.navCtrl.pop()
	}).catch((err) => {
		load.dismiss()
		var error = err.message
		this.showToast(error)
	})  	
  }



  backToLogin() {
  	this.navCtrl.pop()
  }


	emailInput(value){
		if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
			this.email = false
			this.isenabled = false
		} else {
			this.email = true
			this.isenabled = true
		}	
	}






}