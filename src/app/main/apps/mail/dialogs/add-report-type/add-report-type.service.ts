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
export class EcommerceAddReportTypeService implements Resolve<any> {
  products: any[];
  reportTypesList: any[];
  onReportTypeChanged: BehaviorSubject<any>;
  //onProductsChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onReportTypeChanged = new BehaviorSubject({});
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
      Promise.all([this.getTypes()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Add reporttype
   *
   * @param reporttype
   * @returns {Promise<any>}
   */
  addReportType(reporttype): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(
          baseenvironment.baseUrl + "reporttypes",
          JSON.stringify(reporttype)
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  //   getTypes(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //       this._httpClient
  //         .get(this.apiUrl + "reporttypes")
  //         .subscribe((response: any) => {
  //           this.reportTypesList = response.ReportTypes;
  //           this.onReportTypeChanged.next(this.reportTypesList);
  //           resolve(response);
  //         }, reject);
  //     });
  //   }
  getTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "reporttypes")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  deleteReportType(reportID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "reporttypes/" + reportID)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
