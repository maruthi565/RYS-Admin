import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
<<<<<<< HEAD
import { HttpClient, HttpHeaders } from "@angular/common/http";
=======
import { HttpClient,HttpHeaders } from "@angular/common/http";
>>>>>>> b960a8a9568062102503960ed8a17a1d8454ebd0
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "config";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
<<<<<<< HEAD
  "X-Api-Key":baseenvironment.xapikey
=======
  "X-Api-Key":"pEnt2cTuXgKa4zf8FNTSapMmNGXuQbo8jJW0EXec"
>>>>>>> b960a8a9568062102503960ed8a17a1d8454ebd0
});

@Injectable()
export class EcommerceAddBikeBrandService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  // apiUrl = 'https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/';

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
   * @param bikebrand
   * @returns {Promise<any>}
   */
  // getProducts(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //         this._httpClient.get('api/e-commerce-products')
  //             .subscribe((response: any) => {
  //                 this.products = response;
  //                 this.onProductsChanged.next(this.products);
  //                 resolve(response);
  //             }, reject);
  //     });
  // }
  addBikeBrand(bikebrand): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
<<<<<<< HEAD
        .post(baseenvironment.baseUrl + "bikebrands", JSON.stringify(bikebrand),
        {
          headers
        })
=======
        .post(baseenvironment.baseUrl + "bikebrands", JSON.stringify(bikebrand),{headers})
>>>>>>> b960a8a9568062102503960ed8a17a1d8454ebd0
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
