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
  "X-Api-Key":"pEnt2cTuXgKa4zf8FNTSapMmNGXuQbo8jJW0EXec"
});

@Injectable()
export class EcommerceAdddLeaderboardMessageTypeService
  implements Resolve<any> {
  products: any[];
  leaderboardTypesList: any[];
  onLeaderboardTypeChanged: BehaviorSubject<any>;
  //onProductsChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onLeaderboardTypeChanged = new BehaviorSubject({});
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
      Promise.all([this.getLeaderboardTypes()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Add reporttype
   *
   * @param leaderboardtype
   * @returns {Promise<any>}
   */
  addLeaderboardType(leaderboardtype): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(
          baseenvironment.baseUrl + "leaderboardmessagetype",
          JSON.stringify(leaderboardtype),
          {headers}
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getLeaderboardTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "leaderboardmessagetype",{headers})
        .subscribe((response: any) => {
          this.leaderboardTypesList = response.LeaderboardMessageTypes;
          this.onLeaderboardTypeChanged.next(this.leaderboardTypesList);
          resolve(response);
        }, reject);
    });
  }
}
