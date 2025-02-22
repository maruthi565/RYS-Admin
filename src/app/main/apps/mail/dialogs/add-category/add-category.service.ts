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
export class EcommerceAddCategoryService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  categoriesList: any[];
  onCategoryChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onProductsChanged = new BehaviorSubject({});
    this.onCategoryChanged = new BehaviorSubject({});
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
      Promise.all([this.getCategories()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "merchandisecategories",
        {
          headers
        })
        .subscribe((response: any) => {
          // this.categoriesList = response.MerchandiseCategories;
          // this.onCategoryChanged.next(this.categoriesList);
          resolve(response);
        }, reject);
    });
  }
  addCategory(category): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(
          baseenvironment.baseUrl + "merchandisecategories",
          JSON.stringify(category),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  deleteCategoryType(categoryID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "merchandisecategories/" + categoryID,
        {
          headers
        })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
