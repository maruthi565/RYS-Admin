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
export class EcommerceEventImagesService implements Resolve<any> {
  products: any[];
  eventImageData: any[];
  oneventImageChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.oneventImageChanged = new BehaviorSubject({});
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
      Promise.all([this.getEventImages()]).then(() => {
        resolve();
      }, reject);
    });
  }

  // getEventImages(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //        this._httpClient.get(this.apiUrl + 'defaultimages?Type=0')
  //             .subscribe((response: any) => {
  //                 resolve(response);
  //             }, reject);
  //     });
  // }
  getEventImages(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "/defaultimages?Type=0")
        .subscribe((response: any) => {
          this.eventImageData = response;
          this.oneventImageChanged.next(this.eventImageData);
          console.log(this.eventImageData);
          resolve(response);
        }, reject);
    });
  }
  deleteEventImage(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "defaultimages/" + data.ID)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
