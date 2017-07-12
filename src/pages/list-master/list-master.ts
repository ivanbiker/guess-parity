import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { ItemCreatePage } from '../item-create/item-create';
import { ItemDetailPage } from '../item-detail/item-detail';

import * as firebase from 'firebase';
import * as _ from 'lodash';
import { DATE_FORMAT, LOADING_DELAY } from "../../app/config";
import * as moment from 'moment';

@Component({
    selector: 'page-list-master',
    templateUrl: 'list-master.html'
})
export class ListMasterPage {
    currentItems: any[] = [];
    gameIds: any = {};

    isLoading = true;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
        _.delay(() => (
            firebase.database().ref('games').on('value', snapshot => {
                const games = snapshot.val();

                this.isLoading = false;
                this.currentItems = [];
                this.gameIds = {};

                if (games) {
                    for (const gameId in games) {
                        if (games.hasOwnProperty(gameId)) {
                            const game = games[gameId];

                            this.gameIds[gameId] = true;

                            this.currentItems.push({
                                ...game,
                                id: gameId,
                                createdAt: moment.unix(game.createdAt).format(DATE_FORMAT),
                                icon: (
                                    game.playersJoined === game.playersCount
                                        ? 'radio-button-on'
                                        : 'radio-button-off'
                                ),
                                color: (
                                    game.playersJoined === game.playersCount
                                        ? 'primary'
                                        : 'danger'
                                ),
                            });
                        }
                    }

                    this.currentItems.reverse();
                }
            })
        ), LOADING_DELAY);
    }

    addItem() {
        const addModal = this.modalCtrl.create(ItemCreatePage);
        addModal.onDidDismiss(gameId => {
            if (typeof gameId === 'string' && !(gameId in this.gameIds)) {
                this.isLoading = true;
            }
        });
        addModal.present();
    }

    openItem(gameId: string) {
        this.navCtrl.push(ItemDetailPage, {gameId});
    }
}
