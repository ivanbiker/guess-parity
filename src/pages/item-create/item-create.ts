import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ViewController } from 'ionic-angular';

import {DEFAULT_PLAYERS_COUNT, LOADING_DELAY} from "../../app/config";

import * as _ from 'lodash';
import { Api } from "../../providers/api";


@Component({
    selector: 'page-item-create',
    templateUrl: 'item-create.html'
})
export class ItemCreatePage {

    isReadyToSave: boolean;

    form: FormGroup;

    playersCount = DEFAULT_PLAYERS_COUNT;

    isLoading = false;

    constructor(
        public navCtrl: NavController,
        public viewCtrl: ViewController,
        public api: Api,
        formBuilder: FormBuilder,
    ) {
        this.form = formBuilder.group({
            playersCount: [{value: '', disabled: false}],
        });

        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    done() {
        this.isLoading = true;
        this.form.get('playersCount').disable();

        _.delay(() => {
            this.api.post('backend/startGame', {playersCount: this.playersCount}).subscribe(res => {
                this.isLoading = false;
                this.form.get('playersCount').enable();

                if (!this.form.valid) { return; }
                this.viewCtrl.dismiss(res.gameId);
            });
        }, LOADING_DELAY);
    }
}
