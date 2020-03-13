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
  "Content-Type": "application/json"
});
@Injectable()
export class EcommerceBikeUserPostedService implements Resolve<any> {
  userpostedBikeData: any[];
  onProductsChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";

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
      Promise.all([
        //this.getProducts()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   *
   * @returns {Promise<any>}
   */
  // getProducts(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //         this._httpClient.get('api/e-commerce-products')
  //             .subscribe((response: any) => {
  //                 this.products = response;
  //                 this.onProductsChanged.next(this.products);
  //                 resolve(response);
  //             }, reject);
  //     });
  // }
  getUserPostedBikes(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url)
        // this._httpClient.get(this.apiUrl + 'rides')
        .subscribe((response: any) => {
          this.userpostedBikeData = response;
          //this.onUserPostedBikeChanged.next(this.userpostedbikesData);
          //console.log(this.soshomeactivityData);
          resolve(response);
        }, reject);
    });
  }
  AcceptUserBike(data, bikeJson): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "userpostedbikes/" + data.ID,
          JSON.stringify(bikeJson),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  RejectUserBike(data, bikerejectJson): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "userpostedbikes/" + data.ID,
          JSON.stringify(bikerejectJson),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  AcceptUserMerchandise(data, merchandiseJson): Promise<any> {
    //let data
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl +
            "userpostedmerchandise/" +
            data.UserPostedMerchandiseID,
          JSON.stringify(merchandiseJson),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  RejectUserMerchandise(data, merchandiserejectJson): Promise<any> {
    //let data
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl +
            "userpostedmerchandise/" +
            data.UserPostedMerchandiseID,
          JSON.stringify(merchandiserejectJson),
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
