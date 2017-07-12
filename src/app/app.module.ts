import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { ItemCreatePage } from '../pages/item-create/item-create';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { ListMasterPage } from '../pages/list-master/list-master';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from "../pages/profile/profile";

import { Api } from '../providers/api';
import { User } from '../providers/user';

import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoadingPage } from "../pages/loading/loading";

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Toast } from "../providers/toast";
import { ErrorComponent } from '../components/error/error';
import { SpinnerComponent } from '../components/spinner/spinner';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const firebaseConfig = {
    apiKey: "AIzaSyAMQMGu-296oj36mGrXNdK5voYJpWHc7qI",
    authDomain: "guess-parity-backend.firebaseapp.com",
    databaseURL: "https://guess-parity-backend.firebaseio.com",
    projectId: "guess-parity-backend",
    storageBucket: "guess-parity-backend.appspot.com",
    messagingSenderId: "505982014429"
};

@NgModule({
    declarations: [
        MyApp,
        ItemCreatePage,
        ItemDetailPage,
        ListMasterPage,
        LoginPage,
        SignupPage,
        TabsPage,
        LoadingPage,
        ProfilePage,
        ErrorComponent,
    SpinnerComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        }),
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ItemCreatePage,
        ItemDetailPage,
        ListMasterPage,
        LoginPage,
        SignupPage,
        TabsPage,
        LoadingPage,
        ProfilePage,
    ],
    providers: [
        Api,
        User,
        Camera,
        GoogleMaps,
        SplashScreen,
        StatusBar,
        Toast,
        // Keep this to enable Ionic's runtime error handling during development
        { provide: ErrorHandler, useClass: IonicErrorHandler },
    ]
})
export class AppModule { }
