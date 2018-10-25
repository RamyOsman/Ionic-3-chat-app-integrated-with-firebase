import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';


import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';

declare var window: any;


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {



	userDetails = {
		Email: '',
		Password: '',
		Phone: '',
		Name: '',
		agreeWithPolicy: false
	}

	showPasswordText = false
	isenabled = false

	email = false
	password = false
	name = false
	phone = false
	agreeWithPolicy = false

  constructor(public navCtrl: NavController, public authProvider: AuthProvider, public loadCtrl: LoadingController, private platform: Platform) {

  }



  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })  	
  }


register() {
	let load = this.loadCtrl.create({
		content: 'Creating Account ...'
	})

	load.present()
	this.authProvider.register(this.userDetails).then(() => {
		load.dismiss()
		this.navCtrl.setRoot(TabsPage)
		window.localStorage.setItem('userstate', 'logedIn')
		window.localStorage.setItem('userid', this.authProvider.afAuth.auth.currentUser.uid)
	}).catch((err) => {
		load.dismiss()
		var error = err.message
		this.showToast(error)
	})
}





	showHide() {
		if (this.showPasswordText == false) {
			this.showPasswordText = true
		} else {
			this.showPasswordText = false
		}
	}





	nameInput(value) {
		if (this.userDetails.Name.length < 6) {
			this.name = false
		} else {
			this.name = true
		}

		if (this.userDetails.Name.length < 6) {
			this.isenabled = false
		} else {
			if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
				this.isenabled = false
			} else {
				if (this.userDetails.Password.length < 6) {
					this.isenabled = false
				} else {
					if (this.userDetails.Phone.length < 11) {
						this.isenabled = false
					} else {
						if (this.userDetails.agreeWithPolicy == false) {
							this.isenabled = false
						} else {
							this.isenabled = true
						}
					}
				}
			}			
		}
	}




	emailInput(value){
		if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
			this.email = false
		} else {
			this.email = true
		}


		if (this.userDetails.Name.length < 6) {
			this.isenabled = false
		} else {
			if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
				this.isenabled = false
			} else {
				if (this.userDetails.Password.length < 6) {
					this.isenabled = false
				} else {
					if (this.userDetails.Phone.length < 11) {
						this.isenabled = false
					} else {
						if (this.userDetails.agreeWithPolicy == false) {
							this.isenabled = false
						} else {
							this.isenabled = true
						}
					}
				}
			}			
		}		
	}



	passwordInput(value) {
		if (this.userDetails.Password.length < 6) {
			this.password = false
		} else {
			this.password = true
		}

		if (this.userDetails.Name.length < 6) {
			this.isenabled = false
		} else {
			if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
				this.isenabled = false
			} else {
				if (this.userDetails.Password.length < 6) {
					this.isenabled = false
				} else {
					if (this.userDetails.Phone.length < 11) {
						this.isenabled = false
					} else {
						if (this.userDetails.agreeWithPolicy == false) {
							this.isenabled = false
						} else {
							this.isenabled = true
						}
					}
				}
			}			
		}
	}





	phoneInput(value) {
		if (this.userDetails.Phone.length < 11) {
			this.phone = false
		} else {
			this.phone = true
		}

		if (this.userDetails.Name.length < 6) {
			this.isenabled = false
		} else {
			if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
				this.isenabled = false
			} else {
				if (this.userDetails.Password.length < 6) {
					this.isenabled = false
				} else {
					if (this.userDetails.Phone.length < 11) {
						this.isenabled = false
					} else {
						if (this.userDetails.agreeWithPolicy == false) {
							this.isenabled = false
						} else {
							this.isenabled = true
						}
					}
				}
			}			
		}
	}



	agreeWithPolicyInput(value) {
		if (this.userDetails.agreeWithPolicy == false) {
			this.agreeWithPolicy = false
		} else {
			this.agreeWithPolicy = true
		}

		if (this.userDetails.Name.length < 6) {
			this.isenabled = false
		} else {
			if (this.userDetails.Email == '' || !this.userDetails.Email.match(/^[a-zA-Z0-9-_\.]+@[a-z]{2,}\.[a-z]{2,4}$/)) {
				this.isenabled = false
			} else {
				if (this.userDetails.Password.length < 6) {
					this.isenabled = false
				} else {
					if (this.userDetails.Phone.length < 11) {
						this.isenabled = false
					} else {
						if (this.userDetails.agreeWithPolicy == false) {
							this.isenabled = false
						} else {
							this.isenabled = true
						}
					}
				}
			}			
		}
	}





















	backToLogin() {
		this.navCtrl.pop()
	}






}