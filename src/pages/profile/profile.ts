import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { User } from "../../providers/user";
import { Api } from "../../providers/api";

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {

    displayName: string;

    constructor(public user: User, public api: Api) {
        this.displayName = this.user.getDisplayName();
    }
    
    logout() {
        this.user.logout();
    }

}
