import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "../../../../../config";

const headers = new HttpHeaders({
  // "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json"
  // cors: "true",
  // Authorization:
  //   "key=AAAAF6GP9HY:APA91bEhAfF11EB0i9O2Y-2h0zsNGWI5WbL8icxvdgLdi5j1GNDvxAqmfr72NPM0MFbCN3Qu16jfonykboy0X7pw-3GQUIvd6GEQixFTtLik5Hm3pfKWQRil5VbyKxhU5GZiB64oHGDu"
});
@Injectable()
export class EcommerceSendMessageService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  //apiUrl = "https://fcm.googleapis.com/fcm/send/";

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onProductsChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Add Message
   * @param message
   * @returns {Promise<any>}
   */
  createMessage(message): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(
          baseenvironment.baseUrl + "sendnotification-users",
          JSON.stringify(message),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
