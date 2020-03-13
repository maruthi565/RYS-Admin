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
export class EcommerceAddAdminUserMerchandiseService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  // apiUrl = 'https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/';

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
        // this.getProducts()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   * @param userpostedbike
   * @returns {Promise<any>}
   */

  adduserPostedMerchandise(userPostedMerchandise): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(
          baseenvironment.baseUrl + "userpostedmerchandise",
          JSON.stringify(userPostedMerchandise)
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getCountries(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "countries")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
