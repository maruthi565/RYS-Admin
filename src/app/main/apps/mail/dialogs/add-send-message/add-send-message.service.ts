import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "config";

@Injectable()
export class EcommerceAddUserReportTypeService implements Resolve<any> {
  products: any[];
  userreportTypesList: any[];
  onUserReportTypeChanged: BehaviorSubject<any>;
  //onProductsChanged: BehaviorSubject<any>;
  //apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserReportTypeChanged = new BehaviorSubject({});
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
      Promise.all([this.getUserReportTypes()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Add reporttype
   *
   * @param userreporttype
   * @returns {Promise<any>}
   */
  addUserReportType(userreporttype): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(
          baseenvironment.baseUrl + "userreporttypes",
          JSON.stringify(userreporttype)
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getUserReportTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "userreporttypes")
        .subscribe((response: any) => {
          this.userreportTypesList = response.UserReportTypes;
          this.onUserReportTypeChanged.next(this.userreportTypesList);
          resolve(response);
        }, reject);
    });
  }

  getReportTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "userreporttypes")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  deleteSendMessage(messageID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "userreporttypes/" + messageID)
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
}
