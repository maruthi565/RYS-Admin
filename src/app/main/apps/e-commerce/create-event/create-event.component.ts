import {
  Component,
  ViewEncapsulation,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { EventsService } from "../events/events.service";
import { EventDialogContentExampleDialog } from "./dialog-content-event-example-dialog";
import { MapsAPILoader } from "@agm/core";
import { DatePipe } from "@angular/common";
import { MatCheckbox, MatSelect } from "@angular/material";
import { Router } from "@angular/router";
import { NgxImageCompressService } from "ngx-image-compress";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";

interface BikeData {
  BrandID: number;
  BrandName: string;
  Image: string;
  BikeModels: any;
}

@Component({
  selector: "e-commerce-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceCreateEventComponent implements OnInit {
  public bikeFilterCtrl: FormControl = new FormControl();
  private bikes: BikeData[];
  public filteredBikes: ReplaySubject<BikeData[]> = new ReplaySubject<
    BikeData[]
  >(1);

  showExtraToFields: boolean;
  createEventForm: FormGroup;
  isCheck = true;
  isPaid = true;
  //checked = false;
  bikeBrandModels: any;
  brandData: Array<Object> = [];
  urls = [];
  htmlUrls = [];
  getcountries: any;
  toggle: any = [];
  selectedCity: string;
  lat: any;
  lng: any;
  getcity: string;

  @ViewChild("singleSelect", { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  @ViewChild("eventCitySearch", { static: true })
  private eventCitySearchElementRef: ElementRef;
  @ViewChild("allSelected", { static: true }) private allSelected: MatCheckbox;

  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceCreateEventComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private fb: FormBuilder,
    private eventService: EventsService,
    private eventimageCompress: NgxImageCompressService,
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _router: Router,
    private datePipe: DatePipe
  ) {
    // Set the defaults
    this.createEventForm = this.createComposeForm();
    this.showExtraToFields = false;
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
    return this.fb.group({
      UserID: new FormControl(""),
      EventType: new FormControl(""),
      OnDemand: new FormControl(""),
      OrganiserName: new FormControl(""),
      InviteCities: new FormControl([]),
      EventName: ["", Validators.required],
      EventDescription: ["", Validators.required],
      Location: new FormControl("", Validators.required),
      EventStartDate: ["", Validators.required],
      EventEndDate: ["", Validators.required],
      EventStartTime: ["", Validators.required],
      EventEndTime: ["", Validators.required],
      BikeModels: [""],
      SaleStartDate: [""],
      SaleEndDate: [""],
      TicketsSegments: this.fb.array([
        this.fb.group({
          TicketClass: ["Basic"],
          Price: ["100"],
          Description: ["basic "]
        })
      ]),
      Images: new FormControl([]),
      CountryID: new FormControl(""),
      Venue: new FormControl(""),
      Longitude: new FormControl(""),
      Latitude: new FormControl(""),
      checked: new FormControl(false),
      isSelected: new FormControl(false)
    });
  }

  // public filteredBikes: ReplaySubject<BikeData[]> = new ReplaySubject<
  //   BikeData[]
  // >(1);
  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.eventCitySearchElementRef.nativeElement,
        {
          types: ["(cities)"]
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result

          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          this.selectedCity = place.name;
          //this.createEventForm.value.InviteCities = place.name;
        });
      });
    });

    this.eventService.getBikesAndModels().subscribe(response => {
      this.bikeBrandModels = response.BikeBrandModels;
      console.log(this.bikeBrandModels);

      this.bikeBrandModels.forEach(bikeBrand => {
        bikeBrand.BikeModels.forEach(bikeModal => {
          bikeModal.BrandID = bikeBrand.BrandID;
        });
      });
      this.bikes = this.bikeBrandModels;
      console.log(this.bikes);
      this.filteredBikes.next(this.bikes.slice());
    });

    // load the initial bank list

    // listen for search field value changes
    this.bikeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
    this.eventService.getCountries().then(data => {
      //this.countries = res;
      this.getcountries = data.Countries;
    });

    this.createEventForm.patchValue({
      EventType: "Paid"
    });
  }

  ngAfterViewInit() {
    //this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  private setInitialValue() {
    this.filteredBikes
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: BikeData, b: BikeData) =>
          a.BrandID === b.BrandID;
      });
  }

  private filterBanks() {
    if (!this.bikes) {
      return;
    }
    // get the search keyword
    let search = this.bikeFilterCtrl.value;
    if (!search) {
      this.filteredBikes.next(this.bikes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBikes.next(
      this.bikes.filter(
        bank => bank.BrandName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  openDialog(targetPath, index) {
    if (targetPath == "venue") {
      if (this.createEventForm.value.Location == undefined) {
        alert("Please Select Locations");
        return;
      }
    }

    const dialogRef = this.dialog.open(EventDialogContentExampleDialog, {
      width: "800px",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);

      if (result != undefined && result != "") {
        if (targetPath == "startLocation") {
          if (navigator.geolocation) {
            var lat = result.latitude;
            var lng = result.longitude;
            let geocoder = new google.maps.Geocoder();
            let latlng = new google.maps.LatLng(lat, lng);
            console.log(latlng);
            // var  geocoder = new google.maps.Geocoder();
            // var lat = result.latitude;
            // var lng = result.longitude;
            //console.log(result.address);
            //console.log(result.latitude);
            // console.log(result.longitude);

            // var latlngs	 = new google.maps.LatLng(lat,lng);

            // var request = { LatLng: latlng};
            geocoder.geocode({ location: { lat: lat, lng: lng } }, function(
              results,
              status
            ) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                  for (var i = 0; i < results.length; i++) {
                    if (results[i].types[0] === "locality") {
                      this.getcity =
                        results[i].address_components[0].short_name;
                      // var state = results[i].address_components[2].short_name;
                      console.log("eventcity" + this.getcity);
                      //$("input[name='location']").val(city + ", " + state);
                    }
                  }
                } else {
                  console.log("No reverse geocode results.");
                }
              } else {
                console.log("Geocoder failed: " + status);
              }
            });

            this.createEventForm.patchValue({
              Location: result.address,
              Latitude: result.latitude,
              Longitude: result.longitude,
              City: this.getcity
            });
          }
        }
        if (targetPath == "venue") {
          this.createEventForm.patchValue({
            Venue: result.address
          });
        }
      }
    });
  }

  radioChange(event) {
    if (!this.isCheck) {
      this.urls = [];
      this.htmlUrls = [];
      this.isCheck = true;
    }
  }

  onChange() {
    if (this.urls.length <= 4) {
      this.eventimageCompress.uploadFile().then(({ image, orientation }) => {
        let isPNG: boolean = image.includes("image/png");
        let isJPEG: boolean = image.includes("image/jpeg");
        if (isPNG || isJPEG) {
          //console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
          if (this.eventimageCompress.byteCount(image) < 300000) {
            let imageSplits = image.split(",");
            //console.log(imageSplits[1]);
            if (imageSplits != undefined && imageSplits[1] != undefined) {
              this.htmlUrls.push(image);
              this.urls.push(imageSplits[1]);
            }
            //console.warn('Size in bytes is now:', this.imageCompress.byteCount(image));
          } else {
            this.eventimageCompress
              .compressFile(image, orientation, 50, 50)
              .then(result => {
                let imageSplits = result.split(",");
                //console.log(imageSplits[1]);
                if (imageSplits != undefined && imageSplits[1] != undefined) {
                  this.htmlUrls.push(result);
                  this.urls.push(imageSplits[1]);
                }
                //console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
              });
          }
          this.isCheck = false;
        } else {
          alert("Please select only png/jpeg file format");
        }
      });
      /* if (event.target.files && event.target.files[0]) {
          var filesAmount = event.target.files.length;
          for (let i = 0; i < filesAmount; i++) {
            //var qual = compressor.compress(event.target.files[i], {quality: .5})
            var reader = new FileReader();
  
            reader.onload = (event: any) => {
  
              let imageSplits = event.target.result.split(',');
              console.log(imageSplits[1]);
              if (imageSplits != undefined && imageSplits[1] != undefined) {
                this.htmlUrls.push(event.target.result);
                this.urls.push(imageSplits[1]);
  
              }
            }
  
            reader.readAsDataURL(event.target.files[i]);
            this.isCheck = false;
          }
        } */
    } else {
      alert("Max files limit is 3 ");
    }
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

    if (this.createEventForm.get("BikeModels").value.length == list.length) {
      this.allSelected.checked = true;
    }
  }

  toggleAllSelection() {
    let bikes: any = this.bikeBrandModels[0];
    if (!this.createEventForm.value.isSelected) {
      var result: any = [];
      this.bikeBrandModels.forEach(function(obj) {
        obj.BikeModels.map(item => result.push(item));
      });

      this.createEventForm.controls.BikeModels.patchValue(result);
    } else {
      this.createEventForm.controls.BikeModels.patchValue([]);
    }
  }

  onSubmit() {
    var StartDate = this.datePipe.transform(
      this.createEventForm.value.EventStartDate,
      "yyyy/MM/dd"
    );
    var EndDate = this.datePipe.transform(
      this.createEventForm.value.EventEndDate,
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

    let starttimes = this.createEventForm.value.EventStartTime.split(":");
    let endtimes = this.createEventForm.value.EventEndTime.split(":");
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
      this.createEventForm.patchValue({
        EventEndDate: undefined
      });
    }
    if (newstartdate < today) {
      alert("StartTime is less than  Current System Time");
      this.createEventForm.patchValue({
        EventStartTime: undefined
      });
    }
    if (newenddate < today) {
      alert("EndTime is less than Current System Time");
      this.createEventForm.patchValue({
        EventEndTime: undefined
      });
    }
    if (this.createEventForm.invalid) {
      alert("Please fill all the details");
    } else {
      this.brandData = [];
      //return;
      if (this.allSelected.checked) {
        this.createEventForm.patchValue({
          BikeModels: ["All"]
        });
      } else {
        if (
          this.createEventForm.value.BikeModels != undefined &&
          this.createEventForm.value.BikeModels.length > 0
        ) {
          this.createEventForm.value.BikeModels.forEach(item => {
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

        this.createEventForm.patchValue({
          BikeModels: this.brandData
        });

        if (
          this.createEventForm.value.BikeModels != undefined &&
          this.createEventForm.value.BikeModels.length > 0
        ) {
          this.createEventForm.value.BikeModels.forEach(function(brand) {
            var strArr = brand.Models.map(function(e) {
              return e.toString();
            });
            brand.Models = strArr;
          });
        }
      }
      console.log(this.createEventForm.value.BikeModels);
      if (this.isCheck) {
        this.createEventForm.value.Images = [];
      } else {
        this.createEventForm.value.Images = this.urls;
      }

      if (this.createEventForm.value.checked == true) {
        this.createEventForm.value.OnDemand = 1;
      } else {
        this.createEventForm.value.OnDemand = 0;
      }

      this.createEventForm.value.EventStartDate = this.datePipe.transform(
        this.createEventForm.value.EventStartDate,
        "yyyy-MM-dd"
      );
      this.createEventForm.value.EventEndDate = this.datePipe.transform(
        this.createEventForm.value.EventEndDate,
        "yyyy-MM-dd"
      );
      if (this.createEventForm.value.EventType == "Free") {
        this.createEventForm.value.TicketsSegments[0] = {
          TicketClass: "Free",
          Price: "0",
          Description: "Free "
        };
      }
      this.createEventForm.value.InviteCities = [this.selectedCity];
      this.createEventForm.value.UserID = localStorage.getItem("AdminUserID");
      this.createEventForm.value.City = localStorage.getItem("EventCity");
      console.log(this.createEventForm.value);
      let Eventlocation = this.createEventForm.value.Location;
      console.log(Eventlocation);
      localStorage.setItem("eventlocation", JSON.stringify(Eventlocation));

      this.eventService.createEvent(this.createEventForm.value).then(data => {
        if (data.Status == 1) {
          alert("Event created successfully");
          this._router.navigate(["apps/e-commerce/events"]);
        } else alert(data.Message);
      });
    }
  }
  onChangeToggle(value) {
    if (value.checked === true) {
      this.createEventForm.value.OnDemand = 1;

      console.log(1);
    } else {
      this.createEventForm.value.OnDemand = 0;
      console.log(0);
    }
  }
  addNewTicketSegment(control) {
    control.push(
      this.fb.group({
        TicketClass: [""],
        Price: [""],
        Description: [""]
      })
    );
  }
}
