import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "config";

// const headers = new HttpHeaders({
//      'Content-Type': 'Application/json',
//      'Access-Control-Allow-Origin': '*'
//      });

@Injectable()
export class EcommerceAddFeedbackService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  feedbackTypesList: any[];
  onFeedbackTypeChanged: BehaviorSubject<any>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    //  this.onProductsChanged = new BehaviorSubject({});
    this.onFeedbackTypeChanged = new BehaviorSubject({});
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
      Promise.all([this.getFeedbackTypes()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Add feedbacktype
   *
   * @param feedbacktype
   * @returns {Promise<any>}
   */
  addFeedbackType(feedbacktype): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(
          baseenvironment.baseUrl + "feedbacktypes",
          JSON.stringify(feedbacktype)
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getFeedbackTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "feedbacktypes")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  deleteFeedback(typeID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "feedbacktypes/" + typeID)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
