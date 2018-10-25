import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform } from 'ionic-angular';



import { RequestProvider } from '../../providers/request/request';

declare var window: any;

import { SuperTabsController } from 'ionic2-super-tabs';

@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {

	sentRequests = []
	receivedRequests = []

  looding = true

  constructor(private superTabsCtrl: SuperTabsController, public navCtrl: NavController, public loadCtrl: LoadingController, private platform: Platform, public requestProvider: RequestProvider, public alertCtrl: AlertController) {
  }



  ionViewWillEnter() {
    this.superTabsCtrl.showToolbar(false)
  	this.requestProvider.getReceivedRequests().then((res: any) => {
      this.looding = false
  		this.receivedRequests = res
  	})

  	this.requestProvider.getSentRequests().then((res: any) => {
      this.looding = false
  		this.sentRequests = res
  	})
  }


  showToast(message){
        this.platform.ready().then(() => {
            window.plugins.toast.show(message, "short", 'bottom');
        })    
  }



  showSentRequestsConfirmation(userDetails){
    const confirm = this.alertCtrl.create({
      title: 'Request',
      message: 'You have been sent a request to ' + userDetails.Name,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.showToast('Cancel')
          }
        },
        {
          text: 'Delete Request',
          handler: () => {
            this.deleteSentRequest(userDetails)
          }
        },
        {
          text: 'Block ' + userDetails.Name,
          handler: () => {
            this.blockSentRequest(userDetails)
          }
        }
      ]
    });
    confirm.present();
  }







  showReceivedRequestsConfirmation(userDetails){
    const confirm = this.alertCtrl.create({
      title: 'Request',
      message: 'Request from ' + userDetails.Name,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.showToast('Cancel')
          }
        },
        {  
          text: 'Delete Request',
          handler: () => {
            this.deleteReceivedRequest(userDetails)
          }
        },
        {
          text: 'Block ' + userDetails.Name ,
          handler: () => {
            this.blockReceivedRequest(userDetails)
          }
        },
        {
          text: 'Accept Request',
          handler: () => {
            this.acceptRequest(userDetails)
          }
        }
      ]
    });
    confirm.present();    
  }









  deleteSentRequest(userDetails) {


    let load = this.loadCtrl.create({
      content: 'Deleting Request'
    })

    load.present()
    this.requestProvider.deleteSentRequest(userDetails).then(() => {
      if (this.sentRequests.length > 1) {
        this.requestProvider.getSentRequests().then((res: any) => {
          this.sentRequests = res
          load.dismiss()
          this.showToast('Request to ' + userDetails.Name + ' has been deleted')
        }).catch((err) => {
          load.dismiss()
          this.showToast(err)
        })
      } else {
        this.sentRequests = []
        load.dismiss()

        if (this.receivedRequests.length < 1) {
          this.navCtrl.pop()
        }
        this.showToast('Request to ' + userDetails.Name + ' has been deleted')
      }

    }).catch((err) => {
      load.dismiss()
      this.showToast(err)
    })  


  }


  

  deleteReceivedRequest(userDetails) {
    let load = this.loadCtrl.create({
      content: 'Deleting Request'
    })

    load.present()

    this.requestProvider.deleteReceivedRequest(userDetails).then(() => {
      if (this.sentRequests.length > 1) {
        this.requestProvider.getReceivedRequests().then((res: any) => {
          this.receivedRequests = res
          load.dismiss()
          this.showToast('Request from ' + userDetails.Name + ' has been deleted')
        }).catch((err) => {
          load.dismiss()
          this.showToast(err)
        })
      } else {
        this.receivedRequests = []

        if (this.sentRequests.length < 1) {
          this.navCtrl.pop()
        }
        load.dismiss()
        this.showToast('Request from ' + userDetails.Name + ' has been deleted')
      }

    }).catch((err) => {
      load.dismiss()
      this.showToast(err)
    })  

  }





  acceptRequest(userDetails){
    let load = this.loadCtrl.create({
      content: 'Accepting Request'
    })

    load.present()

    this.requestProvider.acceptRquest(userDetails).then(() => {
      if (this.sentRequests.length > 1) {
        this.requestProvider.getReceivedRequests().then((res: any) => {
          this.receivedRequests = res
          load.dismiss()
          this.showToast('You and ' + userDetails.Name + " become friends")
        }).catch((err) => {
          load.dismiss()
          this.showToast(err)
        })
      } else {
        this.receivedRequests = []

        if (this.sentRequests.length < 1) {
          this.navCtrl.pop()
        }

        load.dismiss()
        this.showToast('You and ' + userDetails.Name + " become friends")
      }

    }).catch((err) => {
      load.dismiss()
      this.showToast(err)
    })  

  }






  blockReceivedRequest(userDetails) {
    let load = this.loadCtrl.create({
      content: 'Blocking ' + userDetails.Name + ' .....'
    })
    load.present()
    this.requestProvider.blockReceivedRequest(userDetails).then(() => {
      if (this.sentRequests.length > 1) {
        this.requestProvider.getReceivedRequests().then((res: any) => {
          this.receivedRequests = res
          load.dismiss()
          this.showToast(userDetails.Name + ' has been blocked')
        }).catch((err) => {
          load.dismiss()
          this.showToast(err)
        })
      } else {
        this.receivedRequests = []

        if (this.sentRequests.length < 1) {
          this.navCtrl.pop()
        }
        load.dismiss()
        this.showToast(userDetails.Name + ' has been blocked')
      }
    }).catch((err) => {
      load.dismiss()
      this.showToast(err)
    })
  }




  blockSentRequest(userDetails) {
    let load = this.loadCtrl.create({
      content: 'Blocking ' + userDetails.Name + ' .....'
    })

    load.present()
    this.requestProvider.blockSentRequest(userDetails).then(() => {
      if (this.sentRequests.length > 1) {
        this.requestProvider.getSentRequests().then((res: any) => {
          this.sentRequests = res
          load.dismiss()
          this.showToast(userDetails.Name + ' has been blocked')
        }).catch((err) => {
          load.dismiss()
          this.showToast(err)
        })
      } else {
        this.sentRequests = []
        load.dismiss()

        if (this.receivedRequests.length < 1) {
          this.navCtrl.pop()
        }
          this.showToast(userDetails.Name + ' has been blocked')
      }

    }).catch((err) => {
      load.dismiss()
      this.showToast(err)
    })        
  }












}