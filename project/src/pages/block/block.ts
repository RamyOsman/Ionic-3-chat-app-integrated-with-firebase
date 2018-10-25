import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform } from 'ionic-angular';

import { BlockProvider } from '../../providers/block/block';

declare var window: any;

import { SuperTabsController } from 'ionic2-super-tabs';

@Component({
  selector: 'page-block',
  templateUrl: 'block.html',
})
export class BlockPage {


	blockList = []

looding = true

  constructor(private superTabsCtrl: SuperTabsController, public navCtrl: NavController, public loadCtrl: LoadingController, private platform: Platform, public alertCtrl: AlertController, public blockProvider: BlockProvider) {
  }



  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })    
  }


  ionViewWillEnter() {
    this.superTabsCtrl.showToolbar(false)
  	this.blockProvider.getBlockList().then((res: any) => {
      this.looding = false
  		this.blockList = res
  	}).catch((err) => {
  		console.log(err)
  	})
  }






  showBlockConfirmation(userDetails){
    const confirm = this.alertCtrl.create({
      title: userDetails.Name,
      message: 'Unblock ' + userDetails.Name + ' for chatting together again.',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'half-alert-button',
          handler: () => {
            this.showToast('Cancel')
          }
        },
        {
          text: 'Unblock',
          cssClass: 'half-alert-button',
          handler: () => {
            this.unBlock(userDetails)
          }
        }
      ]
    });
    confirm.present();
  }




  unBlock(userDetails) {
  	let load = this.loadCtrl.create({
  		content: 'Unblocking ' + userDetails.Name + ' ...'
  	})

  	load.present()
  	this.blockProvider.unBlock(userDetails).then(() => {
  		if (this.blockList.length > 1) {
  			this.blockProvider.getBlockList().then((res: any) => {
  				this.blockList = res
  			}).then(() => {
  				load.dismiss()
  				this.showToast(userDetails.Name + ' has been unblocked')
  			}).catch((err) => {
  				load.dismiss()
  				this.showToast(err)
  			})
  		} else {
  			load.dismiss()
  			this.navCtrl.pop()
  			this.showToast(userDetails.Name + ' has been unblocked')
  		}
  	}).catch((err) => {
  		load.dismiss()
  		this.showToast(err)
  	})  	
  }











}