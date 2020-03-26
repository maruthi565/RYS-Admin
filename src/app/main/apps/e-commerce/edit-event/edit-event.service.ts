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
  "Content-Type": "Application/json",
  "X-Api-Key":baseenvironment.xapikey
});

@Injectable()
export class EcommerceEditEventService implements Resolve<any> {
  onEditEventChanged: BehaviorSubject<any>;
  bikeBrandModels: any[];
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onEditEventChanged = new BehaviorSubject({});
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
      Promise.all([this.getBrands()]).then(() => {
        resolve();
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
          //console.log(this.countriesModels);
          resolve(response);
        }, reject);
    });
  }
  getBrands(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "bikebrandmodels",
        {
          headers
        })
        .subscribe((response: any) => {
          this.bikeBrandModels = response;
          this.onEditEventChanged.next(this.bikeBrandModels);
          //console.log(this.bikeBrandModels);
          resolve(response);
        }, reject);
    });
  }
  /**
   * Create Ride
   *
   * @param editevent
   * @returns {Promise<any>}
   */
  editEvent(event): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "events/" + event.EventID,
          JSON.stringify(event),
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
