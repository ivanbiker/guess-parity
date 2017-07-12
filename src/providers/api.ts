import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { User } from "./user";
import { Toast } from "./toast";

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
    url: string = 'https://us-central1-guess-parity-backend.cloudfunctions.net';

    constructor(public http: Http, public user: User, public toast: Toast) {
    }

    get(endpoint: string, params?: any, customOptions?: RequestOptionsArgs) {
        return Observable.create(observer => {
            this.getOptions(customOptions).subscribe(options => {
                if (!options) {
                    options = new RequestOptions();
                }

                // Support easy query params for GET requests
                if (params) {
                    let p = new URLSearchParams();
                    for (let k in params) {
                        p.set(k, params[k]);
                    }
                    // Set the search field if we have params and don't already have
                    // a search field set in options.
                    options.search = !options.search && p || options.search;
                }

                this.http.get(this.url + '/' + endpoint, options).subscribe(res => {
                    const jsonRes = res.json();

                    if (jsonRes.code === 'success') {
                        observer.next(jsonRes);
                    } else if (jsonRes.code === 'error') {
                        this.toast.show(jsonRes.message);
                    }

                    observer.complete();
                });
            });
        });
    }

    post(endpoint: string, body: any, customOptions?: RequestOptionsArgs) {
        return Observable.create(observer => {
            this.getOptions(customOptions).subscribe(options => {
                this.http.post(this.url + '/' + endpoint, body, options).subscribe(res => {
                    const jsonRes = res.json();

                    if (jsonRes.code === 'success') {
                        observer.next(jsonRes);
                    } else if (jsonRes.code === 'error') {
                        this.toast.show(jsonRes.message);
                    }

                    observer.complete();
                });
            });
        });
    }
    
    private getOptions(customOptions: RequestOptionsArgs) {
        return Observable.create(observer => {
            this.user.getToken().then(token => {
                const options = new RequestOptions(customOptions);

                options.headers = new Headers();
                options.headers.append('Authorization', `Bearer ${token}`);

                observer.next(options);
                observer.complete();
            });
        });
    }
}
