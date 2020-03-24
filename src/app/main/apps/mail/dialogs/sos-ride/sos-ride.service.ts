import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "config";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "X-Api-Key":baseenvironment.xapikey
});


@Injectable()
export class EcommerceSOSRideService implements Resolve<any> {
  // soshomeactivityData: any[];
  // sosrideactivityData:any[];
  rideDetailData: any[];
  onrideChanged: BehaviorSubject<any>;
  onProductsChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onrideChanged = new BehaviorSubject({});
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
        //this.getSOSRideDetails(this.UserID)
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

  getSOSRideDetails(UserID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "sosactivity?UserID=" + UserID,
        {
          headers
        })
        .subscribe((response: any) => {
          this.rideDetailData = response.SOSActivities;
          this.onrideChanged.next(this.rideDetailData);
          // console.log(this.rideDetailData);
          resolve(response);
        }, reject);
    });
  }
}
