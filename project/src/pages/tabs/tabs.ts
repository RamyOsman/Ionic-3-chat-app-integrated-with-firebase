import { Component, NgZone } from '@angular/core';
import { Events } from 'ionic-angular';

import { ChatPage } from '../chat/chat';
import { GroupPage } from '../group/group';
import { NotificationsPage } from '../notifications/notifications';
import { SettingsPage } from '../settings/settings';


import { NotificationProvider } from '../../providers/notification/notification';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ChatPage;
  tab2Root = GroupPage;
  tab3Root = NotificationsPage;
  tab4Root = SettingsPage;



  notifications

  constructor(public notificationsProvider: NotificationProvider, public ngZone: NgZone, public events: Events) {
    this.events.subscribe('Notifications', () => {
      this.ngZone.run(() => {
        var res = this.notificationsProvider.NotificationsUnread
        this.notifications = res.length
      })
    }) 
  }


  ionViewDidLeave(){
    this.events.subscribe('Notifications')
  }


  ionViewDidEnter(){
    this.notificationsProvider.getMyNotificationsUnread()
  }





}