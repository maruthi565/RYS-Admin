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
export class EcommerceBikerCommentsService implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  commentsData: any[];
  oncommentsChanged: BehaviorSubject<any>;
  //apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.oncommentsChanged = new BehaviorSubject({});
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
        //  this.getStoryComments(this.StoryID)
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  getStoryComments(StoryID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "comments?StoryID=" + StoryID)
        .subscribe((response: any) => {
          this.commentsData = response.Comments;
          this.oncommentsChanged.next(this.commentsData);
          resolve(response);
          console.log(this.commentsData);
        }, reject);
    });
  }
  /**
   * Add comments
   * @param comments
   * @returns {Promise<any>}
   */
  addComments(comments): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(baseenvironment.baseUrl + "comments", JSON.stringify(comments))
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
