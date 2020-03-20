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
export class EcommerceUserProfileService implements Resolve<any> {
  profileData: any[];
  //apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  onProfileChanged: BehaviorSubject<any>;
  UserID: number;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onProfileChanged = new BehaviorSubject({});
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
        // this.getUserBikes(this.UserID),
        //  this.getUserSubscriptionDetails(this.UserID),
        //  this.getUserAds(this.UserID)
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
  // getUserProfiles(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //         this._httpClient.get(this.apiUrl + 'users')
  //             .subscribe((response: any) => {
  //                 this.profileData = response.Users;
  //                 this.onProfileChanged.next(this.profileData);
  //                 resolve(response);
  //             }, reject);
  //     });
  // }
  getUserProfiles(UserID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "users?UserID=" + UserID,{headers})
        .subscribe((response: any) => {
          this.profileData = response.Users;
          this.onProfileChanged.next(this.profileData);
          resolve(response);
        }, reject);
    });
  }
  getUserBikes(UserID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "userpostedbikes?UserID=" + UserID,{headers})
        .subscribe((response: any) => {
          // this.profileData = response.Users;
          // this.onProfileChanged.next(this.profileData);
          //
          resolve(response);
          // console.log(response);
        }, reject);
    });
  }
  getUserSubscriptionDetails(UserID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(
          baseenvironment.baseUrl +
            "subscriptionpurchasedetails?UserID=" +
            UserID,{headers}
        )
        .subscribe((response: any) => {
          // this.profileData = response.Users;
          // this.onProfileChanged.next(this.profileData);
          //
          resolve(response);
          // console.log(response);
        }, reject);
    });
  }
  getUserAds(UserID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "userads?UserID=" + UserID,{headers})
        .subscribe((response: any) => {
          resolve(response);
          // console.log(response);
        }, reject);
    });
  }
  AcceptUserBikeDocument(bikedocumentJson): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl +
            "bikes/" +
            JSON.parse(localStorage.getItem("BikeID")),
          JSON.stringify(bikedocumentJson),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  RejectUserBikeDocument(bikedocumentrejectJson): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl +
            "bikes/" +
            JSON.parse(localStorage.getItem("BikeID")),
          JSON.stringify(bikedocumentrejectJson),
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
