import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';


import { NotificationProvider } from '../../providers/notification/notification';
import { RequestsPage } from '../requests/requests';


import { SuperTabsController } from 'ionic2-super-tabs';

@Component({
  selector: 'page-notification-read',
  templateUrl: 'notification-read.html',
})
export class NotificationReadPage {

	Notifications = []
	allUsers = []

	looding = true

  constructor(private superTabsCtrl: SuperTabsController, public notificationsProvider: NotificationProvider, public navCtrl: NavController, public ngZone: NgZone, public events: Events) {
    this.events.subscribe('Notifications', () => {
      this.ngZone.run(() => {
      	this.looding = false
        this.Notifications = this.notificationsProvider.NotificationsRead
        this.allUsers = this.notificationsProvider.buddyUsersRead
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
    this.notificationsProvider.getMyNotificationsRead()
  }


	showNotificationsConfirmation(details){
		if (details.Type == 'Request') {
			this.navCtrl.push(RequestsPage)
		} else if (details.Type == 'Friend') {

		} else {
      
    }
	}




}