import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';


import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { ResetPasswordPage } from '../reset-password/reset-password';


declare var window: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


	userDetails = {
		Email: '',
		Password: ''
	}


	showPasswordText = false
	isenabled = false

	email = false
	password = false


	registerPage = RegisterPage

  constructor(public navCtrl: NavController, public authProvider: AuthProvider, public loadCtrl: LoadingController, private platform: Platform) {

  }





  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })  	
  }


	login() {
		let load = this.loadCtrl.create({
			content: 'Processing ....'
		})

		load.present()
		this.authProvider.login(this.userDetails).then(() => {
			load.dismiss()
			this.navCtrl.setRoot(TabsPage)
			this.authProvider.onlineStatus()
			window.localStorage.setItem('userstate', 'logedIn')
			window.localStorage.setItem('userid', this.authProvider.afAuth.auth.currentUser.uid)
		}).catch((err) => {
			load.dismiss()
			var error = err.message
			this.showToast(error)
		})

	}





	register() {
		this.navCtrl.push(RegisterPage)
	}


	forgrtPassword() {
		this.navCtrl.push(ResetPasswordPage)
	}








	showHide() {
		if (this.showPasswordText == false) {
			this.showPasswordText = true
		} else {
			this.showPasswordText = false
		}
	}



	emailInput(value){

		if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
			this.email = false
		} else {
			this.email = true
		}


		if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
			this.isenabled = false
		} else {
			if (this.userDetails.Password.length < 6) {
				this.isenabled = false
			} else {
				this.isenabled = true
			}
		}		
	}



	passwordInput(value) {
		if (this.userDetails.Password.length < 6) {
			this.password = false
		} else {
			this.password = true
		}

		if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
			this.isenabled = false
		} else {
			if (this.userDetails.Password.length < 6) {
				this.isenabled = false
			} else {
				this.isenabled = true
			}
		}
	}











}