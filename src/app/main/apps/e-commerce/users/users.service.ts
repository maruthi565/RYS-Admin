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
export class UsersService implements Resolve<any> {
  usersData: any[];
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  onUsersChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUsersChanged = new BehaviorSubject({});
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
        //  this.getUsers(),
        this.getUsers("usersfilter")
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
  getUsers(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url,{headers})
        .subscribe((response: any) => {
          //this.usersData = response.Users;
          //this.onUsersChanged.next(this.usersData);
          resolve(response);
        }, reject);
    });
  }

  AcceptUser(data, userJson): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "users/" + data.UserID,
          JSON.stringify(userJson),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  RejectUser(data, userrejectJson): Promise<any> {
    console.log(data);
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "users/" + data.UserID,
          JSON.stringify(userrejectJson),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getInfoBoxes(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url,{headers})
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getBikeBrandInfoBoxes(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "usersbybikebrand-count?BrandID=" + url,{headers})
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getUserProfiles(UserID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "users?UserID=" + UserID,{headers})
        .subscribe((response: any) => {
          //  this.profileData = response.Users;
          // this.onProfileChanged.next(this.profileData);
          // resolve(response);
        }, reject);
    });
  }
}
