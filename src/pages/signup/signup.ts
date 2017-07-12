import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ISignUpInfo, User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
import { Toast } from "../../providers/toast";

import * as _ from 'lodash';
import { LOADING_DELAY } from "../../app/config";


@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {

    accountInfo: ISignUpInfo = {
        username: '',
        email: '',
        password: '',
    };

    isLoading = false;

    private errors: {string: string};

    errorMessage: string;

    constructor(
        public navCtrl: NavController,
        public user: User,
        public toast: Toast,
        public translateService: TranslateService
    ) {

        this.translateService.get([
            'auth/invalid-email',
            'auth/wrong-password',
            'UNKNOWN_ERROR',
        ])
            .subscribe(errors => this.errors = errors)
        ;
    }

    doSignup() {
        this.isLoading = true;
        this.errorMessage = null;

        _.delay(() => (
            this.user.signup(this.accountInfo)
                .then(user => {
                    user
                        .updateProfile({
                            displayName: this.accountInfo.username,
                            photoUrl: null,
                        })
                        .then(() => this.user.triggerOnAuthStateChanged(user))
                    ;
                })
                .catch((e: any) => {
                    this.isLoading = false;
                    this.errorMessage = this.errors[e.message] || this.errors[e.code] || this.errors['UNKNOWN_ERROR'];
                })
        ), LOADING_DELAY);
    }
}
