import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, ActionSheetController, LoadingController, Platform } from 'ionic-angular';
import { GroupProvider } from '../../providers/group/group';

import { GroupaddmemberPage } from '../groupaddmember/groupaddmember';
import { GroupmemberPage } from '../groupmember/groupmember';

import { SuperTabsController } from 'ionic2-super-tabs';


declare var window: any;


@Component({
  selector: 'page-groupbody',
  templateUrl: 'groupbody.html',
})
export class GroupbodyPage {

	groupDetails


	User_Uid = this.groupProvider.UserUid


	newMessage = {
		body: ''
	}


	allMessages = []
	allUsers = []

  constructor(private superTabsCtrl: SuperTabsController, public ngZone: NgZone, public events: Events, public loadCtrl: LoadingController, private platform: Platform, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public groupProvider: GroupProvider, public navParams: NavParams) {
 	this.groupDetails = this.navParams.get('groupDetails')

    this.events.subscribe('Messages', () => {
      this.ngZone.run(() => {
        this.allMessages = this.groupProvider.messages
        this.allUsers = this.groupProvider.users
      })
    })

  }



  ionViewDidLeave(){
    this.events.subscribe('Messages')
  }


  ionViewDidEnter(){
    this.groupProvider.getAllMessages()
  }



  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })    
  }



  ionViewWillEnter(){
  	this.superTabsCtrl.showToolbar(false)
  }





  showActionSheet() {
  	if (this.groupDetails.Owner == this.groupProvider.UserUid) {

	    const actionSheet = this.actionSheetCtrl.create({
	      title: this.groupDetails.Name,
	      buttons: [
	        {
	          text: 'Group Members',
	          icon:'contacts',
	          handler: () => {
	          	this.showMembers(this.groupDetails)
	          }
	        },{
	          text: 'Add Member',
	          icon:'add',
	          handler: () => {
	          	this.addMember(this.groupDetails)
	          }
	        },{
	          text: 'Group Info',
	          icon:'alert',
	          handler: () => {
	          	this.groupInfo(this.groupDetails)
	          }
	        },{
	          text: 'Delete Group',
	          icon:'trash',
	          handler: () => {
	          	this.deleteGroup(this.groupDetails)
	          }
	        },{
	          text: 'Cancel',
	          icon:'close',
	          handler: () => {
	            this.showToast('Cancel clicked');
	          }
	        }
	      ]
	    })
	    actionSheet.present()
  	} else {
	    const actionSheet = this.actionSheetCtrl.create({
	      title: this.groupDetails.Name,
	      buttons: [
	        {
	          text: 'Group Members',
	          icon:'contacts',
	          handler: () => {
	          	this.showMembers(this.groupDetails)
	          }
	        },{
	          text: 'Group Info',
	          icon:'alert',
	          handler: () => {
	          	this.groupInfo(this.groupDetails)
	          }
	        },{
	          text: 'Leave Group',
	          icon:'log-out',
	          handler: () => {
	          	this.leaveGroup(this.groupDetails)
	          }
	        },{
	          text: 'Cancel',
	          icon:'close',
	          handler: () => {
	            this.showToast('Cancel clicked');
	          }
	        }
	      ]
	    })
	    actionSheet.present()
  	}
  }



  leaveGroup(groupDetails){
  	let load = this.loadCtrl.create({
  		content: 'Leaving Group ...'
  	})

  	load.present()
  	this.groupProvider.leaveGroup(groupDetails).then(() => {
  		load.dismiss()
  		this.showToast('You have been leaved')
  		this.navCtrl.pop()
  	}).catch((err) => {
  		load.dismiss()
  		this.showToast(err)
  	})

  }




  deleteGroup(groupDetails){
  	let load = this.loadCtrl.create({
  		content: 'Deleting Group ...'
  	})

  	load.present()
  	this.groupProvider.deleteGroup(groupDetails).then(() => {
  		load.dismiss()
  		this.showToast('Group has been deleted')
  		this.navCtrl.pop()
  	}).catch((err) => {
  		load.dismiss()
  		this.showToast(err)
  	})

  }


  showMembers(groupDetails){
  	this.navCtrl.push(GroupmemberPage, {
  		groupDetails: groupDetails
  	})
  }

  addMember(groupDetails){
  	this.navCtrl.push(GroupaddmemberPage, {
  		groupDetails: groupDetails
  	})
  }




  groupInfo(groupDetails){

  }







  sendMessage() {
  	var res = this.newMessage.body
  	var res1 = res.trim()
  	if (res1 == '') {
  		this.showToast("can't send empty message")
  		this.newMessage.body = ''
  	} else {
  		this.groupProvider.sendMessage(this.newMessage, this.groupDetails).then(() => {
  			this.newMessage.body = ''
  		}).catch((err) => {
  			console.log(err)
  		})
  	}  	
  }








}