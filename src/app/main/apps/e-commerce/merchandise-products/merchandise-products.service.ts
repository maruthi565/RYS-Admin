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
  "Content-Type": "application/json"
});

@Injectable()
export class EcommerceMerchandiseService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;

  merchandiseData: any[];
  myMerchandiseChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.myMerchandiseChanged = new BehaviorSubject({});
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
      Promise.all([this.getMerchandiseByVendorID()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   *
   * @returns {Promise<any>}
   */
  getProducts(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get("api/e-commerce-products")
        .subscribe((response: any) => {
          this.products = response;
          this.onProductsChanged.next(this.products);
          resolve(response);
        }, reject);
    });
  }
  getMerchandiseByVendorID(): Promise<any> {
    let id = JSON.parse(localStorage.getItem("VendorID"));
    //console.log("service" ,this.VendorID);
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "/merchandise?VendorID=" + id)
        .subscribe((response: any) => {
          this.merchandiseData = response;
          this.myMerchandiseChanged.next(this.merchandiseData);
          resolve(response);
        }, reject);
    });
  }
  deleteMerchandise(MerchandiseID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "merchandise/" + MerchandiseID)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  onOffMerchandise(datas, MerchandiseID): Promise<any> {
    console.log(datas);
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "merchandise/" + MerchandiseID,
          JSON.stringify(datas),
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
