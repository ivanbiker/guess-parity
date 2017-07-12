import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase';

export interface ILoginInfo {
    email: string,
    password: string,
}

export interface ISignUpInfo extends ILoginInfo {
    username: string,
}

@Injectable()
export class User {
    private user: firebase.User;
    private stateListener: (value: firebase.User) => void;

    constructor(private ngFireAuth: AngularFireAuth) {}

    subscribe(fn: (value: firebase.User) => void) {
        this.stateListener = user => {
            this.user = user;
            fn(user);
        };

        this.ngFireAuth.authState.subscribe(this.stateListener);
    }

    login(accountInfo: ILoginInfo) {
        return this.ngFireAuth.auth.signInWithEmailAndPassword(accountInfo.email, accountInfo.password);
    }

    logout() {
        return this.ngFireAuth.auth.signOut();
    }

    signup(accountInfo: ISignUpInfo) {
        return this.ngFireAuth.auth.createUserWithEmailAndPassword(accountInfo.email, accountInfo.password);
    }

    triggerOnAuthStateChanged(user: firebase.User) {
        this.stateListener(user);
    }

    getToken() {
        return this.user.getIdToken();
    }

    getId() {
        return this.user.uid;
    }

    getDisplayName() {
        return this.user.displayName;
    }
}
