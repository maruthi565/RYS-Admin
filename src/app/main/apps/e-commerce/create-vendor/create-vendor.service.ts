import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";
import { baseenvironment } from "../../../../../config";

const headers = new HttpHeaders({
  "Content-Type": "Application/json",
  "X-Api-Key":baseenvironment.xapikey
  });

@Injectable()
export class EcommerceCreateVendorService implements Resolve<any> {
  products: any[];
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
        // this.getProducts()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   * @param vendor
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
  addVendor(vendor): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(baseenvironment.baseUrl + "vendors", JSON.stringify(vendor),
        {
          headers
        })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getCountries(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "countries",
        {
          headers
        })
        .subscribe((response: any) => {
          //this.countriesModels = response;
          //this.onCreateRideChanged.next(this.countriesModels);
          //console.log(this.countriesModels);
          resolve(response);
        }, reject);
    });
  }
}
