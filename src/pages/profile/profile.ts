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

    constructor(public user: User, public api: Api) {}
    
    logout() {
        this.user.logout();
    }

}
