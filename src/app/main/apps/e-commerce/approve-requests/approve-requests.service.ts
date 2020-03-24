import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseenvironment } from "../../../../../config";

const headers = new HttpHeaders({
    "Content-Type": "application/json",
    "X-Api-Key":baseenvironment.xapikey
  });

@Injectable()
export class EcommerceApproveRequestsService implements Resolve<any>
{
    products: any[];
    usersData:any[];
    onProductsChanged: BehaviorSubject<any>;
    apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
    onUsersChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProducts()
              //  this.getApproveRequests()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getProducts(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/e-commerce-products')
                .subscribe((response: any) => {
                    this.products = response;
                    this.onProductsChanged.next(this.products);
                    resolve(response);
                }, reject);
        });
    }
     /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getApproveRequests(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.apiUrl + 'usersfilter?UserStatus=6')
                .subscribe((response: any) => {
                   // this.usersData = response.Users;
                   // this.onUsersChanged.next(this.usersData);
                    resolve(response);
                }, reject);
        });
    }
}
