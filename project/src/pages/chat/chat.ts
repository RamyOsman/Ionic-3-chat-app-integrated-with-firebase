import { Component, NgZone } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';


import { SuperTabsController } from 'ionic2-super-tabs';
import { FriendsProvider } from '../../providers/friends/friends';

import { UsersPage } from '../users/users';
import { ChatbodyPage } from '../chatbody/chatbody';
import { AuthProvider } from '../../providers/auth/auth';

import { ChatProvider } from '../../providers/chat/chat';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

	Friends = []
  allUsers = []
  Conversations = []

  onlineStatus = 'Online'
  offlineStatus = "Offline"


  looding = true

  constructor(private superTabsCtrl: SuperTabsController, public chatProvider: ChatProvider, public authProvider: AuthProvider, public ngZone: NgZone, public events: Events, public friendsProvider: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.events.subscribe('Friends', () => {
      this.ngZone.run(() => {
        this.Friends = this.friendsProvider.Friends
      })
    })


    var days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    var today = new Date
    var toYear = today.getFullYear()
    var toMonth = 1 + today.getMonth()
    var toDays = today.getDate()

    var todayRes1 = toYear + '/' + toMonth + '/' + toDays
    var todayRes2 = toYear + '/' + toMonth
    var todayRes3 = toYear



    this.events.subscribe('Conversations', () => {
      this.ngZone.run(() => {
        this.looding = false
        this.Conversations = this.chatProvider.Conversations
        this.allUsers = this.chatProvider.buddyUsers


        for (var key in this.Conversations) {

          var d = new Date(this.Conversations[key].Time)

          var years = d.getFullYear()
          var month = 1 + d.getMonth()
          var day = d.getDate()
          var hours = d.getHours()
          var minutes = '0' + d.getMinutes()

          var messageTime1 = years + '/' + month + '/' + day
          var messageTime2 = years + '/' + month
          var messageTime3 = years

          var DN = toDays - day

          if (messageTime1 == todayRes1) {
            this.Conversations[key].Time = hours + ":" + minutes.substr(-2)
          } else {
            if (messageTime2 == todayRes2) {
              if (DN == 1) {
                this.Conversations[key].Time = 'Yestersay,' + hours + ":" + minutes.substr(-2)
              } else if (DN < 7) {
                this.Conversations[key].Time = days[DN] + hours + ":" + minutes.substr(-2)
              } else if (DN > 7) {
                this.Conversations[key].Time = months[month] + ',' + day + ',' + years
              }
            } else {
              this.Conversations[key].Time = months[month] + ',' + day + ',' + years
            }
          }

        }





      })
    })

  }






  ionViewWillEnter() {
    this.superTabsCtrl.showToolbar(true)
  }






  ionViewDidLeave(){
    this.events.subscribe('Friends')
    this.events.subscribe('Conversations')
  }




  ionViewDidEnter(){
    this.friendsProvider.getFriends()
    this.chatProvider.getConversations()
  }








  openUsersPage() {
  	this.navCtrl.push(UsersPage)
  }





  openChatBody(userDetails) {
    this.chatProvider.initialize(userDetails)
  	this.navCtrl.push(ChatbodyPage, {
      Details: userDetails
    })
  }





}