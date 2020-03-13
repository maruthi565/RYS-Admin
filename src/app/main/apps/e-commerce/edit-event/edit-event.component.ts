import {
  Component,
  Inject,
  ViewEncapsulation,
  NgZone,
  ElementRef,
  ViewChild
} from "@angular/core";
import { FormControl, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { EventDialogContentExampleDialog } from "../create-event/dialog-content-event-example-dialog";
import { MapsAPILoader } from "@agm/core";
import { EcommerceEditEventService } from "./edit-event.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";

@Component({
  selector: "e-commerce-edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrls: ["./edit-event.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceEditEventComponent {
  showExtraToFields: boolean;
  editEventForm: FormGroup;
  isChecked = true;
  Checked = true;
  isCheck = true;
  htmlUrls = [];
  getcountries: any[];
  selected: Array<Object> = [];
  bikeBrandModels: any[];
  selectedCity: string;
  isDisabled = true;
  private _unsubscribeAll: Subject<any>;

  tickets = {
    TicketFareDetails: [
      {
        TicketClass: "",
        Description: "",
        Price: ""
      }
    ]
  };
  @ViewChild("eventCitySearch", { static: true })
  private eventCitySearchElementRef: ElementRef;

  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceEditEventComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _editEventService: EcommerceEditEventService,
    private _router: Router,
    private datePipe: DatePipe
  ) {
    this._unsubscribeAll = new Subject();
    // Set the defaults
    this.editEventForm = this.createComposeForm();
    this.showExtraToFields = false;
  }

  ngOnInit() {
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

    // this.eventService.getBikesAndModels()
    //     .subscribe(response => {
    //         this.bikeBrandModels = response.BikeBrandModels;
    //         this.bikeBrandModels.forEach(bikeBrand => {
    //             bikeBrand.BikeModels.forEach(bikeModal => {
    //               bikeModal.BrandID = bikeBrand.BrandID;
    //             });
    //           });

    //     });

    this._editEventService.getCountries().then(data => {
      //this.countries = res;
      this.getcountries = data.Countries;
    });

    this._editEventService.onEditEventChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(editbikeBrandModels => {
        if (editbikeBrandModels.Status == 1) {
          this.bikeBrandModels = editbikeBrandModels.BikeBrandModels;

          this.bikeBrandModels.forEach(bikeBrand => {
            bikeBrand.BikeModels.forEach(bikeModal => {
              bikeModal.BrandID = bikeBrand.BrandID;
            });
          });
        }
      });

    this.editEventForm.patchValue({
      EventType: "Paid"
    });
    let selectedEvent = JSON.parse(localStorage.getItem("editEventRow"));
    for (var i = 1; i < selectedEvent.TicketFareDetails.length; i++) {
      console.log(selectedEvent.TicketFareDetails.length);
      this.setTicketSegments();
    }
    this.editEventForm.patchValue(
      JSON.parse(localStorage.getItem("editEventRow"))
    );
    // this.editEventForm.value.Location.patchValue(
    //   JSON.parse(localStorage.getItem("eventlocation"))
    // );
    this.editEventForm.patchValue({
      Location: JSON.parse(localStorage.getItem("eventlocation"))
    });
    console.log(JSON.parse(localStorage.getItem("editEventRow")));

    if (this.editEventForm.value.OnDemand === 1) {
      this.editEventForm.patchValue({
        checked: true
      });
    }
    this.htmlUrls = selectedEvent.Images;
    //console.log(this.htmlUrls);
    var self = this;
    self.selected = [];
    this.bikeBrandModels.forEach(function(bikeBrand) {
      selectedEvent.BikeModels.forEach(function(brand) {
        brand.Models.forEach(function(model) {
          var bike = bikeBrand.BikeModels.filter(
            item => item.BikeModelID == Number(model)
          )[0];
          if (bike != undefined) {
            self.selected.push(bike);
          }
        });
      });
    });
  }
  /**
   * Create compose form
   *
   * @returns {FormGroup}
   */
  createComposeForm(): FormGroup {
    return this.fb.group({
      EventID: new FormControl(""),
      UserID: new FormControl(""),
      EventType: new FormControl({ value: "", disabled: true }),
      OnDemand: new FormControl(""),
      InviteCities: new FormControl([]),
      EventName: new FormControl(""),
      EventDescription: [""],
      Location: new FormControl(""),
      EventStartDate: [""],
      EventEndDate: [""],
      EventStartTime: [""],
      EventEndTime: [""],
      BikeModels: new FormControl(),
      SaleStartDate: [""],
      SaleEndDate: [""],
      TicketFareDetails: this.fb.array([
        this.fb.group({
          TicketClass: [""],
          Price: [""],
          Description: [""]
        })
      ]),
      // TicketsSegments: this.fb.array([]),
      // Images: new FormControl([]),
      CountryID: new FormControl(""),
      Venue: new FormControl(""),
      Longitude: new FormControl(""),
      Latitude: new FormControl(""),
      checked: new FormControl(false)
    });
  }

  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  openDialog(targetPath, index) {
    if (targetPath == "venue") {
      if (this.editEventForm.value.Location == undefined) {
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
          this.editEventForm.patchValue({
            Location: result.address,
            Latitude: result.latitude,
            Longitude: result.longitude
          });
        }
        if (targetPath == "venue") {
          this.editEventForm.patchValue({
            Venue: result.address
          });
        }
      }
    });
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
  setTicketSegments() {
    let control = <FormArray>this.editEventForm.controls.TicketFareDetails;
    this.tickets.TicketFareDetails.forEach(x => {
      control.push(
        this.fb.group({
          TicketClass: x.TicketClass,
          Description: x.Description,
          Price: x.Price
        })
      );
      control.disable();
    });
  }

  onEditEvent() {
    this.editEventForm.value.UserID = Number(
      localStorage.getItem("AdminUserID")
    );
    //this.editEventForm.value.CreatedBy = Number(localStorage.getItem('AdminUserID'));

    this.editEventForm.removeControl("BikeModels");
    this.editEventForm.removeControl("Images");
    this.editEventForm.removeControl("EventType");
    // this.editEventForm.removeControl('TicketsSegments');
    this.editEventForm.value.EventStartDate = this.datePipe.transform(
      this.editEventForm.value.EventStartDate,
      "yyyy-MM-dd"
    );
    this.editEventForm.value.EventEndDate = this.datePipe.transform(
      this.editEventForm.value.EventEndDate,
      "yyyy-MM-dd"
    );

    if (this.editEventForm.value.checked == true) {
      this.editEventForm.value.OnDemand = 1;
    } else {
      this.editEventForm.value.OnDemand = 0;
    }

    this._editEventService.editEvent(this.editEventForm.value).then(data => {
      // Show the success message
      if (data.Status == 1) {
        //let result = data.VendorDetails;
        alert("Event updated successfully");
        this._router.navigate(["/apps/e-commerce/events/"]);
      } else alert(data.Message);
    });
  }
}
