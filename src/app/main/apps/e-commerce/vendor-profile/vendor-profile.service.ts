import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpHeaders,HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "../../../../../config";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "X-Api-Key":baseenvironment.xapikey      
});

@Injectable()
export class EcommerceVendorProfileService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  //apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  couponsData: any[];
  vendorData: any[];
  vendorChanged: BehaviorSubject<any>;
  myCouponsChanged: BehaviorSubject<any>;
  merchandiseData: any[];
  merchandiseChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    // this.onProductsChanged = new BehaviorSubject({});
    this.myCouponsChanged = new BehaviorSubject({});
    this.merchandiseChanged = new BehaviorSubject({});
    this.vendorChanged = new BehaviorSubject({});
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
        this.getCoupons(),
        this.getMerchandise(),
        this.getVendors()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get coupons
   *
   * @returns {Promise<any>}
   */
  getCoupons(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(
          baseenvironment.baseUrl +
            "/couponsfilters-vendor?VendorID=" +
            Number(localStorage.getItem("VendorID")),
            {
              headers
            }
           
        )
        .subscribe((response: any) => {
          this.couponsData = response;
          console.log(this.couponsData);
          this.myCouponsChanged.next(this.couponsData);
          resolve(response);
        }, reject);
    });
  }
  /**
   * Get merchandise
   *
   * @returns {Promise<any>}
   */
  getMerchandise(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(
          baseenvironment.baseUrl +
            "merchandisefilters-vendor?VendorID=" +
            Number(localStorage.getItem("VendorID")),
            {
              headers
            }
        )
        .subscribe((response: any) => {
          this.merchandiseData = response;
          this.merchandiseChanged.next(this.merchandiseData);
          resolve(response);
        }, reject);
    });
  }
  getVendors(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "vendors",
        {
          headers
        })
        .subscribe((response: any) => {
          this.vendorData = response;
          this.vendorChanged.next(this.vendorData);
          resolve(response);
        }, reject);
    });
  }
}
