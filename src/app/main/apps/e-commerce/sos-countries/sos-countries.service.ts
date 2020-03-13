import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "../../../../../config";

@Injectable()
export class EcommerceSOSContactsService implements Resolve<any> {
  soscontactsData: any[];
  onsosContactsChanged: BehaviorSubject<any>;
  // apiUrl = 'https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/';

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onsosContactsChanged = new BehaviorSubject({});
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
      Promise.all([this.getSOSContacts()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get products
   *
   * @returns {Promise<any>}
   */
  getSOSContacts(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "/soscontacts")
        .subscribe((response: any) => {
          this.soscontactsData = response.SOSContacts;
          this.onsosContactsChanged.next(this.soscontactsData);
          resolve(response);
        }, reject);
    });
  }
}
