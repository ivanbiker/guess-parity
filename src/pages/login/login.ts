import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SignupPage } from "../signup/signup";
import { ILoginInfo, User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
import { LOADING_DELAY } from "../../app/config";

import * as _ from 'lodash';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    accountInfo: ILoginInfo = {
        email: '',
        password: ''
    };

    isLoading = false;

    private errors: {string: string};

    errorMessage: string;

    constructor(
        public navCtrl: NavController,
        public user: User,
        public translateService: TranslateService
    ) {

        this.translateService.get([
            'auth/invalid-email',
            'auth/wrong-password',
            'auth/user-not-found',
            'UNKNOWN_ERROR',
        ])
            .subscribe(errors => this.errors = errors)
        ;
    }

    doLogin() {
        this.isLoading = true;
        this.errorMessage = null;

        _.delay(() => (
            this.user.login(this.accountInfo)
                .catch((e: any) => {
                    this.errorMessage = this.errors[e.message] || this.errors[e.code] || this.errors['UNKNOWN_ERROR'];
                })
                .then(() => this.isLoading = false)
        ), LOADING_DELAY);
    }

    gotoSignUp() {
        this.navCtrl.push(SignupPage);
    }
}
