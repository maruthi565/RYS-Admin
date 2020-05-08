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
import { EcommerceViewRideService } from "./view-ride.service";
import { map } from "rxjs/operators";
import { DatePipe } from "@angular/common";
declare var EXIF: any;

import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "convertFrom24To12Format" })
export class TimeFormat implements PipeTransform {
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
  selector: "e-commerce-view-ride",
  templateUrl: "./view-ride.component.html",
  styleUrls: ["./view-ride.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceViewRideComponent {
  showExtraToFields: boolean;
  isChecked = true;
  Checked = true;
  isCheck = true;
  selectedRideDetails: any;
  StartTime: any;
  EndTime: any;
  public slides;
  public rideFeeBreakup;
  getcoriders: any;
  new: any;
  ridersCount: number;

  @ViewChild("matCarouselSlide", { static: true }) imgEl: ElementRef;

  output: string;

  // private getExif() {
  //     let allMetaData: any;
  //     EXIF.getData(<HTMLImageElement>this.imgEl.nativeElement, function () {

  //       allMetaData = EXIF.getAllTags(this);
  //     });

  //     this.output = allMetaData;
  //   }
  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceViewRideComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private viewrideService: EcommerceViewRideService,
    private datePipe: DatePipe
  ) {
    this.showExtraToFields = false;
  }
  ngOnInit() {
    this.selectedRideDetails = JSON.parse(
      localStorage.getItem("selectedRideRow")
    );
    console.log(this.selectedRideDetails.StartTime);

    this.viewrideService
      .getCoRiders(this.selectedRideDetails.RideID)
      .then(data => {
        this.getcoriders = data.Users;
        console.log(this.getcoriders);
      });

    // this.StartTime = this.selectedRideDetails.StartTime = this.datePipe.transform(this.selectedRideDetails.StartTime, 'HH:mm');
    // var H = +this.StartTime.substr(0, 2);
    // var h = (H % 12) || 12;
    // var ampm = H < 12 ? "AM" : "PM";
    //this.StartTime = h + ":" + this.StartTime.substr(2, 3) + ampm;

    // this.EndTime = this.selectedRideDetails.EndTime = this.datePipe.transform(this.selectedRideDetails.EndTime, 'HH:mm');
    // var H = +this.EndTime.substr(0, 2);
    // var h = (H % 12) || 12;
    // var ampm = H < 12 ? "AM" : "PM";
    //this.EndTime = h + ":" + this.EndTime.substr(2, 3) + ampm;

    // this.slides =[
    //     "assets/images/cards/rideview.png" ,
    //      "assets/images/backgrounds/rider.jpeg" ,
    //     "assets/images/backgrounds/event.jpeg" ,
    // ];
    this.slides = this.selectedRideDetails.Images;
    //this.slides = this.selectedRideDetails.ProfilePic;
    console.log(this.slides);
    this.rideFeeBreakup = this.selectedRideDetails.Price;
    this.ridersCount = this.selectedRideDetails.RidersCount;
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
}
