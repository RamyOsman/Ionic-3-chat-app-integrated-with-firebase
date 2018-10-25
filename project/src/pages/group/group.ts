import { Component, NgZone } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';


import { SuperTabsController } from 'ionic2-super-tabs';

import { NewgroupPage } from '../newgroup/newgroup';

import { GroupbodyPage } from '../groupbody/groupbody';

import { GroupProvider } from '../../providers/group/group';


@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {

  Groups = []


  User_Uid = this.groupProvider.UserUid

looding = true

  constructor(private superTabsCtrl: SuperTabsController, public ngZone : NgZone, public events: Events, public groupProvider: GroupProvider, public navCtrl: NavController, public navParams: NavParams) {

    this.events.subscribe('Groups', () => {
      this.ngZone.run(() => {
        this.looding = false
        this.Groups = this.groupProvider.Groups
      })
    })    

  }



  ionViewWillEnter(){
  	this.superTabsCtrl.showToolbar(true)
  }


  openNewGroupPage() {
  	this.navCtrl.push(NewgroupPage)
  }







  ionViewDidLeave(){
    this.events.subscribe('Groups')
  }




  ionViewDidEnter(){
    this.groupProvider.getGroups()
  }




  openGroupBody(groupDetails) {
    this.groupProvider.initialize(groupDetails)
    this.navCtrl.push(GroupbodyPage, {
      groupDetails: groupDetails
    })
  }









}