import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { LOADING_DELAY } from "../../app/config";
import * as firebase from 'firebase';
import { Api } from "../../providers/api";
import { User } from "../../providers/user";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'page-item-detail',
    templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
    EVEN = 'even';
    ODD = 'odd';

    isJoiningGame = false;
    isMakingMove = false;

    gameId: string;

    game: any = null;

    showJoinButton = true;

    users: any[];

    gameIsOn: boolean = false;

    parity: string;

    unknownNumber: string;

    userId: string;

    messages: any;
    errorMessage: string;

    constructor(
        public navCtrl: NavController,
        navParams: NavParams,
        public api: Api,
        public user: User,
        public translateService: TranslateService
    ) {
        this.gameId = navParams.get('gameId');
        this.userId = this.user.getId();

        this.translateService.get([
            'PICK_PARITY_ERROR',
            'WRONG_UNKNOWN_NUMBER_ERROR',
            'YOU_WIN',
            'YOU_LOSE',
        ])
            .subscribe(errors => this.messages = errors)
        ;
    }

    ionViewDidLoad() {
        _.delay(() => {
            firebase.database().ref(`games/${this.gameId}`).on('value', snapshot => {
                this.game = snapshot.val();

                if (!this.game) {
                    return;
                }

                this.parity = '';
                this.unknownNumber = '';
                this.gameIsOn = this.game.playersJoined === this.game.playersCount;
                this.showJoinButton = !this.gameIsOn && !(this.userId in this.game.users);
                this.users = [];
                this.isMakingMove = false;

                for (const uid in this.game.users) {
                    if (this.game.users.hasOwnProperty(uid)) {
                        this.users.push({
                            ...this.game.users[uid],
                            id: uid,
                            moves: _.toPairs(this.game.users[uid].moves).map(([index, value]) => {
                                switch (value) {
                                    case -1:
                                        return {
                                            iconName: 'square-outline',
                                            iconColor: 'primary',
                                        };

                                    case -2:
                                        return {
                                            iconName: 'square-outline',
                                            iconColor: 'dark',
                                        };

                                    case -3:
                                        return {
                                            iconName: 'square',
                                            iconColor: 'dark',
                                        };

                                    case 0:
                                        return {
                                            iconName: 'square',
                                            iconColor: 'danger',
                                        };

                                    case 1:
                                        return {
                                            iconName: 'square',
                                            iconColor: 'primary',
                                        };
                                }
                            })
                        });
                    }
                }
            });
        }, LOADING_DELAY);
    }

    joinGame() {
        this.isJoiningGame = true;

        _.delay(() => {
            this.api.post('backend/joinGame', {gameId: this.gameId}).subscribe(res => {
                this.isJoiningGame = false;
            });
        }, LOADING_DELAY);
    }

    makeMove() {
        this.isMakingMove = true;
        this.errorMessage = null;

        _.delay(() => {
            if (
                this.game.turnsCount !== 0 && (
                    this.parity !== this.EVEN &&
                    this.parity !== this.ODD
                )
            ) {
                this.errorMessage = this.messages.PICK_PARITY_ERROR;
                this.isMakingMove = false;
                return;
            }

            if (!/^\d+$/.test(this.unknownNumber)) {
                this.errorMessage = this.messages.WRONG_UNKNOWN_NUMBER_ERROR;
                this.isMakingMove = false;
                return;
            }

            const req = {
                gameId: this.gameId,
                unknownNumber: parseInt(this.unknownNumber, 10),
                parity: this.parity === 'even' ? 0 : 1,
            };

            this.api.post('backend/makeMove', req).subscribe(res => {});
        }, LOADING_DELAY);
    }

}
