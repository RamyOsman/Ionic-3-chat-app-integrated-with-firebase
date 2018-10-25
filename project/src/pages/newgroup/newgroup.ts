import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';

import { GroupProvider } from '../../providers/group/group';
import { SuperTabsController } from 'ionic2-super-tabs';

import { Camera, CameraOptions } from '@ionic-native/camera';
declare var window: any;


@Component({
  selector: 'page-newgroup',
  templateUrl: 'newgroup.html',
})
export class NewgroupPage {




	group = {
		Name : 'Group Name',
		Picture: 'https://firebasestorage.googleapis.com/v0/b/chat-app-f6a12.appspot.com/o/user.png?alt=media&token=79419e48-423a-42c3-92b2-16027651b931'
	}


	captureDataUrl

  constructor(public camera: Camera, private superTabsCtrl: SuperTabsController, public platform: Platform, public loadCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public groupProvider: GroupProvider, public navParams: NavParams) {
  }






  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })  	
  }


  ionViewWillEnter(){
  	this.superTabsCtrl.showToolbar(false)
  }




  editName() {
  	const prompt = this.alertCtrl.create({
  		title: 'Group Name',
  		message: 'Enter a name for this group',
  		inputs: [
  			{
  				name: 'Name',
  				placeholder: 'Group Name'
  			}
  		],
  		buttons : [
  			{
  				text: 'Cancel',
  				cssClass: 'half-alert-button',
  				handler: data => {
  					this.showToast('Cancel')
  				}
  			},
  			{
  				text: 'Save',
  				cssClass: 'half-alert-button',
  				handler: data => {
  					var res = data.Name
  					var result = res.trim()
  					if (result == '') {
  						this.showToast('Enter Group Name')
  					} else {
  						this.group.Name = result
  					}
  				}
  			}
  		]
  	})
  	prompt.present()
  }




  selectPicture() {
  	let load = this.loadCtrl.create({
  		content: 'Uploading group picture ....'
  	})

  	const cameraoptions: CameraOptions = {
  	  quality : 50,
      sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.PNG,
      destinationType: this.camera.DestinationType.DATA_URL
  	}


  	this.camera.getPicture(cameraoptions).then((ImageData) => {
  		this.captureDataUrl = 'data:image/jpeg;base64,' + ImageData
  		load.present()
  		this.groupProvider.uploadGroupPicture(this.captureDataUrl).then(() => {
  			this.group.Picture = this.captureDataUrl
  			load.dismiss()
  		}).catch((err) => {
  			load.dismiss()
  			this.showToast(err)
  		})
  	}, (err) => {
  		var res = JSON.stringify(err)
  		load.dismiss()
  		this.showToast(res)
  	})


  }




  createGroup() {
  	let load = this.loadCtrl.create({
  		content: 'Creating Group ....'
  	})


  	if (this.group.Picture == 'hsttps://firebasestorage.googleapis.com/v0/b/chat-app-f6a12.appspot.com/o/user.png?alt=media&token=79419e48-423a-42c3-92b2-16027651b931') {
  		console.log('Select Group Picture')
  	} else {
  		if (this.group.Name == 'Group Name') {
  			console.log('Enter Group Name')
  		} else {
  			load.present()
  			this.groupProvider.creaeGroup(this.group).then(() => {
  				load.dismiss()
  				console.log('Group has been created')
  				this.navCtrl.pop()
  			}).catch((err) => {
  				load.dismiss()
  				console.log(err)
  			})
  		}
  	}


  }










}