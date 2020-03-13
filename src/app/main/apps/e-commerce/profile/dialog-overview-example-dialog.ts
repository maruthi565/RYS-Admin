import {
  Component,
  Inject,
  ViewChildren,
  ChangeDetectorRef,
  QueryList,
  ViewChild,
  ElementRef
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import {
  MatCarouselSlideComponent,
  MatCarouselSlide,
  MatCarousel,
  MatCarouselComponent
} from "@ngmodule/material-carousel";
import { EcommerceUserProfileService } from "./profile.service";
import { Subject } from "rxjs";

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "dialog-overview-example-dialog.html"
})
export class DialogOverviewExampleDialog {
  fromPage: any[];
  show = false;
  showVar: boolean = true;
  showAcceptReject: any;
  hideAcceptBtns: boolean;
  fromDetails: any;
  bikedocumentJson: any;
  hideBtns: boolean;
  fromProfile: any;
  dialogRefresh: Subject<any> = new Subject();
  bikedocumentrejectJson: any;

  @ViewChild("matCarouselSlide", { static: true }) imgEl: ElementRef;

  constructor(
    private _profileService: EcommerceUserProfileService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    //   this.dialogRefresh.subscribe(updateDB => {
    //     if (updateDB) {
    //         this._userProfileService.getUserProfiles(this.selectedUserDetails.UserID)
    // .then(data => {
    //    this.getuserprofile = data.Bikes;

    // });
    //     }
    // });

    this.fromPage = this.data.pageValue;

    this.fromDetails = this.data.pageDetails;
    console.log(this.fromDetails);
    this.fromProfile = this.data.pageProfile;
    console.log(this.fromProfile);

    console.log(this.fromProfile);
    if (this.fromDetails == "PUC" || this.fromDetails == "Insurance") {
      this.hideBtns = false;
    } else {
      this.hideBtns = true;
    }
    if (this.fromDetails == "Aadharcard") {
      var idcard = this.fromProfile.IsIDCardvalid;
      console.log(idcard);
      if (idcard == null) {
        this.hideAcceptBtns = true;
      }
      if (idcard == 2) {
        this.hideAcceptBtns = true;
      }
      if (idcard == 1) {
        this.hideAcceptBtns = false;
      }
    }
    if (this.fromDetails == "Driving License") {
      var license = this.fromProfile.IsBikeLicencevalid;
      console.log(license);
      if (license == null) {
        this.hideAcceptBtns = true;
      }
      if (license == 2) {
        this.hideAcceptBtns = true;
      }
      if (license == 1) {
        this.hideAcceptBtns = false;
      }
    }
    if (this.fromDetails == "RC") {
      var rc = this.fromProfile.IsRCvalid;
      console.log(rc);
      if (rc == null) {
        this.hideAcceptBtns = true;
      }
      if (rc == 2) {
        this.hideAcceptBtns = true;
      }
      if (rc == 1) {
        this.hideAcceptBtns = false;
      }
    }
    // else {
    //   console.log("not");
    // }

    console.log(this.fromDetails);
    console.log(this.fromPage);
    console.log(localStorage.getItem("BikeID"));

    //this.showAcceptReject = JSON.parse(localStorage.getItem("BikeDetails")) ;
    //  if(this.fromProfile.IsIDCardvalid == 1 ) {
    //    this.hideAcceptBtns = false;
    //  }

    //  if(this.fromProfile.IsBikeLicencevalid == 1 ){
    //   this.hideAcceptBtns = false;
    //  }
    //   if(this.fromProfile.IsRCvalid == 1) {
    //     this.hideAcceptBtns = false;
    //   }

    //  if(this.fromProfile.IsIDCardvalid === null || this.fromProfile.IsIDCardvalid == 2 ){
    //    this.hideAcceptBtns = true;
    //  }
    //  if(this.fromProfile.IsBikeLicencevalid === null || this.fromProfile.IsBikeLicencevalid == 2) {
    //    this.hideAcceptBtns = true;
    //  }
    //  if( this.fromProfile.IsRCvalid === null || this.fromProfile.IsRCvalid == 2){
    //   this.hideAcceptBtns = true;
    // }
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  function() {
    if (this.fromDetails == "PUC" || this.fromDetails == "Insurance") {
      this.hideBtns = false;
    } else {
      this.hideBtns = true;
    }
    if (this.fromDetails == "Aadharcard") {
      var idcard = this.fromProfile.IsIDCardvalid;
      console.log(idcard);
      if (idcard == null) {
        this.hideAcceptBtns = true;
      }
      if (idcard == 2) {
        this.hideAcceptBtns = true;
      }
      if (idcard == 1) {
        this.hideAcceptBtns = false;
      }
    }
    if (this.fromDetails == "Driving License") {
      var license = this.fromProfile.IsBikeLicencevalid;
      console.log(license);
      if (license == null) {
        this.hideAcceptBtns = true;
      }
      if (license == 2) {
        this.hideAcceptBtns = true;
      }
      if (license == 1) {
        this.hideAcceptBtns = false;
      }
    }
    if (this.fromDetails == "RC") {
      var rc = this.fromProfile.IsRCvalid;
      console.log(rc);
      if (rc == null) {
        this.hideAcceptBtns = true;
      }
      if (rc == 2) {
        this.hideAcceptBtns = true;
      }
      if (rc == 1) {
        this.hideAcceptBtns = false;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  accept() {
    this.show == true;
  }

  toggleChild() {
    this.showVar = !this.showVar;
  }
  OnAcceptBikeDocument() {
    if (this.fromDetails == "Driving License") {
      this.bikedocumentJson = {
        IsBikeLicencevalid: 1
      };
      let verifiedDL = 1;
      localStorage.setItem("VerifiedDL", JSON.stringify(verifiedDL));
    }
    if (this.fromDetails == "RC") {
      this.bikedocumentJson = {
        IsRCvalid: 1
      };
      let verifiedRC = 1;
      localStorage.setItem("VerifiedRC", JSON.stringify(verifiedRC));
    }
    if (this.fromDetails == "Aadharcard") {
      this.bikedocumentJson = {
        IsIDCardvalid: 1
      };
    }

    this._profileService
      .AcceptUserBikeDocument(this.bikedocumentJson)
      .then(data => {
        if (data.Status == 1) {
          alert("User Bike Accepeted successfully");
          this.dialogRef.close(true);
          //this.refreshData.next(true);
          //this._router.navigate(['apps/e-commerce/user-posted']);
        } else alert(data.Message);
      });
  }
  OnRejectBikeDocument() {
    if (this.fromDetails == "Driving License") {
      this.bikedocumentrejectJson = {
        IsBikeLicencevalid: 0
      };
    }
    if (this.fromDetails == "RC") {
      this.bikedocumentrejectJson = {
        IsRCvalid: 0
      };
    }
    if (this.fromDetails == "Aadharcard") {
      this.bikedocumentrejectJson = {
        IsIDCardvalid: 0
      };
    }

    this._profileService
      .RejectUserBikeDocument(this.bikedocumentrejectJson)
      .then(data => {
        if (data.Status == 1) {
          alert("User Bike Rejected successfully");
          this.dialogRef.close(true);
          // this._router.navigate(['apps/e-commerce/user-posted']);
          //this.requestrefresh.next(true);
        } else alert(data.Message);
      });
  }
}
