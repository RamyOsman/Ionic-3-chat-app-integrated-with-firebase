import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { SuperTabsController } from 'ionic2-super-tabs';

import { NotificationProvider } from '../../providers/notification/notification';
import { RequestsPage } from '../requests/requests';


@Component({
  selector: 'page-notification-unread',
  templateUrl: 'notification-unread.html',
})
export class NotificationUnreadPage {

	Notifications = []
	allUsers = []

	looding = true

  constructor(private superTabsCtrl: SuperTabsController, public notificationsProvider: NotificationProvider, public navCtrl: NavController, public ngZone: NgZone, public events: Events) {
    this.events.subscribe('Notifications', () => {
      this.ngZone.run(() => {
      	this.looding = false
        this.Notifications = this.notificationsProvider.NotificationsUnread
        this.allUsers = this.notificationsProvider.buddyUsersUnread
      })
    })  	
  }


  ionViewWillEnter() {
      this.superTabsCtrl.showToolbar(true)
  }


  ionViewDidLeave(){
    this.events.subscribe('Notifications')
  }


  ionViewDidEnter(){
    this.notificationsProvider.getMyNotificationsUnread()
  }


	showNotificationsConfirmation(details){
		if (details.Type == 'Request') {
			this.navCtrl.push(RequestsPage)
		} else if (details.Type == 'Friend') {

    } else {
      
    }
		this.notificationsProvider.makeNotificationAsRead(details)
	}




}
