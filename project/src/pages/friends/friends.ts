import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform } from 'ionic-angular';


import { FriendsProvider } from '../../providers/friends/friends';
import { BlockProvider } from '../../providers/block/block';
import { ProfilePage } from '../profile/profile';

declare var window: any;

import { SuperTabsController } from 'ionic2-super-tabs';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {


	Friends = []


looding = true



  constructor(private superTabsCtrl: SuperTabsController, public navCtrl: NavController, public loadCtrl: LoadingController, private platform: Platform, public blockProvider: BlockProvider, public alertCtrl: AlertController, public friendsProvider: FriendsProvider) {
  }




  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })    
  }



  ionViewWillEnter() {
    this.superTabsCtrl.showToolbar(false)
  	this.friendsProvider.getAllFriends().then((res: any) => {
      this.looding = false
  		this.Friends = res
  	}).catch((err) => {
  		console.log(err)
  	})
  }




  showFriendsConfirmation(userDetails) {
    const confirm = this.alertCtrl.create({
      title: userDetails.Name,
      message: 'Tap on option',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.showToast('Cancel')
          }
        },
        {
          text: 'Unfriend ' + userDetails.Name,
          handler: () => {
          	this.unfriend(userDetails)
          }
        },
        {
          text: 'Block ' + userDetails.Name,
          handler: () => {
          	this.block(userDetails)
          }
        },
        {
        	text: 'Chat with ' + userDetails.Name,
        	handler: () => {
        		this.openChatBody(userDetails)
        	}
        },{
          text: 'View Profile',
          handler: () => {
            this.navCtrl.push(ProfilePage, {
              userDetails : userDetails
            })
          }
        }
      ]
    });
    confirm.present();
  }





  unfriend(userDetails) {
  	let load = this.loadCtrl.create({
  		content: 'Unfriending ' + userDetails.Name + ' ...'
  	})

  	load.present()
  	this.friendsProvider.unFriend(userDetails).then(() => {
  		if (this.Friends.length > 1) {
  			this.friendsProvider.getAllFriends().then((res: any) => {
  				this.Friends = res
  			}).then(() => {
  				load.dismiss()
  				this.showToast(userDetails.Name + ' has been unfriended')
  			}).catch((err) => {
  				load.dismiss()
  				this.showToast(err)
  			})
  		} else {
  			load.dismiss()
  			this.navCtrl.pop()
  			this.showToast(userDetails.Name + ' has been unfriended')
  		}
  	}).catch((err) => {
  		load.dismiss()
  		this.showToast(err)
  	})
  }



  block(userDetails) {
  	let load = this.loadCtrl.create({
  		content: 'Blocking ' + userDetails.Name + ' ...'
  	})

  	load.present()

  	this.blockProvider.blockUser(userDetails).then(() => {
  		if (this.Friends.length > 1) {
  			this.friendsProvider.getAllFriends().then((res: any) => {
  				this.Friends = res
  			}).then(() => {
  				load.dismiss()
  				this.showToast(userDetails.Name + ' has been blocked')
  			}).catch((err) => {
  				load.dismiss()
  				this.showToast(err)
  			})
  		} else {
  			load.dismiss()
  			this.navCtrl.pop()
  			this.showToast(userDetails.Name + ' has been blocked')
  		}
  	}).catch((err) => {
  		load.dismiss()
  		this.showToast(err)
  	})
  }





  openChatBody(userDetails) {
  	
  }








}