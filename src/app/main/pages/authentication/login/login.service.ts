import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseenvironment } from "config";

const headers = new HttpHeaders({
    "Content-Type": "application/json",
    "X-Api-Key":baseenvironment.xapikey
  });

@Injectable()
export class LoginService implements Resolve<any>
{
    routeParams: any;
    order: any;
    login: any;
    onOrderChanged: BehaviorSubject<any>;
    apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
    //authenticate: BehaviorSubject<any>;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        //this.onOrderChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        
    }

    /**
     * authenticate
     *
     * @param login
     * @returns {Promise<any>}
     */
    authenticate(login): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${this.apiUrl}adminusers` ,JSON.stringify(login),{headers})
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
