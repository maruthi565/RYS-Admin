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
export class EcommerceBikeBrandService implements Resolve<any> {
  products: any[];
  bikeBrandsData: any[];
  onbikeBrandsChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onbikeBrandsChanged = new BehaviorSubject({});
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
      Promise.all([this.getBikeBrands("bikebrands")]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   *
   * @returns {Promise<any>}
   */
  getBikeBrands(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url)
        .subscribe((response: any) => {
          this.bikeBrandsData = response;
          this.onbikeBrandsChanged.next(this.bikeBrandsData);
          console.log(this.bikeBrandsData);
          resolve(response);
        }, reject);
    });
  }
  onOffAdd(datas, brandID): Promise<any> {
    console.log(datas);
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          baseenvironment.baseUrl + "bikebrands/" + brandID,
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
  getInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "bikesimagesinfoboxes")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
