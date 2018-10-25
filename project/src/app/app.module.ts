import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { DatePicker } from '@ionic-native/date-picker';
import { Camera } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';
import { CallNumber } from '@ionic-native/call-number';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Clipboard } from '@ionic-native/clipboard';


import { SuperTabsModule } from 'ionic2-super-tabs';


import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ChatPage } from '../pages/chat/chat';
import { GroupPage } from '../pages/group/group';
import { SettingsPage } from '../pages/settings/settings';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { UsersPage } from '../pages/users/users';
import { FriendsPage } from '../pages/friends/friends';
import { BlockPage } from '../pages/block/block';
import { RequestsPage } from '../pages/requests/requests';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ChatbodyPage } from '../pages/chatbody/chatbody';
import { ProfilePage } from '../pages/profile/profile';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { NewgroupPage } from '../pages/newgroup/newgroup';
import { GroupmemberPage } from '../pages/groupmember/groupmember';
import { GroupbodyPage } from '../pages/groupbody/groupbody';
import { GroupaddmemberPage } from '../pages/groupaddmember/groupaddmember';
import { NotificationReadPage } from '../pages/notification-read/notification-read';
import { NotificationUnreadPage } from '../pages/notification-unread/notification-unread';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';
import { UsersProvider } from '../providers/users/users';
import { RequestProvider } from '../providers/request/request';
import { BlockProvider } from '../providers/block/block';
import { FriendsProvider } from '../providers/friends/friends';
import { ChatProvider } from '../providers/chat/chat';
import { GroupProvider } from '../providers/group/group';
import { NotificationProvider } from '../providers/notification/notification';


  var config = {
    apiKey: "AIzaSyC1iKEfMnmYnVitFkPz27IuN7AYx5eRxPs",
    authDomain: "chat-app-f6a12.firebaseapp.com",
    databaseURL: "https://chat-app-f6a12.firebaseio.com",
    projectId: "chat-app-f6a12",
    storageBucket: "chat-app-f6a12.appspot.com",
    messagingSenderId: "68509235232"
  }


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    RegisterPage,
    ChatPage,
    GroupPage,
    SettingsPage,
    ResetPasswordPage,
    UsersPage,
    FriendsPage,
    BlockPage,
    RequestsPage,
    NotificationsPage,
    ChatbodyPage,
    ProfilePage,
    EditprofilePage,
    NewgroupPage,
    GroupbodyPage,
    GroupmemberPage,
    GroupaddmemberPage,
    NotificationReadPage,
    NotificationUnreadPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    RegisterPage,
    ChatPage,
    GroupPage,
    SettingsPage,
    ResetPasswordPage,
    UsersPage,
    FriendsPage,
    BlockPage,
    RequestsPage,
    NotificationsPage,
    ChatbodyPage,
    ProfilePage,
    EditprofilePage,
    NewgroupPage,
    GroupbodyPage,
    GroupmemberPage,
    GroupaddmemberPage,
    NotificationReadPage,
    NotificationUnreadPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatePicker,
    Camera,
    AuthProvider,
    Toast,
    UsersProvider,
    RequestProvider,
    BlockProvider,
    FriendsProvider,
    CallNumber,
    PhotoViewer,
    ChatProvider,
    Clipboard,
    GroupProvider,
    NotificationProvider
  ]
})
export class AppModule {}
