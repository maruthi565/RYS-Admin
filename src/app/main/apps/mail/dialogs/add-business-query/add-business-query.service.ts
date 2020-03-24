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
export class EcommerceAddBusinessQueryService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  queryTypeData: any[];
  onQueryTypeChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onProductsChanged = new BehaviorSubject({});
    this.onQueryTypeChanged = new BehaviorSubject({});
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
      Promise.all([this.getBusinessQueryTypes()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getBusinessQueryTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "businessquerytypes",
        {
          headers
        })
        .subscribe((response: any) => {
          this.queryTypeData = response.BusinessQueryTypes;
          //console.log( 'response' ,this.eventData);
          this.onQueryTypeChanged.next(this.queryTypeData);
          console.log("last", this.queryTypeData);
          resolve(response);
        }, reject);
    });
  }
  updateBusinessQueryTypes(BusinessQueryTypes): Promise<any> {
    let dataquery = {
      TypeName: BusinessQueryTypes.TypeName
    };
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl +
            "businessquerytypes/" +
            BusinessQueryTypes.QueryTypeID,
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
