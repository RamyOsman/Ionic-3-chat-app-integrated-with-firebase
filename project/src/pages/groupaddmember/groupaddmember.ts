import { Component, NgZone } from '@angular/core';
import { NavController, Events, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';

import { GroupProvider } from '../../providers/group/group';

declare var window: any;
import { ProfilePage } from '../profile/profile';


@Component({
  selector: 'page-groupaddmember',
  templateUrl: 'groupaddmember.html',
})
export class GroupaddmemberPage {


	groupDetails


	Friends = []


looding = true

  constructor(public navCtrl: NavController, public ngZone : NgZone, public events: Events, public groupProvider: GroupProvider, public navParams: NavParams, public loadCtrl: LoadingController, private platform: Platform, public alertCtrl: AlertController) {
  	this.groupDetails = this.navParams.get('groupDetails')


    this.events.subscribe('AllFriends', () => {
      this.ngZone.run(() => {
        this.looding = false
        this.Friends = this.groupProvider.AllFriends
      })
    }) 

  }




  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })    
  }







  ionViewDidLeave(){
    this.events.subscribe('AllFriends')
  }


  ionViewDidEnter(){
    this.groupProvider.getAllFriends(this.groupDetails)
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
          text: 'Add ' + userDetails.Name + ' to Group',
          handler: () => {
          	this.addMember(userDetails, this.groupDetails)
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




  addMember(userDetails, groupDetails){
  	let load = this.loadCtrl.create({
  		content: 'Adding ' + userDetails.Name + ' to group ...'
  	})

  	load.present()
  	this.groupProvider.addMember(userDetails, groupDetails).then(() => {
  		load.dismiss()
  		this.showToast(userDetails.Name + ' has been added to group')
  	}).catch((err) => {
  		load.dismiss()
  		this.showToast(err)
  	})


  }








}