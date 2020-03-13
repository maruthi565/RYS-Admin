import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  NgZone
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { FuseUtils } from "@fuse/utils";

import { EcommerceProductsService } from "app/main/apps/e-commerce/products/products.service";
import { takeUntil } from "rxjs/internal/operators";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { RequestDialogComponent } from "../request-dialog/request-dialog.component";
import { EcommerceBikeUserPostedService } from "./bike-request.service";
import { ViewBikeComponent } from "../../mail/dialogs/view-bike/view-bike.component";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ViewMerchandiseComponent } from "../../mail/dialogs/view-merchandise/view-merchandise.component";
import { EcommerceUserPostedService } from "../user-posted/user-posted.service";
import { MapsAPILoader } from "@agm/core";
import { DatePipe } from "@angular/common";
import * as XLSX from "xlsx";

@Component({
  selector: "e-commerce-bike-request",
  templateUrl: "./bike-request.component.html",
  styleUrls: ["./bike-request.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceBikeRequestComponent {
  displayedColumns = [
    "select",
    "position",
    "posted",
    "name",
    "location",
    "date",
    "price",
    "action"
  ];
  displayedColumns2 = [
    "select",
    "position",
    "posted",
    "name",
    "location",
    "date",
    "price",
    "action"
  ];

  //dataSource : any;
  dataSource: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<any>;
  selection2 = new SelectionModel<Element2>(true, []);
  selection = new SelectionModel<Element>(true, []);
  userpostedbikes: any[];
  selected = new FormControl(0);
  merchandiseuserposted: any[];
  dialogRef: any;
  ID: any;
  bikeBrands: any;
  selectedBrand: string;
  selectedCity: string;
  selectedDate: string;
  isBrand = true;
  searchTerm: string;
  requestrefresh: Subject<any> = new Subject();

  @ViewChild("bikeRequestCitySearch", { static: true })
  private bikeRequestCitySearchElementRef: ElementRef;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  // @ViewChild(MatPaginator, { static: false })
  // paginator: MatPaginator;

  // @ViewChild(MatSort, { static: true })
  // sort: MatSort;

  // @ViewChild(MatPaginator, { static: false })
  // paginator2: MatPaginator;

  // @ViewChild(MatSort, { static: true })
  // sort2: MatSort;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _ecommerceBikeUserPostedService: EcommerceBikeUserPostedService,
    private _userpostedService: EcommerceUserPostedService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource();
    // Set the private defaults
    // this._unsubscribeAll = new Subject();
    //this.dataSource= new MatTableDataSource(this.userpostedbikes);
    this.dataSource2 = new MatTableDataSource();
    // this.dataSource2 = new MatTableDataSource(this.merchandiseuserposted);
  }
  ngOnInit() {
    this.requestrefresh.subscribe(updateDB => {
      if (updateDB) {
        this._ecommerceBikeUserPostedService
          .getUserPostedBikes("userads-admin?Status=2")
          .then(data => {
            //this.bikes = res;
            this.userpostedbikes = data.UserPostedBikes;
            this.dataSource.data = this.userpostedbikes;
            this.merchandiseuserposted = data.UserPostedMerchandise;
            this.dataSource2.data = this.merchandiseuserposted;
          });
      }
    });

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.bikeRequestCitySearchElementRef.nativeElement,
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

    this._ecommerceBikeUserPostedService
      .getUserPostedBikes("userads-admin?Status=2")
      .then(data => {
        this.userpostedbikes = data.UserPostedBikes;
        this.dataSource.data = this.userpostedbikes;
        this.merchandiseuserposted = data.UserPostedMerchandise;
        this.dataSource2.data = this.merchandiseuserposted;
        this.cdr.detectChanges();
      });
    this._userpostedService.getBikeBrands().then(data => {
      this.bikeBrands = data.BikeBrands;
    });
  }
  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
    this.dataSource2.paginator = this.paginator.toArray()[1];
    this.dataSource2.sort = this.sort.toArray()[1];
  }
  onImgError(event) {
    event.target.src = "assets/images/profile/default-avatar.png";
  }
  brandSelectionChange(event) {
    var url = "";
    if (this.selectedBrand != undefined) {
      url = "userpostedbikesfilters?BrandID=" + this.selectedBrand;
    }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      url = url + "&City=" + this.selectedCity;
    }
    if (this.selectedDate != undefined && this.selectedDate != "") {
      url = url + "&Date=" + this.selectedDate;
    }

    this._ecommerceBikeUserPostedService.getUserPostedBikes(url).then(data => {
      this.dataSource.data = data.UserPostedBikes;
    });
  }

  citySelectionChange(event) {
    var url = "";
    if (this.selected.value == 0) {
      if (this.selectedBrand != undefined && this.selectedBrand != "") {
        if (url == undefined || url == "") {
          url = "userpostedbikesfilters?BrandID=" + this.selectedBrand;
        } else {
          url = url + "&BrandID=" + this.selectedBrand;
        }
      }

      // if(this.selectedBrand != undefined ){
      //     url = "userpostedbikesfilters?BrandID=" + this.selectedBrand;
      // }
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "userpostedbikesfilters?City=" + this.selectedCity;
        } else {
          url = url + "&City=" + this.selectedCity;
        }
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        url = url + "&Date=" + this.selectedDate;
      }
    } else {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "userpostedmerchandisefilters?City=" + this.selectedCity;
        }
        // else{
        //     url = url + "&City="+ this.selectedCity;

        // }
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        url = url + "&Date=" + this.selectedDate;
      }
    }

    this._ecommerceBikeUserPostedService.getUserPostedBikes(url).then(data => {
      if (this.selected.value == 0) {
        this.dataSource.data = data.UserPostedBikes;
      }
      if (this.selected.value == 1) {
        this.dataSource2.data = data.UserPostedMerchandise;
      }
    });
  }
  dateSelectionChange() {
    this.selectedDate = this.datePipe.transform(
      this.selectedDate,
      "yyyy-MM-dd"
    );
    var url = "";
    if (this.selected.value == 0) {
      if (this.selectedBrand != undefined) {
        url = "userpostedbikesfilters?BrandID=" + this.selectedBrand;
      }
      // if(this.selectedCity != undefined && this.selectedCity != ''){
      //     url = url + "&City="+ this.selectedCity;
      // }
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "userpostedbikesfilters?City=" + this.selectedCity;
        } else {
          url = url + "&City=" + this.selectedCity;
        }
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        if (url == undefined || url == "") {
          url = "userpostedbikesfilters?Date=" + this.selectedDate;
        } else {
          url = url + "&Date=" + this.selectedDate;
        }
      }
    } else {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        url = "userpostedmerchandisefilters?City=" + this.selectedCity;
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        if (url == undefined || url == "") {
          url = "userpostedmerchandisefilters?Date=" + this.selectedDate;
        } else {
          url = url + "&Date=" + this.selectedDate;
        }
      }
    }
    this._ecommerceBikeUserPostedService.getUserPostedBikes(url).then(data => {
      if (this.selected.value == 0) {
        this.dataSource.data = data.UserPostedBikes;
      }
      if (this.selected.value == 1) {
        this.dataSource2.data = data.UserPostedMerchandise;
      }
    });
  }
  tabClick(event) {
    if (this.selected.value == 0) {
      // this.isBike = true;
      // this.isMerchandise = false;
      this.isBrand = true;
    }
    if (this.selected.value == 1) {
      //   this.isBike = false;
      // this.isMerchandise = true;
      this.isBrand = false;
    }
  }
  filterBikeRequestByName(event): void {
    if (this.selected.value == 0) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url = "userpostedbikesfilters?QueryString=" + this.searchTerm;
        this._ecommerceBikeUserPostedService
          .getUserPostedBikes(url)
          .then(data => {
            this.dataSource.data = data.UserPostedBikes;
            console.log(this.dataSource.data);
          });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._ecommerceBikeUserPostedService
          .getUserPostedBikes("userads-admin?Status=2")
          .then(data => {
            this.userpostedbikes = data.UserPostedBikes;
            this.dataSource.data = this.userpostedbikes;
          });
      }
    } else if (this.selected.value == 1) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url = "userpostedmerchandisefilters?QueryString=" + this.searchTerm;
        this._ecommerceBikeUserPostedService
          .getUserPostedBikes(url)
          .then(data => {
            this.dataSource2.data = data.UserPostedMerchandise;
            console.log(this.dataSource2.data);
          });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._ecommerceBikeUserPostedService
          .getUserPostedBikes("userads-admin?Status=2")
          .then(data => {
            this.merchandiseuserposted = data.UserPostedMerchandise;
            this.dataSource2.data = this.merchandiseuserposted;
          });
      }
    }
  }
  viewDialog(element): void {
    this.dialogRef = this.dialog.open(ViewBikeComponent, {
      panelClass: "view-bike",
      height: "522px",
      width: "509px",
      data: { pagerequestValue: element }
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
          // this._router.navigate(['apps/e-commerce/user-posted']);
          this.requestrefresh.next(true);
        } else alert(data.Message);
      });
  }
  OnAcceptMerchandise(element) {
    let data = element;
    console.log(data);
    var merchandiseJson = {
      Status: 1
    };
    this._ecommerceBikeUserPostedService
      .AcceptUserMerchandise(data, merchandiseJson)
      .then(data => {
        if (data.Status == 1) {
          alert("UserPosted Merchandise updated successfully");
          this._router.navigate(["apps/e-commerce/user-posted"]);
        } else alert(data.Message);
      });
  }
  OnRejectMerchandise(element) {
    let data = element;
    console.log(data);
    var merchandiserejectJson = {
      Status: 0
    };
    this._ecommerceBikeUserPostedService
      .RejectUserMerchandise(data, merchandiserejectJson)
      .then(data => {
        if (data.Status == 1) {
          alert("UserPosted Merchandise Rejected successfully");
          //this._router.navigate(['apps/e-commerce/user-posted']);
          this.requestrefresh.next(true);
        } else alert(data.Message);
      });
  }
  viewMerchandiseDialog(element): void {
    this.dialogRef = this.dialog.open(ViewMerchandiseComponent, {
      panelClass: "view-merchandise",
      height: "480px",
      width: "470px",
      data: { pagerequestProductValue: element }
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

  exportToExcel() {
    if (this.selected.value == 0) {
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
        `Userposted_Bikes_Requests_export_${new Date().getTime()}.xlsx`
      );
    }
    if (this.selected.value == 1) {
      var selectedRows2 = this.selection2.selected;
      console.log(selectedRows2);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedRows2);
      //const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      //const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(
        wb,
        `Userposted_Merchandise_Requests_export_${new Date().getTime()}.xlsx`
      );
    }
  }
  _;
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelected2(): boolean {
    const numSelected = this.selection2.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  masterToggle2(): void {
    this.isAllSelected2()
      ? this.selection2.clear()
      : this.dataSource2.data.forEach(row => this.selection2.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }

  checkboxLabel2(row?: Element2): string {
    if (!row) {
      return `${this.isAllSelected2() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection2.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }

  _setDataSource(indexNumber): void {
    setTimeout(() => {
      switch (indexNumber) {
        case 0:
          // tslint:disable-next-line:no-unused-expression
          !this.dataSource.paginator
            ? (this.dataSource.paginator = this.paginator.toArray()[0])
            : null;
          break;
        case 1:
          // tslint:disable-next-line:no-unused-expression
          !this.dataSource2.paginator
            ? (this.dataSource2.paginator = this.paginator.toArray()[1])
            : null;
      }
    });
  }
}

export interface Element {
  posted: string;
  name: string;
  position: number;
  location: string;
  date: string;
  price: string;
  action: number;
}
export interface Element2 {
  posted: string;
  name: string;
  position: number;
  location: string;
  date: string;
  price: string;
  action: number;
}
