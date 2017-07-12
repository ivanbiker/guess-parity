import { Injectable } from '@angular/core';
import { ToastController } from "ionic-angular";

@Injectable()
export class Toast {
    private config = {
        duration: 1500,
        position: 'bottom',
        dismissOnPageChange: true,
    };

    constructor(private controller: ToastController) {}

    show(message: string) {
        this.controller
            .create({message, ...this.config})
            .present()
        ;
    }
}

