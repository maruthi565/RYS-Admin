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
export class EditRideService implements Resolve<any> {
  //products: any[];
  //onProductsChanged: BehaviorSubject<any>;
  onEditRideChanged: BehaviorSubject<any>;
  bikeBrandModels: any[];

  countriesModels: any[];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onEditRideChanged = new BehaviorSubject({});
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
        this.getBrands()
        //this.getCountries()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get brands
   *
   * @returns {Promise<any>}
   */

  getBrands(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "bikebrandmodels",
        {
          headers
        })
        .subscribe((response: any) => {
          this.bikeBrandModels = response;
          this.onEditRideChanged.next(this.bikeBrandModels);
          //console.log(this.bikeBrandModels);
          resolve(response);
        }, reject);
    });
  }

  /**
   * Get countries
   *
   * @returns {Promise<any>}
   */

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
          console.log(this.countriesModels);
          resolve(response);
        }, reject);
    });
  }

  /**
   * Create Ride
   *
   * @param editride
   * @returns {Promise<any>}
   */
  editRide(ride): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "rides/" + ride.RideID,
          JSON.stringify(ride),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
}
