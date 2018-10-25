import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, LoadingController, Platform, ActionSheetController } from 'ionic-angular';


import { PhotoViewer } from '@ionic-native/photo-viewer';
import { CallNumber } from '@ionic-native/call-number';

import { Camera } from '@ionic-native/camera';

import { SuperTabsController } from 'ionic2-super-tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { BlockProvider } from '../../providers/block/block';
import { EditprofilePage } from '../editprofile/editprofile';

declare var window: any;


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

	userDetails ={
		Name: '',
    Email: '',
    Phone: '',
    Id: '',
    Status: '',
    proPhoto: '',
    bgPhoto: ''
	}


  details ={
    Name: '',
    Email: '',
    Phone: '',
    Id: '',
    Status: '',
    proPhoto: '',
    about: '',
    bgPhoto: ''
  }


  onlineStatus = 'Online'
  offlineStatus = 'Offline'



  myProfile = false

  captureDataUrl;
  captureDataUrll

  constructor(private superTabsCtrl: SuperTabsController, public ngZone: NgZone, public events: Events, public camera: Camera, private photoViewer: PhotoViewer, private callNumber: CallNumber, public actionSheetCtrl: ActionSheetController, public loadCtrl: LoadingController, private platform: Platform, public blockProvider: BlockProvider, public navCtrl: NavController, public authProvider: AuthProvider, public navParams: NavParams) {
  	this.userDetails = this.navParams.get('userDetails')

    this.events.subscribe('ProfileDetails', () => {
      this.ngZone.run(() => {
        this.details = this.authProvider.ProfileDetails
        if (this.details.Id == this.authProvider.UserUid) {
          this.myProfile = true
        } else {
          this.myProfile = false
        }
      })
    })    
  }





  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })    
  }


  ionViewWillEnter() {
  	this.superTabsCtrl.showToolbar(false)
  }


  ionViewDidLeave(){
    this.events.subscribe('ProfileDetails')
  }




  ionViewDidEnter(){
    this.authProvider.getProfileDetails(this.userDetails)
  }






  bgPic() {
    if (this.details.Id == this.authProvider.UserUid) {
      const actionSheet = this.actionSheetCtrl.create({
        title: this.details.Name,
        buttons: [
          {
            text: 'View Cover',
            icon: 'person',
            role: 'destructive',
            handler: () => {
              this.viewProfilePicture(this.details.bgPhoto, this.details.Name)
            }
          },{
            text: 'Select Cover',
            icon: 'albums',
            handler: () => {
              this.selectCover()
            }
          },{
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              this.showToast('Cancel')
            }
          }
        ]
      })
      actionSheet.present() 
    } else {
      this.viewProfilePicture(this.details.bgPhoto, this.details.Name)
    }
  }



  proPic(){
    if (this.details.Id == this.authProvider.UserUid) {
      const actionSheet = this.actionSheetCtrl.create({
        title: this.details.Name,
        buttons: [
          {
            text: 'View Profile Picture',
            icon: 'person',
            role: 'destructive',
            handler: () => {
              this.viewProfilePicture(this.details.proPhoto, this.details.Name)
            }
          },{
            text: 'Select Profile Picture',
            icon: 'albums',
            handler: () => {
              this.selectProfilePicture()
            }
          },{
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              this.showToast('Cancel')
            }
          }
        ]
      })
      actionSheet.present() 
    } else {
      this.viewProfilePicture(this.details.proPhoto, this.details.Name)
    }
  }



  viewProfilePicture(photo, name){
    var options = {
        share: true, // default is false
        closeButton: true, // default is true
        copyToReference: false // default is false
    }
    this.photoViewer.show(photo, name, options);    
  }



  selectProfilePicture() {
    let load = this.loadCtrl.create({
      content: 'Uploading Picture ...'
    })

    const cameraOptions = {
      quality : 50,
      sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.PNG,
      destinationType: this.camera.DestinationType.DATA_URL
    }

    this.camera.getPicture(cameraOptions).then((ImageData) => {
      this.captureDataUrl = 'data:image/jpeg;base64,' + ImageData
      load.present()
      this.authProvider.uploadProfilePhoto(this.captureDataUrl).then(() => {
        this.details.proPhoto = this.captureDataUrl
        load.dismiss()
        this.showToast('Profile Picture has been updated')
      }).catch((err) => {
        load.dismiss()
        this.showToast(err)
      })
    }, (err) => {
      var error = JSON.stringify(err)
      this.showToast(error)
    })
  }



  selectCover() {
    let load = this.loadCtrl.create({
      content: 'Uploading Cover ...'
    })

    const cameraOptions = {
      quality : 50,
      sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.PNG,
      destinationType: this.camera.DestinationType.DATA_URL
    }

    this.camera.getPicture(cameraOptions).then((ImageData) => {
      this.captureDataUrll = 'data:image/jpeg;base64,' + ImageData
      load.present()
      this.authProvider.uploadCover(this.captureDataUrll).then(() => {
        this.details.bgPhoto = this.captureDataUrll
        load.dismiss()
        this.showToast('Cover has been updated')
      }).catch((err) => {
        load.dismiss()
        this.showToast(err)
      })
    }, (err) => {
      var error = JSON.stringify(err)
      this.showToast(error)
    })


  }






  editProfile() {
    this.navCtrl.push(EditprofilePage, {
      userDetails : this.details
    })
  }




  callPhoneNumber(Phone) {
    this.callNumber.callNumber(Phone, true)
      .then(res => this.showToast('Launched dialer! ' + res))
      .catch(err => this.showToast('Error launching dialer ' + err))
  }












  createGroup() {

  }




  block() {
    let load = this.loadCtrl.create({
      content: 'Blocking ' + this.details.Name + ' ...'
    })

    load.present()
    this.blockProvider.blockUser(this.details).then(() => {
        load.dismiss()
        this.navCtrl.pop()
        this.showToast(this.details.Name + ' has been blocked')
    }).catch((err) => {
      this.showToast(err)
      load.dismiss()
    })
  }




}