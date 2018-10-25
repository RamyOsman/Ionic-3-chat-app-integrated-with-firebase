import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';






import { NotificationReadPage } from '../notification-read/notification-read';
import { NotificationUnreadPage } from '../notification-unread/notification-unread';


@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {


	tab1Root = NotificationUnreadPage
	tab2Root = NotificationReadPage

  constructor(public navCtrl: NavController) {
  
  }
















}