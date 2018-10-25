import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



import { AuthProvider } from '../../providers/auth/auth';
import { FriendsPage } from '../friends/friends';
import { BlockPage } from '../block/block';
import { RequestsPage } from '../requests/requests';
import { ProfilePage } from '../profile/profile';

import { LoginPage } from '../login/login';
import { SuperTabsController } from 'ionic2-super-tabs';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {


  userDetails = {
    Name: '',
    Email: '',
    Phone: '',
    Id: '',
    Status: '',
    proPhoto: '',
    bgPhoto: ''
  }

  constructor(private superTabsCtrl: SuperTabsController, public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider) {
  }




  ionViewWillEnter() {
    this.superTabsCtrl.showToolbar(true)
    this.authProvider.getUserDetails().then((res: any) => {
      this.userDetails.Name = res.Name
      this.userDetails.proPhoto = res.Photo
      this.userDetails.Phone = res.Phone
      this.userDetails.Status = res.Status
      this.userDetails.Id = res.Id
      this.userDetails.bgPhoto = res.bgPhoto
      this.userDetails.Email = res.Email
    }).catch((err) => {
      console.log(err)
    })
  }







  openProfilePage() {
    this.navCtrl.push(ProfilePage, {
      userDetails: this.userDetails
    })
  }





  openFriendsPage() {
    this.navCtrl.push(FriendsPage)
  }

  openRequestsPage() {
    this.navCtrl.push(RequestsPage)
  }

  openBlockPage() {
    this.navCtrl.push(BlockPage)
  }



  logOut() {
    this.authProvider.offlineStatuss().then(() => {
      this.authProvider.logOut().then(() => {
        this.navCtrl.parent.parent.setRoot(LoginPage)
        window.localStorage.clear()
      }).catch((err) => {
        console.log(err)
      })      
    }).catch((err) => {
      console.log(err)
    })
  }









}
