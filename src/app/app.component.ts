import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoadingPage } from "../pages/loading/loading";
import { MainPage } from "../pages/pages";
import { ListMasterPage } from '../pages/list-master/list-master';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';

import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { LOADING_DELAY } from "./config";
import { User } from "../providers/user";

@Component({
    template: `<ion-menu [content]="content">
        <ion-header>
            <ion-toolbar>
                <ion-title>Pages</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-list>
                <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
                    {{p.title}}
                </button>
            </ion-list>
        </ion-content>

    </ion-menu>
    <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage = LoadingPage;

    @ViewChild(Nav) nav: Nav;

    pages: any[] = [
        { title: 'Tabs', component: TabsPage },
        { title: 'Login', component: LoginPage },
        { title: 'Signup', component: SignupPage },
        { title: 'Master Detail', component: ListMasterPage },
    ];

    constructor(
        private translate: TranslateService,
        private platform: Platform,
        private config: Config,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private user: User
    ) {
        this.initTranslate();
        _.delay(() => this.initAuth(), LOADING_DELAY);
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    initTranslate() {
        this.translate.setDefaultLang('en');

        if (this.translate.getBrowserLang() !== undefined) {
            this.translate.use(this.translate.getBrowserLang());
        } else {
            this.translate.use('en');
        }

        this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });
    }

    initAuth() {
        this.user.subscribe(user => {
            console.log('USER', user);
            if (user) {
                if (user.displayName) {
                    this.nav.setRoot(MainPage);
                }
            } else {
                this.nav.setRoot(LoginPage);
            }
        });
    }

    openPage(page) {
        this.nav.setRoot(page.component);
    }
}
