import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "config";

@Injectable()
export class EcommerceReportsSendMessageService implements Resolve<any> {
  reportData: any[];
  onReportsChanged: BehaviorSubject<any>;
  //apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onReportsChanged = new BehaviorSubject({});
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
      Promise.all([
        //this.getReports()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  // /**
  //  * Get products
  //  *
  //  * @returns {Promise<any>}
  //  */
  // getProducts(): Promise<any>
  // {
  //     return new Promise((resolve, reject) => {
  //         this._httpClient.get('api/e-commerce-products')
  //             .subscribe((response: any) => {
  //                 this.products = response;
  //                 this.onProductsChanged.next(this.products);
  //                 resolve(response);
  //             }, reject);
  //     });
  // }
  getUserReportTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "userreporttypes")
        .subscribe((response: any) => {
          // this.reportData = response;
          //this.onReportsChanged.next(this.reports);
          resolve(response);
        }, reject);
    });
  }
  sendMessageUer(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(baseenvironment.baseUrl + "reportmessage", JSON.stringify(user))
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
