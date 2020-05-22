import {
  Component,
  Inject,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators
} from "@angular/forms";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { CreateRideService } from "app/main/apps/e-commerce/create-ride/create-ride.service";
import { Router } from "@angular/router";
import { takeUntil, groupBy, take } from "rxjs/internal/operators";
import { Subject, ReplaySubject } from "rxjs";
//import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import { MatCheckbox, MatSelect } from "@angular/material";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { NgxImageCompressService } from "ngx-image-compress";
import { formatDate } from "@angular/common";

//declare var ImageCompressor: any;

//const compressor = new ImageCompressor();
//import { google } from '@agm/core/services/google-maps-types';
//import { google } from '@agm/core/services/google-maps-types';

import { DialogContentExampleDialog } from "app/main/apps/e-commerce/create-ride/dialog-content-example-dialog";
import { DatePipe } from "@angular/common";

interface RideBikeData {
  BrandID: number;
  BrandName: string;
  Image: string;
  BikeModels: any;
}

@Component({
  selector: "e-commerce-create-ride",
  templateUrl: "./create-ride.component.html",
  styleUrls: ["./create-ride.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceCreateRideComponent {
  fileData: File = null;
  previewUrl: any = null;
  urls = [];
  htmlUrls = [];
  showExtraToFields: boolean;
  createRideForm: FormGroup;
  isChecked = true;
  Checked = true;
  isCheck = true;
  bikeBrandModels: any[];
  brandData: Array<Object> = [];
  CurrentTime: any;
  minDate = new Date();
  today = new Date();
  //EstimatedDistanceVal: any;
  //ReturnEstimatedDistanceVal: any;
  // Private
  private _unsubscribeAll: Subject<any>;
  modelGroup: any[];
  temp: Array<Object> = [];
  returnTemp: Array<Object> = [];
  directionsService: any;
  directionsRenderer: any;
  countries: any;
  getcountries: any;
  //isSelected : boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  fromLocation: string;

  public bikeFilterCtrl: FormControl = new FormControl();

  private ridebikes: RideBikeData[];

  public filteredRideBikes: ReplaySubject<RideBikeData[]> = new ReplaySubject<
    RideBikeData[]
  >(1);

  @ViewChild("ridebikeSelect", { static: true }) ridebikeSelect: MatSelect;

  private _onDestroy = new Subject<void>();

  @ViewChild("search", { static: true }) private searchElementRef: ElementRef;
  @ViewChild("allSelected", { static: true }) private allSelected: MatCheckbox;
  data = {
    Price: [
      {
        Price: "",
        Description: ""
      }
    ]
  };

  halts = {
    HaltLocations: [
      {
        HaltID: "",
        Description: "",
        Name: "",
        Latitude: "",
        Longitude: ""
      }
    ]
  };
  returnhalts = {
    ReturnHaltLocations: [
      {
        HaltID: "",
        Description: "",
        Name: "",
        Latitude: "",
        Longitude: ""
      }
    ]
  };
  //@ViewChild('search', {read: ElementRef}) scaleControl: ElementRef;
  // @ViewChild('search', { static: true })
  // public searchElementRef: ElementRef;
  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceCreateEventComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private _createRideService: CreateRideService,
    private imageCompress: NgxImageCompressService,
    private _router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    // this.createRideForm = this.fb.group({
    //   StartDate: [''],
    //   EndDate: ['']
    // }, {validator: this.checkDates});

    // this.createRideForm.setValue({
    //   StartDate: this.createRideForm.value.StartDate,
    //   EndDate:  this.createRideForm.value.EndDate
    // })

    // Set the defaults
    this.createRideForm = this.fb.group({
      Price: this.fb.array([]),
      HaltLocations: this.fb.array([])
    });
    this.createRideForm = this.createComposeForm();
    this.showExtraToFields = false;
    this._unsubscribeAll = new Subject();
    this.setPrice();
    this.setHaltLocations();
    this.setReturnHaltLocations();
    this.imageCompress.DOC_ORIENTATION.NotJpeg;
    //this.createRideForm = this.fb.group({
    //    RideType: ['Free']
    //   })
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create compose form
   *
   * @returns {FormGroup}
   */
  createComposeForm(): FormGroup {
    return new FormGroup({
      UserID: new FormControl(""),
      AdminUserID: new FormControl(""),
      RideName: new FormControl("", Validators.required),
      Description: new FormControl("", Validators.required),
      Images: new FormControl([]),
      StartDate: new FormControl("", Validators.required),
      StartTime: new FormControl("", Validators.required),
      EndDate: new FormControl("", Validators.required),
      EndTime: new FormControl("", Validators.required),
      StartLocationName: new FormControl("", Validators.required),
      StartLocationLat: new FormControl(""),
      StartLocationLong: new FormControl(""),
      DestinationLocationName: new FormControl("", Validators.required),
      DestinationLocationLat: new FormControl(""),
      DestinationLocationLong: new FormControl(""),
      ReturnLocationName: new FormControl("", Validators.required),
      ReturnLocationLat: new FormControl(""),
      ReturnLocationLong: new FormControl(""),
      ReturnEstimatedDistance: new FormControl(""),
      AdditionalInfo: new FormControl(""),
      HaltLocations: this.fb.array([]),
      ReturnHaltLocations: this.fb.array([]),
      EstimatedDistance: new FormControl(""),
      RideType: new FormControl(""),
      InviteType: new FormControl(""),
      Price: this.fb.array([]),
      BrandModels: new FormControl(),
      bikeFilterCtrl:new FormControl(),
      Groups: this.fb.array([]),
      Contacts: this.fb.array([]),
      CreatedBy: new FormControl("",Validators.required),
      RidersCount: new FormControl(""),
      ShareLink: new FormControl(""),
      City: new FormControl(""),
      CountryID: new FormControl("", Validators.required),
      TotalPrice: new FormControl(""),
      isSelected: new FormControl(false),
      State: new FormControl("")
    });
  }

  ngOnInit(): void {
    this.CurrentTime = formatDate(
      this.today,
      "dd-MM-yyyy hh:mm a",
      "en-US",
      "+0530"
    );

    console.log(this.CurrentTime);

    var starttime = this.createRideForm.value.StartTime;
    console.log(starttime);
    var endtime = this.createRideForm.value.EndTime;
    console.log(endtime);

    this.createRideForm.patchValue({
      RideType: "Paid",
      InviteType: "Public"
    });
    this._createRideService.getCountries().then(data => {
      //this.countries = res;
      this.getcountries = data.Countries;
    });
    console.log(this.countries);
    this._createRideService.onCreateRideChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(bikeBrandModels => {
        if (bikeBrandModels.Status == 1) {
          this.bikeBrandModels = bikeBrandModels.BikeBrandModels;

          this.bikeBrandModels.forEach(bikeBrand => {
            bikeBrand.BikeModels.forEach(bikeModal => {
              bikeModal.BrandID = bikeBrand.BrandID;
            });
            this.ridebikes = this.bikeBrandModels;
            this.filteredRideBikes.next(this.ridebikes.slice());
          });
        }
      });

    this.bikeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  ngAfterViewInit() {
    // this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  private setInitialValue() {
    this.filteredRideBikes
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.ridebikeSelect.compareWith = (a: RideBikeData, b: RideBikeData) =>
          a.BrandID === b.BrandID;
      });
  }

  private filterBanks() {
    if (!this.ridebikes) {
      return;
    }
    // get the search keyword
    let search = this.bikeFilterCtrl.value;
    if (!search) {
      this.filteredRideBikes.next(this.ridebikes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredRideBikes.next(
      this.ridebikes.filter(
        bank => bank.BrandName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
  }
  onChange() {
    if (this.urls.length <= 4) {
      this.imageCompress.uploadFile().then(({ image, orientation }) => {
        let isPNG: boolean = image.includes("image/png");
        let isJPEG: boolean = image.includes("image/jpeg");
        if (isPNG || isJPEG) {
          console.warn(
            "Size in bytes was:",
            this.imageCompress.byteCount(image)
          );
          if (this.imageCompress.byteCount(image) < 200000) {
            let imageSplits = image.split(",");
            console.log(imageSplits[1]);
            if (imageSplits != undefined && imageSplits[1] != undefined) {
              this.htmlUrls.push(image);
              this.urls.push(imageSplits[1]);
            }
            console.warn(
              "Size in bytes is now:",
              this.imageCompress.byteCount(image)
            );
          } else {
            this.imageCompress
              .compressFile(image, orientation, 20, 20)
              .then(result => {
                let imageSplits = result.split(",");
                console.log(imageSplits[1]);
                // console.log(result.width);
                if (imageSplits != undefined && imageSplits[1] != undefined) {
                  this.htmlUrls.push(result);
                  this.urls.push(imageSplits[1]);
                }
                console.log(result);
                console.warn(
                  "Size in bytes is now:",
                  this.imageCompress.byteCount(result)
                );
              });
          }
          this.isCheck = false;
        } else {
          alert("Please select only png/jpeg file format");
        }
      });
    } else {
      alert("Max files limit is 3 ");
    }
  }

  radioChange(event) {
    if (!this.isCheck) {
      this.urls = [];
      this.htmlUrls = [];
      this.isCheck = true;
    }
  }
  addNewPrice() {
    let control = <FormArray>this.createRideForm.controls.Price;
    control.push(
      this.fb.group({
        Price: [""],
        Description: [""]
      })
    );
  }
  addNewHaltLocations() {
    let control = <FormArray>this.createRideForm.controls.HaltLocations;
    control.push(
      this.fb.group({
        HaltID: [""],
        Description: [""],
        Name: [""],
        Latitude: [""],
        Longitude: [""]
      })
    );
  }
  addNewReturnHaltLocations() {
    let control = <FormArray>this.createRideForm.controls.ReturnHaltLocations;
    control.push(
      this.fb.group({
        HaltID: [""],
        Description: [""],
        Name: [""],
        Latitude: [""],
        Longitude: [""]
      })
    );
  }
  setPrice() {
    let control = <FormArray>this.createRideForm.controls.Price;
    this.data.Price.forEach(x => {
      control.push(
        this.fb.group({
          Price: x.Price,
          Description: x.Description
        })
      );
    });
  }
  setHaltLocations() {
    let control = <FormArray>this.createRideForm.controls.HaltLocations;
    this.halts.HaltLocations.forEach(x => {
      control.push(
        this.fb.group({
          HaltID: x.HaltID,
          Description: x.Description,
          Name: x.Name,
          Latitude: x.Latitude,
          Longitude: x.Longitude
        })
      );
    });
  }

  setReturnHaltLocations() {
    let control = <FormArray>this.createRideForm.controls.ReturnHaltLocations;
    this.returnhalts.ReturnHaltLocations.forEach(x => {
      control.push(
        this.fb.group({
          HaltID: x.HaltID,
          Description: x.Description,
          Name: x.Name,
          Latitude: x.Latitude,
          Longitude: x.Longitude
        })
      );
    });
  }

  validateDates(sDate: string, eDate: string) {
    if (sDate == null || eDate == null) {
      alert("Start date and end date are required.");
      //this.error={isError:true,errorMessage:'Start date and end date are required.'};
      return false;
    }
    if (sDate != null && eDate != null && sDate > eDate) {
      alert("Start date should be less then end date.");
      this.createRideForm.patchValue({
        StartDate: undefined
      });
      //this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      return false;
    }

    if (sDate != null && eDate != null && eDate < sDate) {
      alert("End date should be grater then start date.");
      this.createRideForm.patchValue({
        EndDate: undefined
      });
      //this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      return false;
    }
  }
  compareTwoDates() {
    var StartDate = this.datePipe.transform(
      this.createRideForm.value.StartDate,
      "dd-MM-yyyy"
    );
    var EndDate = this.datePipe.transform(
      this.createRideForm.value.EndDate,
      "dd-MM-yyyy"
    );

    // this.validateDates(StartDate, EndDate);

    /* 
    console.log(this.createRideForm.value.StartDate);
    console.log(this.createRideForm.value.EndDate);
    console.log(new Date(this.createRideForm.value.StartDate), new Date(this.createRideForm.value.EndDate));
    alert("hai");
  if(this.createRideForm.value.StartDate < this.createRideForm.value.EndDate){
    alert("End Date Should not be lesser than Start Date")
  } */
  }

  deleteReturnHaltLocations(index) {
    let control = <FormArray>this.createRideForm.controls.ReturnHaltLocations;
    control.removeAt(index);
    this.returnTemp.splice(index, 1);
    this.createRideForm.patchValue({
      HaltLocations: this.returnTemp
    });

    this.calcRoute(
      this.createRideForm.value.DestinationLocationLat +
        "," +
        this.createRideForm.value.DestinationLocationLong,
      this.createRideForm.value.ReturnLocationLat +
        "," +
        this.createRideForm.value.ReturnLocationLong,
      this.createRideForm.value.ReturnHaltLocations,
      "RetHalts"
    );
  }

  deleteHaltLocations(index) {
    let control = <FormArray>this.createRideForm.controls.HaltLocations;
    control.removeAt(index);
    this.temp.splice(index, 1);
    this.calcRoute(
      this.createRideForm.value.StartLocationLat +
        "," +
        this.createRideForm.value.StartLocationLong,
      this.createRideForm.value.DestinationLocationLat +
        "," +
        this.createRideForm.value.DestinationLocationLong,
      this.createRideForm.value.HaltLocations,
      "DestHalts"
    );

    //this.createRideForm.patchValue({
    // HaltLocations: this.temp
    //});
  }

  deletePrice(index) {
    let control = <FormArray>this.createRideForm.controls.Price;
    control.removeAt(index);
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  computeTotalDistance(result, fromLocation) {
    var totalDist = 0;
    var totalTime = 0;
    var myroute: any = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      totalDist += myroute.legs[i].distance.value;
      totalTime += myroute.legs[i].duration.value;
    }
    totalDist = totalDist / 1000;
    console.log(
      "total distance is: " +
        totalDist +
        " km<br>total time is: " +
        (totalTime / 60).toFixed(2) +
        " minutes"
    );
    if (fromLocation == "DestHalts") {
      this.createRideForm.patchValue({
        EstimatedDistance: totalDist + " km"
      });

      // this.EstimatedDistanceVal = totalDist;
    }
    
    if (fromLocation == "RetHalts") {
      this.createRideForm.patchValue({
        ReturnEstimatedDistance: totalDist + " km"
      });

      // this.ReturnEstimatedDistanceVal = totalDist;
    }
  }

  calcRoute(startLatLong, endLatLong, wayPoints, fromLocation) {
    var wayPointsObj: any = [];
    wayPoints.forEach(function(wayPoint) {
      if (wayPoint.Latitude != "" && wayPoint.Longitude != "") {
        var way = {
          location: wayPoint.Latitude + "," + wayPoint.Longitude,
          stopover: true
        };
        wayPointsObj.push(way);
      }
    });
    var directionsService: any = new google.maps.DirectionsService();

    var request = {
      // from: Blackpool to: Preston to: Blackburn
      origin: startLatLong,
      destination: endLatLong,
      waypoints: wayPointsObj,
      optimizeWaypoints: false,
      travelMode: "DRIVING"
    };
    var self = this;
    self.fromLocation = fromLocation;
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        //directionsDisplay.setDirections(response);
        //var route = response.routes[0];

        self.computeTotalDistance(response, self.fromLocation);
      } else {
        alert("directions response " + status);
      }
    });
  }

  openDialog(targetPath, index) {
    if (targetPath == "destLocation") {
      if (
        this.createRideForm.value.StartLocationName == undefined ||
        this.createRideForm.value.StartLocationName == ""
      ) {
        alert("Please Select Start Location");
        return;
      }
    }

    if (targetPath == "returnLocation") {
      if (
        this.createRideForm.value.StartLocationName == undefined ||
        this.createRideForm.value.DestinationLocationName == undefined
      ) {
        alert("Please Select Start and End Locations");
        return;
      }
    }
    if (targetPath == "haltLocation") {
      if (
        this.createRideForm.value.StartLocationName == undefined ||
        this.createRideForm.value.DestinationLocationName == undefined
      ) {
        alert("Please Select Start and End Locations");
        return;
      }
    }
    if (targetPath == "returnHaltLocation") {
      if (
        this.createRideForm.value.DestinationLocationName == undefined ||
        this.createRideForm.value.DestinationLocationName == ""
      ) {
        alert("Please Select End Locations");
        return;
      }
    }
    if (
      targetPath == "returnLocation" ||
      targetPath == "destLocation" ||
      targetPath == "haltLocation" ||
      targetPath == "returnHaltLocation"
    ) {
      if (
        this.createRideForm.value.StartLocationName == undefined ||
        this.createRideForm.value.StartLocationName == ""
      ) {
        alert("Please Select Start Location");
        return;
      }
    }

    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: "800px",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);

      if (result != undefined && result != "") {
        if (targetPath == "startLocation") {
          this.createRideForm.patchValue({
            StartLocationName: result.address,
            StartLocationLat: result.latitude,
            StartLocationLong: result.longitude,
            State:localStorage.getItem("RideState")
          });
          console.log("Ride created State:",localStorage.getItem("RideState"));
        }
        if (targetPath == "returnLocation") {
          if (
            this.createRideForm.value.StartLocationName == undefined ||
            this.createRideForm.value.StartLocationName == ""
          ) {
            alert("Please select location");
            return;
          }
          // else
          //   this.createRideForm.value.State=localStorage.getItem("RideState");

          this.createRideForm.patchValue({
            ReturnLocationName: result.address,
            ReturnLocationLat: result.latitude,
            ReturnLocationLong: result.longitude
          });

          var startLatLong =
            this.createRideForm.value.DestinationLocationLat +
            "," +
            this.createRideForm.value.DestinationLocationLong;
          var endLatLong =
            this.createRideForm.value.ReturnLocationLat +
            "," +
            this.createRideForm.value.ReturnLocationLong;

          this.calcRoute(
            startLatLong,
            endLatLong,
            this.createRideForm.value.ReturnHaltLocations,
            "RetHalts"
          );
        }
        if (targetPath == "destLocation") {
          if (
            this.createRideForm.value.StartLocationName == undefined ||
            this.createRideForm.value.StartLocationName == ""
          ) {
            alert("Please select location");
            return;
          }

          this.createRideForm.patchValue({
            DestinationLocationName: result.address,
            DestinationLocationLat: result.latitude,
            DestinationLocationLong: result.longitude
          });

          var startLatLong =
            this.createRideForm.value.StartLocationLat +
            "," +
            this.createRideForm.value.StartLocationLong;
          var endLatLong =
            this.createRideForm.value.DestinationLocationLat +
            "," +
            this.createRideForm.value.DestinationLocationLong;

          this.calcRoute(
            startLatLong,
            endLatLong,
            this.createRideForm.value.HaltLocations,
            "DestHalts"
          );
        }
        if (targetPath == "haltLocation") {
          if (
            this.createRideForm.value.StartLocationName == undefined ||
            this.createRideForm.value.StartLocationName == ""
          ) {
            alert("Please select location");
            return;
          }
          var item = {
            HaltID: "Halt" + index,
            Description: "A break ",
            Name: result.address,
            Latitude: result.latitude,
            Longitude: result.longitude
          };
          if (!this.temp[index]) {
            this.temp.push(item);
          } else {
            this.temp[index] = item;
          }
          this.createRideForm.patchValue({
            HaltLocations: this.temp
          });

          this.calcRoute(
            this.createRideForm.value.StartLocationLat +
              "," +
              this.createRideForm.value.StartLocationLong,
            this.createRideForm.value.DestinationLocationLat +
              "," +
              this.createRideForm.value.DestinationLocationLong,
            this.createRideForm.value.HaltLocations,
            "DestHalts"
          );
        }
        if (targetPath == "returnHaltLocation") {
          if (
            this.createRideForm.value.StartLocationName == undefined ||
            this.createRideForm.value.StartLocationName == ""
          ) {
            alert("Please select location");
            return;
          }
          var item = {
            HaltID: "Halt" + index,
            Description: "A break ",
            Name: result.address,
            Latitude: result.latitude,
            Longitude: result.longitude
          };

          if (!this.returnTemp[index]) {
            this.returnTemp.push(item);
          } else {
            this.returnTemp[index] = item;
          }
          this.createRideForm.patchValue({
            ReturnHaltLocations: this.returnTemp
          });

          this.calcRoute(
            this.createRideForm.value.DestinationLocationLat +
              "," +
              this.createRideForm.value.DestinationLocationLong,
            this.createRideForm.value.ReturnLocationLat +
              "," +
              this.createRideForm.value.ReturnLocationLong,
            this.createRideForm.value.ReturnHaltLocations,
            "RetHalts"
          );
        }
      }
    });
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }

  tosslePerOne(all) {
    var list = [];
    //var data = this.createRideForm.get('BrandModels').value;
    //console.log(data);
    if (this.allSelected.checked) {
      this.allSelected.checked = false;
      return false;
    } else {
      this.bikeBrandModels.forEach(function(item) {
        item.BikeModels.forEach(function(bike) {
          list.push(bike);
        });
      });
    }

    if (this.createRideForm.get("BrandModels").value.length == list.length) {
      this.allSelected.checked = true;
    }
  }
  toggleAllSelection() {
    let bikes: any = this.bikeBrandModels[0];
    if (!this.createRideForm.value.isSelected) {
      var result: any = [];
      this.bikeBrandModels.forEach(function(obj) {
        obj.BikeModels.map(item => result.push(item));
      });

      this.createRideForm.controls.BrandModels.patchValue(result);
    } else {
      this.createRideForm.controls.BrandModels.patchValue([]);
    }
  }

  onCreateRide() {
    var StartDate = this.datePipe.transform(
      this.createRideForm.value.StartDate,
      "yyyy/MM/dd"
    );
    var EndDate = this.datePipe.transform(
      this.createRideForm.value.EndDate,
      "yyyy/MM/dd"
    );

    var startdate = new Date(StartDate);
    var newstartdate = new Date(
      startdate.getFullYear(),
      startdate.getMonth(),
      startdate.getDate()
    );
    console.log(newstartdate);

    var enddate = new Date(EndDate);
    var newenddate = new Date(
      enddate.getFullYear(),
      enddate.getMonth(),
      enddate.getDate()
    );
    console.log(newenddate);
    var current = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );

    let today = new Date();
    console.log(today);
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let starttimes = this.createRideForm.value.StartTime.split(":");
    let endtimes = this.createRideForm.value.EndTime.split(":");
    let currenttimes = time.split(":");

    newstartdate.setHours(parseInt(starttimes[0]));
    newstartdate.setMinutes(parseInt(starttimes[1]));
    //newstartdate.setSeconds(parseInt(starttimes[2]));

    newenddate.setHours(parseInt(endtimes[0]));
    newenddate.setMinutes(parseInt(endtimes[1]));
    //newenddate.setSeconds(parseInt(endtimes[2]));

    today.setHours(parseInt(currenttimes[0]));
    today.setMinutes(parseInt(currenttimes[1]));
    today.setSeconds(parseInt(currenttimes[2]));

    if (newstartdate > newenddate) {
      alert("EndDate is less than StartDate ");
      this.createRideForm.patchValue({
        EndDate: undefined
      });
    }
    if (newstartdate < today) {
      alert("StartTime is less than  Current System Time");
      this.createRideForm.patchValue({
        StartTime: undefined
      });
    }
    if (newenddate < today) {
      alert("EndTime is less than Current System Time");
      this.createRideForm.patchValue({
        EndTime: undefined
      });
    }

    //return;
    // this.createRideForm.value.UserID = localStorage.getItem('AdminUserID');
    // this.createRideForm.value.CreatedBy = Number(localStorage.getItem('AdminUserID'));
    if (this.createRideForm.invalid) {
      alert("Please fill all the details");
    } else {
      this.brandData = [];

      if (this.allSelected.checked) {
        this.createRideForm.patchValue({
          BrandModels: ["All"]
        });
      } else {
        if (
          this.createRideForm.value.BrandModels != undefined &&
          this.createRideForm.value.BrandModels.length > 0
        ) {
          this.createRideForm.value.BrandModels.forEach(item => {
            var formbike;
            if (this.brandData == undefined || this.brandData.length == 0) {
              formbike = {
                Models: [item.BikeModelID],
                BrandID: item.BrandID.toString()
              };

              this.brandData.push(formbike);
            } else {
              var newbike;
              this.brandData.forEach(bike => {
                if (bike["BrandID"] == item.BrandID) {
                  bike["Models"].push(item.BikeModelID);
                } else {
                  newbike = {
                    Models: [item.BikeModelID],
                    BrandID: item.BrandID.toString()
                  };
                  var data = this.brandData.filter(
                    book => book["BrandID"] == item.BrandID
                  );
                  if (data.length == 0) {
                    this.brandData.push(newbike);
                  }
                }
              });
            }
          });
        }

        this.createRideForm.patchValue({
          BrandModels: this.brandData
        });

        if (
          this.createRideForm.value.BrandModels != undefined &&
          this.createRideForm.value.BrandModels.length > 0
        ) {
          this.createRideForm.value.BrandModels.forEach(function(brand) {
            var strArr = brand.Models.map(function(e) {
              return e.toString();
            });
            brand.Models = strArr;
          });
        }
      }
      console.log(this.createRideForm.value.BrandModels);

      /* this.createRideForm.patchValue({
     
      HaltLocations: finalHaltLocations || []
    });
    this.createRideForm.patchValue({
    
      ReturnHaltLocations: finalReturnHaltLocations || []
    }); */

      this.createRideForm.value.UserID = localStorage.getItem("AdminUserID");
      this.createRideForm.value.CreatedBy = Number(
        localStorage.getItem("AdminUserID")
      );

      if (this.isCheck) {
        this.createRideForm.value.Images = [];
      } else {
        this.createRideForm.value.Images = this.urls;
      }

      this.createRideForm.value.StartDate = this.datePipe.transform(
        this.createRideForm.value.StartDate,
        "yyyy-MM-dd"
      );

      this.createRideForm.value.EndDate = this.datePipe.transform(
        this.createRideForm.value.EndDate,
        "yyyy-MM-dd"
      );

      this.createRideForm.value.InviteType = 0;
      this.createRideForm.value.City = localStorage.getItem("RideCity");
      this.createRideForm.value.State = localStorage.getItem("RideState");
      this._createRideService
        .createRide(this.createRideForm.value)
        .then(data => {
          // Show the success message
          if (data.Status == 1) {
            //let result = data.VendorDetails;
            alert("Ride created successfully");
            this._router.navigate(["apps/e-commerce/rides"]);
          } else alert(data.Message);
        });
    }
  }
}
