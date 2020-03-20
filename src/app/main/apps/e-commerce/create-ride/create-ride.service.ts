import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { baseenvironment } from "../../../../../config";


<<<<<<< HEAD
=======

const headers = new HttpHeaders({ "Content-Type": "Application/json", 
"X-Api-Key":baseenvironment.xapikey});
>>>>>>> 078ab9417e8a4f41f6fc102d9f3d4a7bbfb770a7
const httpOptions = {
  headers: new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "Application/json",
    "X-Api-Key":baseenvironment.xapikey
  })
};
@Injectable()
export class CreateRideService implements Resolve<any> {
  ride: any[];
  bikeBrandModels: any[];
  countriesModels: any[];
  onCreateRideChanged: BehaviorSubject<any>;
  // apiUrl = "https://rhtvhdthuh.execute-api.ap-south-1.amazonaws.com/dev/";
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onCreateRideChanged = new BehaviorSubject({});
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
      Promise.all([this.getBrands()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get brands
   *
   * @returns {Promise<any>}
   */

  getBrands(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
<<<<<<< HEAD
        .get(baseenvironment.baseUrl + "bikebrandmodels",httpOptions)
=======
        .get(baseenvironment.baseUrl + "bikebrandmodels",
        {
          headers
        })
>>>>>>> 078ab9417e8a4f41f6fc102d9f3d4a7bbfb770a7
        .subscribe((response: any) => {
          this.bikeBrandModels = response;
          this.onCreateRideChanged.next(this.bikeBrandModels);
          //console.log(this.bikeBrandModels);
          resolve(response);
        }, reject);
    });
  }

  getCountries(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
<<<<<<< HEAD
        .get(baseenvironment.baseUrl + "countries",httpOptions)
=======
        .get(baseenvironment.baseUrl + "countries",
        
        {
          headers
        })
>>>>>>> 078ab9417e8a4f41f6fc102d9f3d4a7bbfb770a7
        .subscribe((response: any) => {
          //this.countriesModels = response;
          //this.onCreateRideChanged.next(this.countriesModels);
          console.log(this.countriesModels);
          resolve(response);
        }, reject);
    });
  }

  /**
   * Create Ride
   *
   * @param createride
   * @returns {Promise<any>}
   */
  createRide(ride): Promise<any> {
    /*  var data = {
            "StartLocationLong": 78.486671,
            "StartDate": "2019-10-20",
            "Brands": [
            "13298339",
            "14525628",
            "14932422",
            "15424174",
            "15567370",
            "16089638",
            "17527983",
            "18740982"
            ],
            "StartTime": "14:14:00",
            "RideName": "ridenewadmin",
            "Images": [
            "https://revyoursoulapp.s3.ap-south-1.amazonaws.com/DoNotDelete-DefaultCreateRideImage/bikerImage%403x.png"
            ],
            "DestinationLocationName": "Chennai",
            "ReturnHaltLocations": [
            {
            "HaltID": "Halt1",
            "Description": "C break",
            "Latitude": 15.5057232,
            "Longitude": 80.049921999999995,
            "Name": "Ongole"
            }
            ],
            "HaltLocations": [
            {
            "HaltID": "Halt1",
            "Description": "A break ",
            "Name": "Ongole",
            "Latitude": 15.5057232,
            "Longitude": 80.049921999999995
            },
            {
            "Longitude": 79.98645599999999,
            "Name": "Nellore",
            "Description": "B break ",
            "HaltID": "Halt2",
            "Latitude": 14.4425987
            }
            ],
            "ReturnLocationLong": 78.486671,
            "RideType": "Paid",
            "Description": "Sai",
            "ReturnEstimatedDistance": "625 km",
            "UserID": "10007",
            "EndDate": "2019-10-21",
            "ReturnLocationLat": 17.385044,
            "StartLocationName": "Hyderabad",
            "InviteType": "0",
            "EndTime": "16:14:00",
            "DestinationLocationLat": 13.0826802,
            "StartLocationLat": 17.385044,
            "Price": [
            {
            "Price": "1000",
            "Description": "Basic fee",
            "HaltID": "Halt1"
            }
            ],
            "ReturnLocationName": "Hyderabad",
            "DestinationLocationLong": 80.2707184,
            "AdditionalInfo": "Add info nothing",
            "EstimatedDistance": "630 km"
          } */

    return new Promise((resolve, reject) => {
      this._httpClient
<<<<<<< HEAD
        .post(baseenvironment.baseUrl + "rides", JSON.stringify(ride),httpOptions)
=======
        .post(baseenvironment.baseUrl + "rides", JSON.stringify(ride),
        {
          headers
        })
>>>>>>> 078ab9417e8a4f41f6fc102d9f3d4a7bbfb770a7
        .subscribe((response: any) => {
          //alert('Ride Created Succesfully');
          resolve(response);
        }, reject);
    });
  }
}
