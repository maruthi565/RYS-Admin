import {
  Component,
  Inject,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Input,
  ViewChildren,
  QueryList
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { EcommerceUserProfileService } from "./profile.service";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DialogOverviewExampleDialog } from "./dialog-overview-example-dialog";

export interface PeriodicElement {
  year: number;
  month: string;
  date: string;
  plan: string;
  amount: string;
  validity: string;
}

@Component({
  selector: "e-commerce-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceProfileComponent {
  displayedColumns: string[] = [
    "year",
    "month",
    "date",
    "plan",
    "amount",
    "validity"
  ];
  // dataSource :any;
  dataSource: MatTableDataSource<any>;
  private _unsubscribeAll: Subject<any>;
  profileData: any[];
  selectedUserDetails: any;
  getuserbikes: any;
  getuserpurchases: any;
  getuserads: any[];
  getuserprofile: any = [];
  isShow: boolean;
  profile: any[];
  dialogRef: any;
  dialogValue: any[];
  show = false;
  showTickBtn = false;
  isAccepted = false;
  // hideViewButton  : boolean;
  bikesRefresh: Subject<any> = new Subject();

  @ViewChild("matCarouselSlide", { static: true }) imgEl: ElementRef;

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  @Input() showMePartially: boolean;

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    // this._userProfileService.onProfileChanged
    // .pipe(takeUntil(this._unsubscribeAll))
    // .subscribe(userprofile => {

    //   if (userprofile.Status == 1) {
    //     this.profileData = userprofile.UserProfile;
    //   }

    // });

    this.bikesRefresh.subscribe(updateDB => {
      if (updateDB) {
        this._userProfileService
          .getUserProfiles(this.selectedUserDetails.UserID)
          .then(data => {
            this.getuserprofile = data.Bikes;
            if (this.isAccepted == true) {
              this.getuserprofile.forEach(item => {
                item.isShow = true;
              });
            }
          });
      }
    });

    //  if(localStorage.getItem('fromUserMenu') == 'User'){
    this.selectedUserDetails = JSON.parse(
      localStorage.getItem("selectedUserRow")
    );
    console.log(this.selectedUserDetails);
    //  }
    //   else if(localStorage.getItem('fromUserMenu') == 'Ride'){
    //api call
    //    this.selectedUserDetails = '';

    // }
    this._userProfileService
      .getUserProfiles(this.selectedUserDetails.UserID)
      .then(data => {
        this.getuserprofile = data.Bikes;
        console.log(this.getuserprofile);
      });

    this._userProfileService
      .getUserBikes(this.selectedUserDetails.UserID)
      .then(data => {
        this.getuserbikes = data.UserpostedBikes;
        console.log(this.getuserbikes);
      });
    this._userProfileService
      .getUserAds(this.selectedUserDetails.UserID)
      .then(data => {
        this.getuserads = data.Users;
      });
    this._userProfileService
      .getUserSubscriptionDetails(this.selectedUserDetails.UserID)
      .then(data => {
        this.getuserpurchases = data.SubscriptionPurchaseDetails;
        this.dataSource.data = this.getuserpurchases;
        // this.reportData = data.UserReports
        //   this.dataSource.data =this.reportData;
        console.log(this.getuserpurchases);
      });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
  }
  constructor(
    public _userProfileService: EcommerceUserProfileService,
    private _router: Router,
    public dialog: MatDialog
  ) {
    // Set the defaults
    this._unsubscribeAll = new Subject();
    this.showExtraToFields = false;
    //this.dataSource= new MatTableDataSource(this.getuserpurchases);
    this.dataSource = new MatTableDataSource();
  }
  showExtraToFields: boolean;
  addCouponForm: FormGroup;

  /*
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  onImgError(event) {
    event.target.src = "assets/images/profile/default-avatar.png";
  }
  ToggleDetails() {
    this.isShow = !this.isShow;
  }
  getBikeID(profile) {
    console.log(profile);
    localStorage.setItem("BikeID", JSON.stringify(profile.BikeID));
    localStorage.setItem("BikeDetails", JSON.stringify(profile));
    // console.log(this.getuserprofile);
    //  if(profile.IsIDCardvalid == 1){
    //     this.showTickBtn = true;
    // }
    // if(profile.IsIDCardvalid == null){
    //     this.showTickBtn = false;
    // }
    // if(profile.IsIDCardvalid == 2) {
    //     this.showTickBtn =false;
    // }
    // if(profile.IsBikeLicencevalid == 1) {
    //     this.showTickBtn = true;
    // }
    // if(profile.IsBikeLicencevalid == null){
    //     this.showTickBtn = false;
    // }
    // if(profile.IsBikeLicencevalid == 2) {
    //     this.showTickBtn =false;
    // }
    // if(profile.IsRCvalid == 1) {
    //     this.showTickBtn = true;
    // }
    // if(profile.IsRCvalid == null){
    //     this.showTickBtn = false;

    // }
    // if(profile.IsRCvalid == 2){
    //     this.showTickBtn = false;
    // }
  }
  openDialog(profile, text, fullprofile): void {
    this.dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "800px",
      data: {
        pageValue: profile,
        pageDetails: text,
        pageProfile: fullprofile
      }
    });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.isAccepted = true;
        this.bikesRefresh.next(true);
      }
      if (!response) {
        return;
      }
    });
  }
}
