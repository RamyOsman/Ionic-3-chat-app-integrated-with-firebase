import { Component, NgZone } from '@angular/core';
import { NavController, Events, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';

import { GroupProvider } from '../../providers/group/group';

import { ProfilePage } from '../profile/profile';

declare var window: any;



@Component({
  selector: 'page-groupmember',
  templateUrl: 'groupmember.html',
})
export class GroupmemberPage {

	GroupMembers = []

	groupDetails

  looding = true

  User_Uid = this.groupProvider.UserUid

  constructor(public navCtrl: NavController, public loadCtrl: LoadingController, private platform: Platform, public alertCtrl: AlertController, public ngZone : NgZone, public events: Events, public groupProvider: GroupProvider, public navParams: NavParams) {
  	this.groupDetails = this.navParams.get('groupDetails')

    this.events.subscribe('GroupMembers', () => {
      this.ngZone.run(() => {
        this.looding = false
        this.GroupMembers = this.groupProvider.groupMembers
      })
    })    


  }



  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })    
  }




  ionViewDidLeave(){
    this.events.subscribe('GroupMembers')
  }




  ionViewDidEnter(){
    this.groupProvider.getGroupMembers(this.groupDetails)
  }




  showMemberConfirmation(userDetails){
  	if (this.groupDetails.Owner = this.groupProvider.UserUid) {
  		if (this.groupDetails.Owner == userDetails.Id) {
  			console.log('You are the admin')
  		} else {
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
		        	text: 'Delete ' + userDetails.Name + ' from Group',
		        	handler: () => {
		        		this.deleteMember(userDetails, this.groupDetails)
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
		    })
		    confirm.present()
  		}
  	} else {
  		console.log('You are not admin')
  	}
  }



  deleteMember(userDetails, groupDetails) {
  	let load = this.loadCtrl.create({
  		content: 'Deleting ' + userDetails.Name +  ' ...'
  	})

  	load.present()
  	this.groupProvider.deleteMember(userDetails, groupDetails).then(() => {
  		load.dismiss()
  		this.showToast(userDetails.Name + ' has been deleted')
  	}).catch((err) => {
  		load.dismiss()
  		this.showToast(err)
  	})  	
  }










}