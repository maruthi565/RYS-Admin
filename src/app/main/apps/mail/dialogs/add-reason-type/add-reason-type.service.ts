import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "config";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "X-Api-Key":baseenvironment.xapikey
});
@Injectable()
export class EcommerceAddReasonTypeService implements Resolve<any> {
  products: any[];
  reasonTypeData: any[];
  onReasonTypeChanged: BehaviorSubject<any>;
  //onProductsChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onReasonTypeChanged = new BehaviorSubject({});
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
      Promise.all([this.getReasonTypes()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Add reasontype
   *
   * @param reasontype
   * @returns {Promise<any>}
   */
  addReasonType(reasontype): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(
          baseenvironment.baseUrl + "reasontype",
          JSON.stringify(reasontype),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getReasonTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "reasontype",
        {
          headers
        })
        .subscribe((response: any) => {
          this.reasonTypeData = response.ReasonType;
          //console.log( 'response' ,this.eventData);
          this.onReasonTypeChanged.next(this.reasonTypeData);
          console.log("last", this.reasonTypeData);
          resolve(response);
        }, reject);
    });
  }
  updateReasonTypes(ReasonType): Promise<any> {
    let dataquery = {
      ReasonTitle: ReasonType.ReasonTitle
    };
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "reasontype/" + ReasonType.ReasonTypeID,
          JSON.stringify(dataquery),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
          //console.log(response);
        }, reject);
    });
  }
}
