import {
  Component,
  Inject,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { EcommerceBikeUserPostedService } from "app/main/apps/e-commerce/bike-request/bike-request.service";
import { Subject } from "rxjs";

@Component({
  selector: "view-bike",
  templateUrl: "./view-bike.component.html",
  styleUrls: ["./view-bike.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ViewBikeComponent {
  showExtraToFields: boolean;
  composeForm: FormGroup;
  fromPage: any;
  refresh: Subject<any> = new Subject();
  @ViewChild("matCarouselSlide", { static: true }) imgEl: ElementRef;

  /**
   * Constructor
   *
   * @param {MatDialogRef<ViewBikeComponent>} matDialogRef
   * @param _data
   */
  constructor(
    public matDialogRef: MatDialogRef<ViewBikeComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _ecommerceBikeUserPostedService: EcommerceBikeUserPostedService,
    private _router: Router
  ) {
    // Set the defaults
    this.composeForm = this.createComposeForm();
    this.showExtraToFields = false;
    this.fromPage = _data.pagerequestValue;
    console.log(this.fromPage.ImageURLs);
    console.log(this.fromPage);
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
      to: new FormControl(""),
      cc: new FormControl(""),
      bcc: new FormControl(""),
      subject: new FormControl(""),
      message: new FormControl("")
    });
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  onImgError(event) {
    event.target.src = "assets/images/profile/default-avatar.png";
  }
  OnAcceptBike(element) {
    let data = element;
    console.log(data);
    var bikeJson = {
      Status: 1
    };
    this._ecommerceBikeUserPostedService
      .AcceptUserBike(data, bikeJson)
      .then(data => {
        if (data.Status == 1) {
          alert("UserPosted Bike Accepeted successfully");
          this._router.navigate(["apps/e-commerce/user-posted"]);
          this.matDialogRef.close();
        } else alert(data.Message);
      });
  }
  OnRejectBike(element) {
    let data = element;
    console.log(data);
    var bikerejectJson = {
      Status: 0
    };
    this._ecommerceBikeUserPostedService
      .RejectUserBike(data, bikerejectJson)
      .then(data => {
        if (data.Status == 1) {
          alert("UserPosted Bike Rejected successfully");
          this._router.navigate(["apps/e-commerce/user-posted"]);
          // this.refresh.next(true);
          this.matDialogRef.close();
        } else alert(data.Message);
      });
  }
}
