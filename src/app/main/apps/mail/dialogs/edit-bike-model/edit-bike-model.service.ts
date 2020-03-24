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
export class EcommerceEditBikeModelService implements Resolve<any> {
  bikeBrands: any[];
  onBikeBrandChanged: BehaviorSubject<any>;
  // apiUrl = 'https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/';

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onBikeBrandChanged = new BehaviorSubject({});
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
        // this.getBikeBrands()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   *  @param bikemodel
   * @returns {Promise<any>}
   */

  getBikeBrands(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "bikebrands",
        {
          headers
        })
        .subscribe((response: any) => {
          // this.bikeBrands = response;
          //this.onBikeBrandChanged.next(this.bikeBrands);
          //console.log(this.bikeBrands);
          resolve(response);
        }, reject);
    });
  }
  editBikeModel(bikemodel): Promise<any> {
    //let data
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "bikemodels/" + bikemodel.BikeModelID,
          JSON.stringify(bikemodel),
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
