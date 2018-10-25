import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform } from 'ionic-angular';


import { UsersProvider } from '../../providers/users/users';

import { RequestProvider } from '../../providers/request/request';

import { SuperTabsController } from 'ionic2-super-tabs';

declare var window: any;


@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

	users = []

looding = true

  constructor(private superTabsCtrl: SuperTabsController, public navCtrl: NavController, private platform: Platform, public loadCtrl: LoadingController, public usersProvider: UsersProvider, public alertCtrl: AlertController, public requestProvider: RequestProvider) {

  }

  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })  	
  }



  ionViewWillEnter() {
    this.superTabsCtrl.showToolbar(false)
  	this.usersProvider.getAllUsers().then((res: any) => {
      this.looding = false
  		this.users = res
  	}).catch((err) => {
  		console.log(err)
  	})
  }






  showUserConfirmation(userDetails) {
    const confirm = this.alertCtrl.create({
      title: 'Send Request',
      message: 'The request will be sent to ' + userDetails.Name,
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'half-alert-button',
          handler: () => {
            this.showToast('Cancel')
          }
        },
        {
          text: 'Send',
          cssClass: 'half-alert-button',
          handler: () => {
            this.agreeFun(userDetails)
          }
        }
      ]
    });
    confirm.present();
  }




  agreeFun(userDetails) {
  	let load = this.loadCtrl.create({
  		content: 'Sending Request to ' + userDetails.Name,
      duration: 5000
  	})

  	load.present()
  	this.requestProvider.makeRequest(userDetails).then(() => {
  		if (this.users.length > 1) {
  			this.usersProvider.getAllUsers().then((res: any) => {
  				this.users = res
  				load.dismiss()
  				this.showToast('Request has been sent to ' + userDetails.Name)
  			}).catch((err) => {
  				load.dismiss()
  				this.showToast(err)
  			})
  		} else {
  			load.dismiss()
  			this.navCtrl.pop()
  			this.showToast('Request has been sent to ' + userDetails.Name)
  		}
  		
  	}).catch((err) => {
  		load.dismiss()
  		this.showToast(err)
  	})


  }













}