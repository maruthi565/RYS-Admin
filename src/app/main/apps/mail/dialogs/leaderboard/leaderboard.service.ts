import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import * as config from "config";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "X-Api-Key":config.baseenvironment.xapikey
});

@Injectable()
export class LeaderboardService implements Resolve<any> {
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

  getLeaderboardTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(config.baseenvironment.baseUrl + "leaderboardmessagetype",{headers})
        .subscribe((response: any) => {
          // this.leaderboardTypesList = response.LeaderboardMessageTypes;
          this.leaderboardTypesList = response;
          // this.onLeaderboardTypeChanged.next(this.leaderboardTypesList);
          resolve(response);
        }, reject);
    });
  }
  updateLeaderBoard(data, id): Promise<any> {
    // let dataquery = {
    //     "TypeName": BusinessQueryTypes.TypeName
    // }
    console.log(data);
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(
          config.baseenvironment.baseUrl + "leaderboardmessagetype/" + id,
          JSON.stringify(data),
          {
            headers
          }
        )
        .subscribe((response: any) => {
          resolve(response);
          //console.log(response);
        }, reject);
    });
  }
}
