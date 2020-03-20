import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material";
import { baseenvironment } from "../../../../../config";
import { basename } from "path";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "X-Api-Key":baseenvironment.xapikey
});

@Injectable()
export class EventsService implements Resolve<any> {
  eventData: any[];
  onEventChanged: BehaviorSubject<any>;
  apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onEventChanged = new BehaviorSubject({});
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
      Promise.all([this.getEvents("eventsfilter")]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   *
   * @returns {Promise<any>}
   */
  // getEvents(): any {
  //     return this._httpClient.get((this.apiUrl) + 'events');
  // }

  createEvent(event): Promise<any> {
    //return this._httpClient.post(this.apiUrl + 'events', event);

    return new Promise((resolve, reject) => {
      this._httpClient
        .post(baseenvironment.baseUrl + "events", JSON.stringify(event),
        {
          headers
        })
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }

  getBikesAndModels(): any {
    return this._httpClient.get(baseenvironment.baseUrl + "bikebrandmodels",
    {
      headers
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
          resolve(response);
        }, reject);
    });
  }
  deleteEvent(EventID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "events/" + EventID,
        {
          headers
        })
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
  getEvents(url): Promise<any> {
    return new Promise((resolve, reject) => {
      // this._httpClient.get(this.apiUrl + 'gethomerides?UserID='+localStorage.getItem('AdminUserID'))
      this._httpClient
        .get(baseenvironment.baseUrl + url,
          {
            headers
          })
        .subscribe((response: any) => {
          this.eventData = response;
          // this.onEventChanged.next(this.eventData);
          //console.log(this.eventData);
          resolve(response);
        }, reject);
    });
  }
  getInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "eventsinfoboxes",
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
}
