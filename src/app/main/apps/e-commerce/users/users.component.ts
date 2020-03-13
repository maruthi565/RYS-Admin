import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  NgZone
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { FuseUtils } from "@fuse/utils";

import { takeUntil } from "rxjs/internal/operators";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { RequestDialogComponent } from "../request-dialog/request-dialog.component";
import { AddLeaderMessageTypeComponent } from "../../mail/dialogs/add-leader-message-type/add-leader-message-type.component";
import { FormGroup } from "@angular/forms";
import { LeaderboardComponent } from "../../mail/dialogs/leaderboard/leaderboard.component";
import { UsersService } from "app/main/apps/e-commerce/users/users.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";
import { EcommerceUserPostedService } from "../user-posted/user-posted.service";
import { MapsAPILoader } from "@agm/core";
import { RejectSendMessageDialog } from "../../mail/dialogs/reject-send-message/reject-send-message.component";

export interface PeriodicElement {
  id: number;
  name: string;
  followers: number;
  city: string;
  bikes: string;
  ratings: number;
  rides: number;
  kms: number;
  subscripion: number;
  leaderboard: string;
  profile: string;
}
export interface Request {
  value: string;
  Name: string;
}

export interface User {
  value: string;
  Name: string;
}
@Component({
  selector: "e-commerce-users-coupons",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceUsersComponent implements OnInit {
  //dataSource: FilesDataSource | null;
  dataSource: MatTableDataSource<any>;
  displayedColumns = [
    "select",
    "id",
    "name",
    "followers",
    "city",
    "bikes",
    "ratings",
    "rides",
    "kms",
    "subscription",
    "leaderboard",
    "profile"
  ];
  selection = new SelectionModel<PeriodicElement>(true, []);
  isChecked = true;
  ranks: any;
  userid: any;
  usersData: any[];
  requestValue: string;
  selectedRequest: string;
  hideLedaderboard = true;
  searchTerm: string;
  selectedBrand: string;
  bikeBrands: any;
  selectedCity: string;
  selectedUser: string;
  Leaderboard: any;
  showColumn = true;
  infoboxesNew: any;
  boxescount: any;
  selectedcountBrand: any;
  showCountBox: boolean;

  AllRequests: Request[] = [
    { value: "request", Name: "Select" },
    { value: "Approve", Name: "Approve Requests" },
    { value: "Pending", Name: "Pending Profiles" }
  ];

  AllUsers: User[] = [
    { value: "user", Name: "Select" },
    // { value: 'NotSubscribed', Name: 'Registered Users' },
    { value: "Subscribed", Name: "Subscribed Users" }
  ];

  @ViewChild("userCitySearch", { static: true })
  private userCitySearchElementRef: ElementRef;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  // @ViewChild(MatPaginator, { static: true })
  // paginator: MatPaginator;

  // @ViewChild(MatSort, { static: true })
  // sort: MatSort;

  @ViewChild("filter", { static: true })
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;
  dialogRef: any;
  usersRefresh: Subject<any> = new Subject();

  constructor(
    private _usersService: UsersService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private _userpostedService: EcommerceUserPostedService,
    private _router: Router
  ) {
    this.dataSource = new MatTableDataSource();
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._usersService.getInfoBoxes("users-infoboxes").then(data => {
      this.infoboxesNew = data;
      this.showCountBox = true;
      console.log(this.infoboxesNew);
    });

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.userCitySearchElementRef.nativeElement,
        {
          types: ["(cities)"]
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result

          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          this.selectedCity = place.name;
          this.citySelectionChange(this.selectedCity);
        });
      });
    });
    this.usersRefresh.subscribe(updateDB => {
      if (updateDB) {
        this._usersService.getUsers("usersfilter").then(data => {
          this.usersData = data.Users;
          //console.log(this.usersData);
          if (this.Leaderboard == 0) {
            this.Leaderboard.checked = true;
          }
          this.dataSource.data = this.usersData;
          //console.log(this.usersData);
        });
      }
    });

    this._usersService.getUsers("usersfilter").then(data => {
      this.usersData = data.Users;
      console.log(this.usersData);
      if (this.Leaderboard == 0) {
        this.Leaderboard.checked = true;
      }

      this.dataSource.data = this.usersData;
    });
    this._userpostedService.getBikeBrands().then(data => {
      this.bikeBrands = data.BikeBrands;
    });

    // let VerifiedLicense = JSON.parse(localStorage.getItem("VerifiedDL"));
    // let VeriifedRC = JSON.parse(localStorage.getItem("VerifiedRC"));
    // if (VerifiedLicense == 1 && VeriifedRC == 1) {
    //   alert("show");
    // }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
  }

  getValue(value) {
    console.log(value);
    this.requestValue = value;
  }

  filterUsersByName(event): void {
    if (this.searchTerm == undefined || this.searchTerm.length < 4) {
      //return;
      var url = "usersfilter?QueryString=" + this.searchTerm;
      this._usersService.getUsers(url).then(data => {
        this.dataSource.data = data.Users;
        console.log(this.dataSource.data);
      });
    }

    if (this.searchTerm == "" || this.searchTerm.length == 0) {
      this._usersService.getUsers("usersfilter").then(data => {
        this.usersData = data.Users;
        this.dataSource.data = this.usersData;
      });
    }
  }
  exportToExcel() {
    var selectedRows = this.selection.selected;
    console.log(selectedRows);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedRows);
    //const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    //const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, `Users_export_${new Date().getTime()}.xlsx`);

    if (this.selectedRequest == "Approve") {
      var selectedRows = this.selection.selected;
      console.log(selectedRows);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedRows);
      //const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      //const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(
        wb,
        `Users_Approve_Requests_export_${new Date().getTime()}.xlsx`
      );
    }
  }
  countbrandSelectionChange(event) {
    var url = "";
    if (this.selectedcountBrand != undefined) {
      url = url + this.selectedcountBrand;
    }
    this._usersService.getBikeBrandInfoBoxes(url).then(data => {
      this.boxescount = data.Users_by_Bike_Brand;
      console.log(this.boxescount);
    });
    // this._usersService.getInfoBoxes(url)
    // .then(data => {
    //     this.infoboxescount = data;
    // });
  }
  brandSelectionChange(event) {
    var url = "";
    if (this.selectedBrand != undefined) {
      url = "usersfilter?BrandID=" + this.selectedBrand;
    }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      url = url + "&City=" + this.selectedCity;
    }
    // if(this.selectedRequest != undefined && this.selectedRequest != ''){
    //     url = url + "&UserStatus="+ this.selectedRequest;
    // }

    if (this.selectedRequest == "Pending") {
      this.displayedColumns = [
        "select",
        "id",
        "name",
        "followers",
        "city",
        "bikes",
        "ratings",
        "rides",
        "kms",
        "subscription",
        "profile"
      ];
      this.showColumn = false;
      if (
        this.selectedRequest != undefined &&
        this.selectedRequest == "Pending"
      ) {
        if (url == undefined || url == "") {
          // url = "usersfilter?UserStatus=" + this.selectedRequest;
          url = "usersfilter?UserStatus=" + this.selectedRequest;
        } else {
          url = url + "&UserStatus=" + this.selectedRequest;
        }
      }
    } else if (
      this.selectedRequest != undefined &&
      this.selectedRequest != ""
    ) {
      this.displayedColumns = [
        "select",
        "id",
        "name",
        "followers",
        "city",
        "bikes",
        "ratings",
        "rides",
        "kms",
        "subscription",
        "profile"
      ];
      this.showColumn = false;
      if (url == undefined || url == "") {
        // url = "usersfilter?UserStatus=" + this.selectedRequest;
        url = "usersfilter?UserStatus=6";
      } else {
        url = url + "&UserStatus=6";
      }
    }

    if (this.selectedUser != undefined && this.selectedUser != "") {
      url = url + "&SubStatus=" + this.selectedUser;
    }
    // if(this.selectedDate != undefined && this.selectedDate != '' ){
    //     url = url  + "&Date="+ this.selectedDate
    // }

    this._usersService.getUsers(url).then(data => {
      this.dataSource.data = data.Users;
    });
  }
  citySelectionChange(event) {
    var url = "";

    if (this.selectedBrand != undefined && this.selectedBrand != "") {
      if (url == undefined || url == "") {
        url = "usersfilter?BrandID=" + this.selectedBrand;
      } else {
        url = url + "&BrandID=" + this.selectedBrand;
      }
    }

    if (this.selectedCity != undefined && this.selectedCity != "") {
      if (url == undefined || url == "") {
        url = "usersfilter?City=" + this.selectedCity;
      } else {
        url = url + "&City=" + this.selectedCity;
      }
    }
    // if (this.selectedRequest != undefined && this.selectedRequest != '' ) {
    //     if(url == undefined || url ==''){
    //     url = "usersfilter?UserStatus=" + this.selectedRequest;
    //     }
    //     else {
    //         url =  url +  "&UserStatus=" + this.selectedRequest;
    //     }
    // }

    if (this.selectedRequest == "Pending") {
      this.displayedColumns = [
        "select",
        "id",
        "name",
        "followers",
        "city",
        "bikes",
        "ratings",
        "rides",
        "kms",
        "subscription",
        "profile"
      ];
      this.showColumn = false;
      if (
        this.selectedRequest != undefined &&
        this.selectedRequest == "Pending"
      ) {
        if (url == undefined || url == "") {
          // url = "usersfilter?UserStatus=" + this.selectedRequest;
          url = "usersfilter?UserStatus=" + this.selectedRequest;
        } else {
          url = url + "&UserStatus=" + this.selectedRequest;
        }
      }
    } else if (
      this.selectedRequest != undefined &&
      this.selectedRequest != ""
    ) {
      this.displayedColumns = [
        "select",
        "id",
        "name",
        "followers",
        "city",
        "bikes",
        "ratings",
        "rides",
        "kms",
        "subscription",
        "profile"
      ];
      this.showColumn = false;
      if (url == undefined || url == "") {
        // url = "usersfilter?UserStatus=" + this.selectedRequest;
        url = "usersfilter?UserStatus=6";
      } else {
        url = url + "&UserStatus=6";
      }
    }

    if (this.selectedUser != undefined && this.selectedUser != "") {
      if (url == undefined || url == "") {
        url = "usersfilter?SubStatus=" + this.selectedUser;
      } else {
        url = url + "&SubStatus=" + this.selectedUser;
      }
    }

    this._usersService.getUsers(url).then(data => {
      this.dataSource.data = data.Users;
    });
  }
  requestSelectionChange(event) {
    var url = "";
    if (this.selectedBrand != undefined && this.selectedBrand != "") {
      if (url == undefined || url == "") {
        url = "usersfilter?BrandID=" + this.selectedBrand;
      } else {
        url = url + "&BrandID=" + this.selectedBrand;
      }
    }

    if (this.selectedCity != undefined && this.selectedCity != "") {
      if (url == undefined || url == "") {
        url = "usersfilter?City=" + this.selectedCity;
      } else {
        url = url + "&City=" + this.selectedCity;
      }
    }
    // if (this.selectedRequest != undefined && this.selectedRequest == "Approved") {

    //     url = "usersfilter?UserStatus=6"
    // }

    if (this.selectedRequest == "Pending") {
      this.displayedColumns = [
        "select",
        "id",
        "name",
        "followers",
        "city",
        "bikes",
        "ratings",
        "rides",
        "kms",
        "subscription",
        "profile"
      ];
      this.showColumn = false;

      if (
        this.selectedRequest != undefined &&
        this.selectedRequest == "Pending"
      ) {
        if (url == undefined || url == "") {
          // url = "usersfilter?UserStatus=" + this.selectedRequest;
          url = "usersfilter?UserStatus=" + this.selectedRequest;
        } else {
          url = url + "&UserStatus=" + this.selectedRequest;
        }
      }
    } else if (
      this.selectedRequest != undefined &&
      this.selectedRequest != ""
    ) {
      this.displayedColumns = [
        "select",
        "id",
        "name",
        "followers",
        "city",
        "bikes",
        "ratings",
        "rides",
        "kms",
        "subscription",
        "profile"
      ];
      this.showColumn = false;
      if (url == undefined || url == "") {
        // url = "usersfilter?UserStatus=" + this.selectedRequest;
        url = "usersfilter?UserStatus=6";
      } else {
        url = url + "&UserStatus=6";
      }
    }

    if (this.selectedUser != undefined && this.selectedUser != "") {
      if (url == undefined || url == "") {
        url = "usersfilter?SubStatus=" + this.selectedUser;
      } else {
        url = url + "&SubStatus=" + this.selectedUser;
      }
    }
    // if (this.selectedRequest != undefined && this.selectedRequest != '' ) {
    //     url = "usersfilter?UserStatus=" + this.selectedRequest;
    // }
    // if(this.selectedBrand != undefined ){
    //     url = "usersfilter?BrandID=" + this.selectedBrand;
    // }else {
    //     url = "&BrandID=" +this.selectedBrand;
    // }

    if (this.selectedRequest == "Approve") {
      this._usersService.getUsers(url).then(data => {
        this.dataSource.data = data.Users;
      });
    }
    if (this.selectedRequest == "request") {
      this.displayedColumns = [
        "select",
        "id",
        "name",
        "followers",
        "city",
        "bikes",
        "ratings",
        "rides",
        "kms",
        "leaderboard",
        "subscription",
        "profile"
      ];
      this.showColumn = true;
      this._usersService.getUsers("usersfilter").then(data => {
        this.usersData = data.Users;
        console.log(this.usersData);
        this.dataSource.data = this.usersData;
      });
    }
    if (this.selectedRequest == "Pending") {
      this._usersService.getUsers(url).then(data => {
        // this.usersData = data.Users;
        //console.log(this.usersData);
        this.dataSource.data = data.Users;
      });
    }
  }

  userSelectionChange(event) {
    var url = "";
    if (this.selectedBrand != undefined && this.selectedBrand != "") {
      if (url == undefined || url == "") {
        url = "usersfilter?BrandID=" + this.selectedBrand;
      } else {
        url = url + "&BrandID=" + this.selectedBrand;
      }
    }

    if (this.selectedCity != undefined && this.selectedCity != "") {
      if (url == undefined || url == "") {
        url = "usersfilter?City=" + this.selectedCity;
      } else {
        url = url + "&City=" + this.selectedCity;
      }
    }

    if (this.selectedUser != undefined && this.selectedUser != "") {
      if (url == undefined || url == "") {
        url = "usersfilter?SubStatus=" + this.selectedUser;
      } else {
        url = url + "&SubStatus=" + this.selectedUser;
      }
    }

    if (this.selectedRequest == "Pending") {
      this.displayedColumns = [
        "select",
        "id",
        "name",
        "followers",
        "city",
        "bikes",
        "ratings",
        "rides",
        "kms",
        "subscription",
        "profile"
      ];
      this.showColumn = false;
      if (
        this.selectedRequest != undefined &&
        this.selectedRequest == "Pending"
      ) {
        if (url == undefined || url == "") {
          // url = "usersfilter?UserStatus=" + this.selectedRequest;
          url = "usersfilter?UserStatus=" + this.selectedRequest;
        } else {
          url = url + "&UserStatus=" + this.selectedRequest;
        }
      }
    } else if (
      this.selectedRequest != undefined &&
      this.selectedRequest != ""
    ) {
      this.displayedColumns = [
        "select",
        "id",
        "name",
        "followers",
        "city",
        "bikes",
        "ratings",
        "rides",
        "kms",
        "subscription",
        "profile"
      ];
      this.showColumn = false;
      if (url == undefined || url == "") {
        // url = "usersfilter?UserStatus=" + this.selectedRequest;
        url = "usersfilter?UserStatus=6";
      } else {
        url = url + "&UserStatus=6";
      }
    }
    // if (this.selectedRequest == "Approved") {
    //     this._usersService.getUsers(url)
    //         .then(data => {
    //             this.dataSource.data = data.Users;
    //         })
    // }
    // if (this.selectedRequest == "request") {
    //     this._usersService.getUsers('usersfilter')
    //         .then(data => {
    //             this.usersData = data.Users;
    //             console.log(this.usersData);
    //             this.dataSource.data = this.usersData;
    //         })
    // }
    // if (this.selectedRequest == "Pending") {
    this._usersService.getUsers(url).then(data => {
      // this.usersData = data.Users;
      //console.log(this.usersData);
      this.dataSource.data = data.Users;
    });
    // }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  OnAcceptUser(user) {
    let data = user;
    console.log(data);
    var userJson = {
      UserStatus: 1
    };
    this._usersService.AcceptUser(data, userJson).then(data => {
      if (data.Status == 1) {
        alert("User Accepeted successfully");
        this.usersRefresh.next(true);
      } else alert(data.Message);
    });
  }
  //   OnRejectUser(user) {
  //     let data = user;
  //     console.log(data);
  //     var userrejectJson = {
  //       UserStatus: 7
  //     };
  //     this._usersService.RejectUser(data, userrejectJson).then(data => {
  //       if (data.Status == 1) {
  //         alert("User Rejected successfully");
  //         // this._router.navigate(['apps/e-commerce/user-posted']);
  //         this.usersRefresh.next(true);
  //       } else alert(data.Message);
  //     });
  //   }
  onImgError(event) {
    event.target.src = "assets/images/profile/default-avatar.png";
  }
  openAlertDialog(): void {
    const dialogRef = this.dialog.open(RequestDialogComponent, {
      data: {
        message: "Your Request has been Successfully Sent !",
        buttonText: {
          cancel: "Done"
        }
      }
    });
  }
  rejectmodalDialog(): void {
    // console.log(this.selection.selected);
    let rejectrow = this.selection.selected;
    //localStorage.setItem("FeedbackUser", JSON.stringify(feedbackrow));
    this.dialogRef = this.dialog.open(RejectSendMessageDialog, {
      panelClass: "reject-send-message",
      data: { rejectrequestValue: rejectrow }
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
    });
  }
  addLeaderBoardDialog(product): void {
    this.userid = product.UserID;
    this.dialogRef = this.dialog.open(LeaderboardComponent, {
      panelClass: "leaderboard",
      data: { leaderboardValue: product }
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.usersRefresh.next(true);
      }
      if (!response) {
        return;
      }
    });
  }

  get() {
    //console.log(this.selection.selected);

    let row = this.selection.selected;
    localStorage.setItem("SendMessageUser", JSON.stringify(row));
    this._router.navigate(["/apps/e-commerce/send-message/"]);
  }
  addDialog(): void {
    this.dialogRef = this.dialog.open(AddLeaderMessageTypeComponent, {
      panelClass: "add-leader-message-type"
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];
      switch (actionType) {
        /**
         * Send
         */
        case "send":
          console.log("new Mail", formData.getRawValue());
          break;
        /**
         * Delete
         */
        case "delete":
          console.log("delete Mail");
          break;
      }
    });
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row.id + 1}`;
  }
  onSelect(selectedItem: any) {
    console.log("Selected item Id: ", selectedItem.UserID); // You get the Id of the selected item here
  }

  setSelectedUser(row) {
    localStorage.setItem("selectedUserRow", JSON.stringify(row));
    this._router.navigate(["/apps/e-commerce/profile"]);

    //localStorage.setItem("fromProfileMenu",'User');
  }
}
