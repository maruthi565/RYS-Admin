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
  "Content-Type": "application/json",
  "X-Api-Key":baseenvironment.xapikey
});

@Injectable()
export class SOSActivityService implements Resolve<any> {
  soshomeactivityData: any[];
  sosrideactivityData: any[];
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
        //this.getHomeSOSActivity(),
        //this.getRideSOSActivity()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  getHomeSOSActivity(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url,
          {
            headers
          })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getRideSOSActivity(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url,
          {
            headers
          })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getBikeBrands(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "bikebrands",
        {
          headers
        })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "sosinfoboxes",
        {
          headers
        })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
