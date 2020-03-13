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

// import { EcommerceProductsService } from 'app/main/apps/e-commerce/products/products.service';
import { MatTableDataSource, MatDialog, MatDialogRef } from "@angular/material";
import { AddReasonTypeComponent } from "../../mail/dialogs/add-reason-type/add-reason-type.component";
import { FormGroup, FormControl } from "@angular/forms";
import { AddNewComponent } from "../../mail/dialogs/add-new/add-new.component";

import { ViewBikeComponent } from "../../mail/dialogs/view-bike/view-bike.component";
import { AddMerchandiseComponent } from "../../mail/dialogs/add-merchandise/add-merchandise.component";
import { EditMerchandiseComponent } from "../../mail/dialogs/edit-merchandise/edit-merchandise.component";
import { ViewMerchandiseComponent } from "../../mail/dialogs/view-merchandise/view-merchandise.component";
import { EditNewComponent } from "../../mail/dialogs/edit-new/edit-new.component";
import { EcommerceUserPostedService } from "./user-posted.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { UserBikeDialog } from "../../mail/dialogs/user-bike/user-bike.component";
import { UserMerchandiseDialog } from "../../mail/dialogs/user-merchandise/user-merchandise.component";
import { MapsAPILoader } from "@agm/core";
import { DatePipe } from "@angular/common";
import * as XLSX from "xlsx";

