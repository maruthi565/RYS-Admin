import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "config";

@Injectable()
export class EcommerceBikerStories implements Resolve<any> {
  products: any[];
  onProductsChanged: BehaviorSubject<any>;
  //apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  myStoriesChanged: BehaviorSubject<any>;
  storiesData: any[];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.myStoriesChanged = new BehaviorSubject({});
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
      Promise.all([this.getStories("stories")]).then(() => {
        resolve();
      }, reject);
    });
  }

  getStories(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url)
        .subscribe((response: any) => {
          this.storiesData = response;
          this.myStoriesChanged.next(this.storiesData);
          resolve(response);
          console.log(response);
        }, reject);
    });
  }
  getMaximumPostedUser(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url)
        .subscribe((response: any) => {
          // this.maxPostedUserData = response;
          // this.maxPostedUserChanged.next(this.maxPostedUserData);
          resolve(response);
        }, reject);
    });
  }
  getTopCommentedPosts(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getTopLikedPosts(url): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + url)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  deleteStory(StoryID): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .delete(baseenvironment.baseUrl + "stories/" + StoryID)
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
  likeStory(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(
          baseenvironment.baseUrl +
            "stories?" +
            Number(localStorage.getItem("LikeStoryID")) +
            "&Liked=1"
        )
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getInfoBoxes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(baseenvironment.baseUrl + "bikerstories-infoboxes")
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
