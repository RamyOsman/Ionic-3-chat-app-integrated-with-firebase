import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, Platform, Events, AlertController, LoadingController } from 'ionic-angular';

import { SuperTabsController } from 'ionic2-super-tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { ChatProvider } from '../../providers/chat/chat';


import { Clipboard } from '@ionic-native/clipboard';


declare var window: any;

@Component({
  selector: 'page-chatbody',
  templateUrl: 'chatbody.html',
})
export class ChatbodyPage {


	userDetails


  details ={}

  myDetails ={}


  onlineStatus = 'Online'
  offlineStatus = 'Offline'


  newMessage = {
  	body: ''
  }

  allMessages = []


  @ViewChild('content') content: Content

  constructor(private superTabsCtrl: SuperTabsController, private clipboard: Clipboard, public loadCtrl: LoadingController, private platform: Platform, public chatProvider: ChatProvider, public alertCtrl: AlertController, public authProvider: AuthProvider, public navCtrl: NavController, public navParams: NavParams, public ngZone: NgZone, public events: Events) {
  	this.userDetails = this.navParams.get('Details')

    this.events.subscribe('ProfileDetails', () => {
      this.ngZone.run(() => {
        this.details = this.authProvider.ProfileDetails
      })
    })

    this.events.subscribe('myDetails', () => {
      this.ngZone.run(() => {
        this.myDetails = this.authProvider.myDetails
      })
    })

    this.events.subscribe('messages', () => {
      this.ngZone.run(() => {
        this.allMessages = this.chatProvider.allMessages
      })
    })

    if (this.allMessages.length > 6) {
      setTimeout(() => {
        for(let i = 0; i < 10; i++){
          this.allMessages[i]
        }
      }, 300)
    }


  }





  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })    
  }



  callFunction(){
    this.content.scrollToBottom(0)
  }



  ionViewWillEnter() {
  	this.superTabsCtrl.showToolbar(false)
  }


  ionViewDidLeave(){
    this.events.subscribe('ProfileDetails')
    this.events.subscribe('myDetails')
    this.events.subscribe('messages')
  }


  ionViewDidEnter(){
    this.authProvider.getProfileDetails(this.userDetails)
    this.authProvider.getMyDetails()
    this.chatProvider.getMessages(this.userDetails)
  }












  sendMessage() {
  	var res = this.newMessage.body
  	var res1 = res.trim()
  	if (res1 == '') {
  		this.showToast("can't send empty message")
  		this.newMessage.body = ''
  	} else {
  		this.chatProvider.sendMessage(this.newMessage).then(() => {
  			this.newMessage.body = ''
  		}).catch((err) => {
  			console.log(err)
  		})
  	}
  }








  showMessageConfirm(message, myDetails, friendDetails){
    const confirm = this.alertCtrl.create({
      title: 'Message',
      message: 'Tap On Option',
      buttons: [
        {
          text: 'Copy Message',
          handler: () => {
            this.copyMessage(message)
          }
        },
        {
          text: 'Delete For Me',
          handler: () => {
            this.deleteMessageForMe(message, myDetails, friendDetails)
          }
        },
        {
          text: 'Delete For All',
          handler: () => {
            this.deleteMessageForAll(message, myDetails, friendDetails)
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            this.showToast('Cancel')
          }
        }
      ]
    });
    confirm.present();
  }





  copyMessage(message) {
    this.clipboard.copy(message.Body).then(() => {
      this.showToast('Message coppied to clipboard')
    })
  }



  deleteMessageForMe(message, myDetails, friendDetails){
    let load = this.loadCtrl.create({
      content: 'Deleting Message ...'
    })
    load.present()
    this.chatProvider.deleteMessageForMe(message, myDetails, friendDetails).then(() => {
      load.dismiss()
      this.showToast('Message has been deleted')
    }).catch((err) => {
      load.dismiss()
      this.showToast(err)
    })
  }


  deleteMessageForAll(message, myDetails, friendDetails){
    let load = this.loadCtrl.create({
      content: 'Deleting Message ...'
    })
    load.present()    
    this.chatProvider.deleteMessageForAll(message, myDetails, friendDetails).then(() => {
      load.dismiss()
      this.showToast('Message has been deleted')
    }).catch((err) => {
      load.dismiss()
      this.showToast(err)
    })
  }










}