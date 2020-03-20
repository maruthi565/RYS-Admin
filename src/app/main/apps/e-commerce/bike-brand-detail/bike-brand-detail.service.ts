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
export class EcommercegetBikeModelsService implements Resolve<any> {
  getbikeModelsData: any[];
  onbikeModelsChanged: BehaviorSubject<any>;
  // apiUrl = 'https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/';

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onbikeModelsChanged = new BehaviorSubject({});
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
      Promise.all([this.getBikeModels()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   *
   * @returns {Promise<any>}
   */

  getBikeModels(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "bikebrandmodels",{headers})
        .subscribe((response: any) => {
          this.getbikeModelsData = response;
          this.onbikeModelsChanged.next(this.getbikeModelsData);
          resolve(response);
        }, reject);
    });
  }
  deleteBikeModels(BikeModelID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "bikemodels/" + BikeModelID,{headers})
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
  getInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "bikesimagesinfoboxes",{headers})
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
