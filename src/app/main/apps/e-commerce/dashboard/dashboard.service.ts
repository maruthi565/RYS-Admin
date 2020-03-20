import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { baseenvironment } from "../../../../../config";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "X-Api-Key":baseenvironment.xapikey
});

@Injectable()
export class DashboardService implements Resolve<any> {
  projects: any[];
  widgets: any[];
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {}

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
        this.getProjects(),
        this.getWidgets(),
        this.getDashboard()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get projects
   *
   * @returns {Promise<any>}
   */
  getProjects(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get("api/project-dashboard-projects",{headers})
        .subscribe((response: any) => {
          this.projects = response;
          resolve(response);
        }, reject);
    });
  }

  getDashboard(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "dashboard",{headers})
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  /**
   * Get widgets
   *
   * @returns {Promise<any>}
   */
  getWidgets(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get("api/project-dashboard-widgets",{headers})
        .subscribe((response: any) => {
          this.widgets = response;
          resolve(response);
        }, reject);
    });
  }
}
