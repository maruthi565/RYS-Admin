import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "../../../../../config";

@Injectable()
export class EcommerceAfterMarketService implements Resolve<any> {
  products: any[];
  vendorData: any[];
  vendorChanged: BehaviorSubject<any>;

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
      Promise.all([]).then(() => {
        resolve();
      }, reject);
    });
  }

  getVendorInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "aftermarketvendorinfoboxes")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getCouponsInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "aftermarketcouponsinfoboxes")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getMerchandiseInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "aftermarketmerchandiseinfoboxes")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getPaymentInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "aftermarketpaymentinfoboxes")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getVendors(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getVendorsList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "vendors")
        .subscribe((response: any) => {
          this.vendorData = response;
          this.vendorChanged.next(this.vendorData);
          resolve(response);
        }, reject);
    });
  }
  getCouponsList(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getMerchandiseList(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getPayments(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "vendorpayments")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  deleteVendor(vendorID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "vendors/" + vendorID)
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
}
