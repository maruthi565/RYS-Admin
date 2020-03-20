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
  "X-Api-Key":"pEnt2cTuXgKa4zf8FNTSapMmNGXuQbo8jJW0EXec"
});

@Injectable()
export class EcommerceUserPostedService implements Resolve<any> {
  products: any[];
  userpostedbikesData: any[];
  onUserPostedBikeChanged: BehaviorSubject<any>;
  onProductsChanged: BehaviorSubject<any>;
  //apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";

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
        // this.getUserPostedBikes()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  getUserPostedBikes(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url,{headers})
        // this._httpClient.get(this.apiUrl + 'rides')
        .subscribe((response: any) => {
          // this.userpostedbikesData = response;
          //this.onUserPostedBikeChanged.next(this.userpostedbikesData);
          // console.log(this.userpostedbikesData);
          resolve(response);
        }, reject);
    });
  }
  getUserPostedMerchandise(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url,{headers})
        // this._httpClient.get(this.apiUrl + 'rides')
        .subscribe((response: any) => {
          // this.userpostedbikesData = response;
          //this.onUserPostedBikeChanged.next(this.userpostedbikesData);
          // console.log(this.userpostedbikesData);
          resolve(response);
        }, reject);
    });
  }
  deleteUserPostedBike(ID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "userpostedbikes/" + ID,{headers})
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
  deleteUserPostedMerchandise(UserPostedMerchandiseID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(
          baseenvironment.baseUrl +
            "userpostedmerchandise/" +
            UserPostedMerchandiseID,{headers}
        )
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
  getBikeBrands(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "bikebrands",{headers})
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "userpostedinfoboxes",{headers})
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
