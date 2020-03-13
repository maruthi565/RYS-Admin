import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
const headers = new HttpHeaders({ 
    'Content-Type': 'application/json'
     });
@Injectable()
export class ViewCouponDialogService implements Resolve<any>
{
    apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        //this.onProductsChanged = new BehaviorSubject({});
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
                //this.getProducts()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

  
    AcceptCoupon(data,couponJson): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(this.apiUrl + 'coupons/' + data.CouponID , JSON.stringify(couponJson), {
                headers
            })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    RejectUserBike(data,bikerejectJson): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(this.apiUrl + 'userpostedbikes/' + data.ID , JSON.stringify(bikerejectJson), {
                headers
            })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
  
   
}
