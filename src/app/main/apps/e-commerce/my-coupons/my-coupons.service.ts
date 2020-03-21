import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
  ActivatedRoute
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "../../../../../config";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "X-Api-Key":baseenvironment.xapikey
});
@Injectable()
export class MyCouponsService implements Resolve<any> {
  couponsData: any[];
  products: any[];
  VendorID: number;

  onProductsChanged: BehaviorSubject<any>;
  myCouponsChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private route: ActivatedRoute) {
    // Set the defaults
    this.myCouponsChanged = new BehaviorSubject({});
    // this.route.params.subscribe(params => {
    //     this.VendorID = params['id'];
    //     console.log(this.VendorID);

    // });
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
      Promise.all([this.getCouponsByVendorID(), this.getVendors()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getCouponsByVendorID(): Promise<any> {
    let id = JSON.parse(localStorage.getItem("VendorID"));
    //console.log("service" ,this.VendorID);
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "/couponsfilters-vendor?VendorID=" + id,
        {
          headers
        })
        .subscribe((response: any) => {
          this.couponsData = response;
          this.myCouponsChanged.next(this.couponsData);
          resolve(response);
        }, reject);
    });
  }
  deleteCoupons(CouponID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "coupons/" + CouponID,
        {
          headers
        })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getVendors(): Promise<any> {
    //let id = JSON.parse(localStorage.getItem('VendorID'));
    //console.log("service" ,this.VendorID);
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "/vendors",
        {
          headers
        })
        .subscribe((response: any) => {
          //this.couponsData = response;
          // this.myCouponsChanged.next(this.couponsData);
          resolve(response);
        }, reject);
    });
  }
  onOffCoupon(datas, couponID): Promise<any> {
    console.log(datas);
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "coupons/" + couponID,
          JSON.stringify(datas),
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