@Component({
  selector: "e-commerce-user-posted",
  templateUrl: "./user-posted.component.html",
  styleUrls: ["./user-posted.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceUserPostedComponent {
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
  // dataSource2 : any;
  selection2 = new SelectionModel<Element2>(true, []);
  selection = new SelectionModel<Element>(true, []);
  selected = new FormControl(0);
  isBike = true;
  isMerchandise = false;
  isBrand = true;
  bikes: any;
  getuserpostedbikes: any;
  getuserpostedmerchandise: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  adminUserID: any;
  bikeBrands: any;
  selectedBrand: string;
  selectedCity: string;
  selectedDate: string;
  searchTerm: string;
  infoboxescount: any;
  showcountBox: boolean;

  @ViewChild("userPostedCitySearch", { static: true })
  private userPostedCitySearchElementRef: ElementRef;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  // @ViewChild(MatPaginator, { static: true })
  // paginator: MatPaginator;

  // @ViewChild(MatSort, { static: true })
  // sort: MatSort;

  // @ViewChild(MatPaginator, { static: true })
  // paginator2: MatPaginator;

  // @ViewChild(MatSort, { static: true })
  // sort2: MatSort;

  refresh: Subject<any> = new Subject();
  refreshmerchandise: Subject<any> = new Subject();
  private _unsubscribeAll: Subject<any>;
  dialogRef: any;

  constructor(
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _userpostedService: EcommerceUserPostedService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    // this.dataSource= new MatTableDataSource(this.getuserpostedbikes);
    this.dataSource = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();
    this._unsubscribeAll = new Subject();
  }
  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this._userpostedService.getInfoBoxes().then(data => {
      this.infoboxescount = data;
      this.showcountBox = true;
    });

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.userPostedCitySearchElementRef.nativeElement,
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

    this.adminUserID = localStorage.getItem("AdminUserID");
    this.refresh.subscribe(updateDB => {
      if (updateDB) {
        this._userpostedService
          .getUserPostedBikes("userpostedbikesfilters")
          .then(data => {
            //this.bikes = res;
            this.getuserpostedbikes = data.UserpostedBikes;
            this.dataSource.data = this.getuserpostedbikes;
          });
      }
    });
    this.refreshmerchandise.subscribe(updateDB => {
      if (updateDB) {
        this._userpostedService
          .getUserPostedMerchandise("userpostedmerchandisefilters")
          .then(data => {
            //this.bikes = res;
            this.getuserpostedmerchandise = data.UserPostedMerchandise;
            this.dataSource2.data = this.getuserpostedmerchandise;
          });
      }
    });
    this._userpostedService.getBikeBrands().then(data => {
      this.bikeBrands = data.BikeBrands;
    });
    this._userpostedService
      .getUserPostedBikes("userpostedbikesfilters")
      .then(data => {
        //this.bikes = res;
        this.getuserpostedbikes = data.UserPostedBikes;
        this.dataSource.data = this.getuserpostedbikes;
        this.cdr.detectChanges();
      });
    this._userpostedService
      .getUserPostedMerchandise("userpostedmerchandisefilters")
      .then(data => {
        this.getuserpostedmerchandise = data.UserPostedMerchandise;
        this.dataSource2.data = this.getuserpostedmerchandise;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }
  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
    this.dataSource2.paginator = this.paginator.toArray()[1];
    this.dataSource2.sort = this.sort.toArray()[1];
  }

  keyPress(event: any) {
    console.log(event.target.value);
    if (this.selected.value == 0) {
      if (event && event.target.value == "") {
        this._userpostedService
          .getUserPostedBikes("userpostedbikesfilters")
          .then(data => {
            //this.bikes = res;
            this.getuserpostedbikes = data.UserPostedBikes;
            this.dataSource.data = this.getuserpostedbikes;
            this.cdr.detectChanges();
          });
      }
    }
    if (this.selected.value == 1) {
      if (event && event.target.value == "") {
        this._userpostedService
          .getUserPostedMerchandise("userpostedmerchandisefilters")
          .then(data => {
            this.getuserpostedmerchandise = data.UserPostedMerchandise;
            this.dataSource2.data = this.getuserpostedmerchandise;
          });
      }
    }
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

    this._userpostedService.getUserPostedBikes(url).then(data => {
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

      if (this.selectedCity == "") {
        this._userpostedService.getUserPostedBikes(url).then(data => {
          this.dataSource.data = data.UserPostedBikes;
        });
      }
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

    this._userpostedService.getUserPostedBikes(url).then(data => {
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
    this._userpostedService.getUserPostedBikes(url).then(data => {
      if (this.selected.value == 0) {
        this.dataSource.data = data.UserPostedBikes;
      }
      if (this.selected.value == 1) {
        this.dataSource2.data = data.UserPostedMerchandise;
      }
    });
  }
  onImgError(event) {
    event.target.src = "assets/images/profile/default-avatar.png";
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
        `Userposted_Bikes_export_${new Date().getTime()}.xlsx`
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
        `Userposted_Merchandise_export_${new Date().getTime()}.xlsx`
      );
    }
  }

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
  tabClick(event) {
    if (this.selected.value == 0) {
      this.isBike = true;
      this.isMerchandise = false;
    }
    if (this.selected.value == 1) {
      this.isBike = false;
      this.isMerchandise = true;
      this.isBrand = false;
    }
  }
  filterUserPostedByName(event): void {
    if (this.selected.value == 0) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url = "userpostedbikesfilters?QueryString=" + this.searchTerm;
        this._userpostedService.getUserPostedBikes(url).then(data => {
          this.dataSource.data = data.UserPostedBikes;
          console.log(this.dataSource.data);
        });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._userpostedService
          .getUserPostedBikes("userpostedbikesfilters")
          .then(data => {
            this.getuserpostedbikes = data.UserpostedBikes;
            this.dataSource.data = this.getuserpostedbikes;
          });
      }
    } else if (this.selected.value == 1) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url = "userpostedmerchandisefilters?QueryString=" + this.searchTerm;
        this._userpostedService.getUserPostedBikes(url).then(data => {
          this.dataSource2.data = data.UserPostedMerchandise;
          console.log(this.dataSource2.data);
        });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._userpostedService
          .getUserPostedMerchandise("userpostedmerchandisefilters")
          .then(data => {
            this.getuserpostedmerchandise = data.UserPostedMerchandise;
            this.dataSource2.data = this.getuserpostedmerchandise;
          });
      }
    }
  }

  addDialog(): void {
    this.dialogRef = this.dialog.open(AddReasonTypeComponent, {
      panelClass: "add-reason-type"
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
  addNewDialog(): void {
    this.dialogRef = this.dialog.open(AddNewComponent, {
      panelClass: "add-new"
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.refresh.next(true);
      }
      if (!response) {
        return;
      }
    });
  }
  editNewDialog(bike): void {
    this.dialogRef = this.dialog.open(EditNewComponent, {
      panelClass: "edit-new",
      data: { editbikeValue: bike }
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.refresh.next(true);
      }
      if (!response) {
        return;
      }
    });
  }
  viewDialog(element): void {
    this.dialogRef = this.dialog.open(UserBikeDialog, {
      panelClass: "user-bike",
      height: "430px",
      width: "474px",
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
  /**
   * Delete bike
   *
   * @param bike
   */
  deletePostedBike(bike): void {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._userpostedService.deleteUserPostedBike(bike.ID).then(data => {
          // Show the success message
          if (data.Status == 1) {
            //let result = data.VendorDetails;
            alert(data.Message);
            this.refresh.next(true);
          } else alert(data.Message);
        });
      }
      this.confirmDialogRef = null;
    });
  }
  /**
   * Delete merchandise
   *
   * @param merchandise
   */
  deletePostedMerchandise(merchandise): void {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._userpostedService
          .deleteUserPostedMerchandise(merchandise.UserPostedMerchandiseID)
          .then(data => {
            // Show the success message
            if (data.Status == 1) {
              //let result = data.VendorDetails;
              alert(data.Message);
              this.refreshmerchandise.next(true);
            } else alert(data.Message);
          });
      }
      this.confirmDialogRef = null;
    });
  }
  addMerchandiseDialog(): void {
    this.dialogRef = this.dialog.open(AddMerchandiseComponent, {
      panelClass: "add-merchandise"
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.refreshmerchandise.next(true);
      }
      if (!response) {
        return;
      }
    });
  }
  editMerchandiseDialog(element): void {
    this.dialogRef = this.dialog.open(EditMerchandiseComponent, {
      panelClass: "edit-merchandise",
      data: { editMerchandiseValue: element }
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.refreshmerchandise.next(true);
      }
      if (!response) {
        return;
      }
    });
  }

  viewMerchandiseDialog(element): void {
    this.dialogRef = this.dialog.open(UserMerchandiseDialog, {
      panelClass: "user-merchandise",
      height: "430px",
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
  select: any;
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

// const ELEMENT_DATA: Element[] = [
//     { position: 1, posted: '123', name: 'Kawasaki Ninja 650 R', location: 'Hyderabad', date: '05 Aug 2019', price: '6,50,000/-', action: 123 },
// ];

// const ELEMENT_DATA2: Element2[] = [
//     {
//         position: 1, posted: '123', name: 'One Piece Leather Suit', location: 'Hyderabad', date: '05 Aug 2019', price: '7,000/-', action: 123
//     },
// ];
