import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "../../../../../config";

const headers = new HttpHeaders({ "Content-Type": "Application/json" });
@Injectable()
export class EcommerceEditMerchandiseService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/merchandise";

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
        // this.getProducts()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   * @param merchandise
   * @returns {Promise<any>}
   */
  editMerchandise(merchandise): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "merchandise/" + merchandise.MerchandiseID,
          JSON.stringify(merchandise),
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
