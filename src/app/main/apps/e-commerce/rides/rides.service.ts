import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpErrorResponse ,HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { MatDialog, MatDialogRef } from "@angular/material";
import { catchError, map } from "rxjs/operators";
import { baseenvironment } from "../../../../../config";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "X-Api-Key":baseenvironment.xapikey
});


@Injectable()
export class RidesService implements Resolve<any> {
  //rides: any[];
  //onProductsChanged: BehaviorSubject<any>;
  ridesData: any[];

  //apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  ridesChanged: BehaviorSubject<any>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, public dialog: MatDialog) {
    // Set the defaults
    // this.onProductsChanged = new BehaviorSubject({});
    this.ridesChanged = new BehaviorSubject({});
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
        this.getrideCities()
        //this.getRides('rides')
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

  getRides(url): Promise<any> {
    return new Promise((resolve, reject) => {
      // this._httpClient.get(this.apiUrl + 'gethomerides?UserID='+localStorage.getItem('AdminUserID'))
      this._httpClient
        .get(baseenvironment.baseUrl + url,
          {
            headers
          })
        .subscribe((response: any) => {
          this.ridesData = response;
          // this.ridesChanged.next(this.ridesData);
          //console.log(this.ridesData);
          resolve(response);
        }, reject);
    });
  }

  deleteRide(rideID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "rides/" + rideID,
        {
          headers
        })
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
  getInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "ridesinfoboxes",
        {
          headers
        })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getrideCities(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "rides-cities",
        {
          headers
        })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
