import {
  Component,
  Inject,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { EcommerceViewEventsService } from "./view-event.service";

import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "converteventFrom24To12Format" })
export class EventTimeFormat implements PipeTransform {
  transform(time: any): any {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    let part = hour > 12 ? "pm" : "am";
    min = (min + "").length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + "").length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  }
}
@Component({
  selector: "e-commerce-view-event",
  templateUrl: "./view-event.component.html",
  styleUrls: ["./view-event.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceViewEventComponent {
  showExtraToFields: boolean;
  addCouponForm: FormGroup;
  isChecked = true;
  Checked = true;
  isCheck = true;
  selectedEventDetails: any;
  slides: any;
  ticketSegments: any;
  getCoparticipants: any;
  participantsCount: number;
  admin: any;
  travelkms: any;

  @ViewChild("matCarouselSlide", { static: true }) imgEl: ElementRef;
  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceViewEventComponent>} matDialogRef
   * @param _data
   */
  constructor(private _vieweventService: EcommerceViewEventsService) {
    // Set the defaults
    this.addCouponForm = this.createComposeForm();
    this.showExtraToFields = false;
  }
  ngOnInit() {
    this.selectedEventDetails = JSON.parse(
      localStorage.getItem("selectedEventRow")
    );
    console.log(this.selectedEventDetails);
    this.slides = this.selectedEventDetails.Images;
    console.log(this.slides.length);
    this.ticketSegments = this.selectedEventDetails.TicketFareDetails;
    console.log(this.ticketSegments);

    this._vieweventService
      .getCoParticipants(this.selectedEventDetails.EventID)
      .then(data => {
        this.getCoparticipants = data.Users;
        this.participantsCount = data.ParticipantsCount;
        console.log(this.getCoparticipants);
        let distancetravel = this.getCoparticipants[0].DistanceTravel;
        // var hours = data.UserReports[0].TotalRidingHours;
        this.travelkms = Math.trunc(distancetravel);
        console.log(this.travelkms);
      });
    this.admin = JSON.parse(localStorage.getItem("AdminLoginDetails"));
    //console.log(admin);
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
      name: new FormControl(""),
      description: new FormControl(""),
      location: new FormControl(""),
      venue: new FormControl(""),
      city: new FormControl(""),
      invite: new FormControl(""),
      premium: new FormControl(""),
      price: new FormControl(""),
      descrip: new FormControl("")
    });
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
}
