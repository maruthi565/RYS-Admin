import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
  QueryList,
  ViewChildren,
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
import {
  MatTableDataSource,
  MatDialog,
  MatTable,
  MatDialogRef,
  MatTabChangeEvent
} from "@angular/material";
import { RequestDialogComponent } from "../request-dialog/request-dialog.component";
import { AcceptCouponComponent } from "../../mail/dialogs/accept-coupon/accept-coupon.component";
import { FormGroup } from "@angular/forms";
import { AddCategoryComponent } from "../../mail/dialogs/add-category/add-category.component";
import { FormControl } from "@angular/forms";
import { EcommerceAfterMarketService } from "./after-market.service";
import { Router } from "@angular/router";
import { MapsAPILoader } from "@agm/core";
import { DatePipe } from "@angular/common";
import { EcommerceVendorProfileService } from "../vendor-profile/vendor-profile.service";
import * as XLSX from "xlsx";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "e-commerce-after-market",
  templateUrl: "./after-market.component.html",
  styleUrls: ["./after-market.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceAfterMarketComponent {
  displayedColumns1 = [
    "select",
    "position",
    "name",
    "city",
    "coupons",
    "merchandise",
    "active",
    "activemer",
    "action"
  ];
  displayedColumns2 = [
    "select",
    "position",
    "name",
    "new",
    "location",
    "coupons",
    "active",
    "sold",
    "action"
  ];
  displayedColumns3 = [
    "select",
    "position",
    "name",
    "new",
    "location",
    "sale",
    "count",
    "active",
    "sold",
    "action"
  ];
  displayedColumns4 = [
    "select",
    "position",
    "name",
    "vendorid",
    "location",
    "paid"
  ];
  //@ViewChild(MatTable, { static: true }) table: MatTable<any>;
  //@ViewChild(MatTable, { static: true }) table2: MatTable<any>;

  dataSource1: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<any>;
  dataSource3: MatTableDataSource<any>;
  dataSource4: MatTableDataSource<any>;
  selection1 = new SelectionModel<Element1>(true, []);
  selection2 = new SelectionModel<Element2>(true, []);
  selection3 = new SelectionModel<Element3>(true, []);
  selection4 = new SelectionModel<Element4>(true, []);
  selected = new FormControl(0);
  isShow = false;
  isVendor = true;
  isCoupon = false;
  showVendor = true;
  showCouponsPurchased = false;
  showVendorBox = false;
  showCouponBox = false;
  totalCoupons = true;
  productsSold = false;
  isMerchandise = false;
  isPayment = false;
  couponvendors: any;
  vendorslist: any;
  couponslist: any;
  dialogRef: any;
  vendorpayments: any;
  merchandiselist: any;
  vendors: any;
  showPaidStatus = false;
  pay = true;
  searchTerm: string;
  selectedCity: string;
  showDate = true;
  adminid: any;
  vendorinfoboxes: any;
  showcountbox: boolean;
  merchandiseinfoboxes: any;
  couponsinfoboxes: any;
  showPaymentBox = false;
  paymentinfoboxes: any;
  showRevenueBox = false;
  selectedDate: string;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  vendorrefresh: Subject<any> = new Subject();
  selectedIndex: any;

  @ViewChild("afterMarketCitySearch", { static: true })
  private afterMarketCitySearchElementRef: ElementRef;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  constructor(
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _aftermarketService: EcommerceAfterMarketService,
    private datePipe: DatePipe,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private _vendorProfileService: EcommerceVendorProfileService
  ) {
    this.adminid = JSON.parse(localStorage.getItem("AdminUserID"));
    this.dataSource1 = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();
    this.dataSource3 = new MatTableDataSource();
    this.dataSource4 = new MatTableDataSource();
  }
  ngOnInit() {
    this.selectedIndex = JSON.parse(
      localStorage.getItem("AftermarketTabLocation")
    );
    this.vendorrefresh.subscribe(updateDB => {
      if (updateDB) {
        this._aftermarketService
          .getVendors("aftermarketfiltervendors")
          .then(data => {
            this.vendors = data.UserReports;
            this.dataSource1.data = this.vendors;
          });
      }
    });

    this._aftermarketService.getVendorInfoBoxes().then(data => {
      this.vendorinfoboxes = data.AfterMarketVendor;
      console.log(this.vendorinfoboxes);
      this.showcountbox = true;
    });
    this._aftermarketService.getMerchandiseInfoBoxes().then(data => {
      this.merchandiseinfoboxes = data.AfterMarketMerchandise;
      this.showcountbox = true;
    });
    this._aftermarketService.getCouponsInfoBoxes().then(data => {
      this.couponsinfoboxes = data.AfterMarketMerchandise;
      this.showcountbox = true;
    });
    this._aftermarketService.getPaymentInfoBoxes().then(data => {
      this.paymentinfoboxes = data.Total_Amount_Paid;
      this.showcountbox = true;
    });

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.afterMarketCitySearchElementRef.nativeElement,
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

    this._aftermarketService
      .getVendors("aftermarketfiltervendors")
      .then(data => {
        this.vendors = data.UserReports;
        this.dataSource1.data = this.vendors;
      });

    this._aftermarketService.getVendorsList().then(data => {
      this.vendorslist = data.Vendors;

      //this.dataSource2.data = this.vendorslist;
      // this.dataSource3.data = this.vendorslist;

      this.cdr.detectChanges();
      //this.table.renderRows();
      console.log(this.vendorslist);
    });

    this._aftermarketService
      .getCouponsList("aftermarketfiltercoupons")
      .then(data => {
        this.couponslist = data.UserReports;
        this.dataSource2.data = this.couponslist;
      });
    this._aftermarketService
      .getMerchandiseList("aftermarketfiltermerchandise")
      .then(data => {
        this.merchandiselist = data.UserReports;
        this.dataSource3.data = this.merchandiselist;
      });

    this._aftermarketService.getPayments().then(data => {
      this.vendorpayments = data.VendorPayments;
      this.dataSource4.data = this.vendorpayments;
    });
  }
  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource1.paginator = this.paginator.toArray()[0];
    this.dataSource1.sort = this.sort.toArray()[0];

    this.dataSource2.paginator = this.paginator.toArray()[1];
    this.dataSource2.sort = this.sort.toArray()[1];

    this.dataSource3.paginator = this.paginator.toArray()[2];
    this.dataSource3.sort = this.sort.toArray()[2];

    this.dataSource4.paginator = this.paginator.toArray()[3];
    this.dataSource4.sort = this.sort.toArray()[3];

    //this.table.renderRows();
    //this.table2.renderRows();
  }
  filterAfterMarketByName(event): void {
    if (this.selected.value == 0) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url = "aftermarketfiltervendors?QueryString=" + this.searchTerm;
        this._aftermarketService.getVendors(url).then(data => {
          this.dataSource1.data = data.UserReports;
          console.log(this.dataSource1.data);
        });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._aftermarketService
          .getVendors("aftermarketfiltervendors")
          .then(data => {
            this.vendors = data.UserReports;
            this.dataSource1.data = this.vendors;
          });
      }
    }

    if (this.selected.value == 1) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url = "aftermarketfiltercoupons?QueryString=" + this.searchTerm;
        this._aftermarketService.getCouponsList(url).then(data => {
          this.dataSource2.data = data.UserReports;
          console.log(this.dataSource1.data);
        });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._aftermarketService
          .getCouponsList("aftermarketfiltercoupons")
          .then(data => {
            this.couponslist = data.UserReports;
            this.dataSource2.data = this.couponslist;
          });
      }
    }

    if (this.selected.value == 2) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url = "aftermarketfiltermerchandise?QueryString=" + this.searchTerm;
        this._aftermarketService.getMerchandiseList(url).then(data => {
          this.dataSource3.data = data.UserReports;
          console.log(this.dataSource3.data);
        });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._aftermarketService
          .getMerchandiseList("aftermarketfiltermerchandise")
          .then(data => {
            this.merchandiselist = data.UserReports;
            this.dataSource3.data = this.merchandiselist;
          });
      }
    }
  }

  citySelectionChange(event) {
    var url = "";
    if (this.selected.value == 0) {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "aftermarketfiltervendors?City=" + this.selectedCity;
        }
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        url = url + "&Date=" + this.selectedDate;
      }
    }
    if (this.selected.value == 1) {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "aftermarketfiltercoupons?City=" + this.selectedCity;
        }
      }
    }
    if (this.selected.value == 2) {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "aftermarketfiltermerchandise?City=" + this.selectedCity;
        }
      }
    }
    if (this.selected.value == 3) {
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "vendorpayments-filter?City=" + this.selectedCity;
        }
      }
    }
    this._aftermarketService.getCouponsList(url).then(data => {
      if (this.selected.value == 0) {
        this.dataSource1.data = data.UserReports;
      }
      if (this.selected.value == 1) {
        this.dataSource2.data = data.UserReports;
      }
      if (this.selected.value == 2) {
        this.dataSource3.data = data.UserReports;
      }
      if (this.selected.value == 3) {
        this.dataSource4.data = data.VendorPayments;
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
      // if(this.selectedCity != undefined && this.selectedCity != ''){
      //     url = url + "&City="+ this.selectedCity;
      // }
      if (this.selectedCity != undefined && this.selectedCity != "") {
        url = "aftermarketfiltervendors?City=" + this.selectedCity;
      }
      // if(this.selectedCity != undefined && this.selectedCity != ''){

      //         url = url + "&City="+ this.selectedCity;

      // }

      if (this.selectedDate != undefined && this.selectedDate != "") {
        if (url == undefined || url == "") {
          url = "aftermarketfiltervendors?Date=" + this.selectedDate;
        } else {
          url = url + "&Date=" + this.selectedDate;
        }
      }
    }

    this._aftermarketService.getVendors(url).then(data => {
      if (this.selected.value == 0) {
        this.dataSource1.data = data.UserReports;
      }
    });
  }
  addDialog(): void {
    this.dialogRef = this.dialog.open(AddCategoryComponent, {
      panelClass: "add-category"
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

  tabClick(event: MatTabChangeEvent) {
    console.log(event.index);
    let index = event.index;
    localStorage.setItem("AftermarketTabLocation", JSON.stringify(index));
    if (this.selected.value == 0) {
      //  console.log('tab0');
      this.isShow = false;
      this.isVendor = true;
      this.isCoupon = false;
      this.isMerchandise = false;
      this.isPayment = false;
      this.showDate = true;
      this.showVendor = true;
      this.showCouponsPurchased = false;
      this.showVendorBox = false;
      this.showCouponBox = false;
      this.totalCoupons = true;
      this.productsSold = false;
      this.showPaymentBox = false;
      this.showRevenueBox = false;
    }
    if (this.selected.value == 1) {
      // console.log('tab1');
      this.isShow = false;
      this.isVendor = false;
      this.isCoupon = true;
      this.isMerchandise = false;
      this.isPayment = false;
      this.showDate = false;
      this.showVendor = false;
      this.showCouponsPurchased = true;
      this.showVendorBox = false;
      this.showCouponBox = true;
      this.totalCoupons = true;
      this.productsSold = false;
      this.showPaymentBox = false;
      this.showRevenueBox = true;
    }
    if (this.selected.value == 2) {
      // console.log('tab2');
      this.isShow = true;
      this.isVendor = false;
      this.isCoupon = false;
      this.isMerchandise = true;
      this.isPayment = false;
      this.showDate = false;
      this.showVendor = true;
      this.showCouponsPurchased = false;
      this.showVendorBox = true;
      this.showCouponBox = false;
      this.totalCoupons = false;
      this.productsSold = true;
      this.showPaymentBox = false;
      this.showRevenueBox = false;
    }
    if (this.selected.value == 3) {
      //  console.log('tab3');
      this.isShow = false;
      this.isVendor = false;
      this.isCoupon = false;
      this.isMerchandise = false;
      this.isPayment = true;
      this.showDate = true;
      this.showVendor = false;
      this.showCouponsPurchased = false;
      this.showVendorBox = false;
      this.showCouponBox = false;
      this.totalCoupons = false;
      this.productsSold = true;
      this.showPaymentBox = true;
      this.showRevenueBox = false;
    }
  }

  exportToExcel() {
    if (this.selected.value == 0) {
      var selectedRows0 = this.selection1.selected;
      console.log(selectedRows0);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedRows0);
      //const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      //const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(wb, `Vendors_export_${new Date().getTime()}.xlsx`);
    }
    if (this.selected.value == 1) {
      var selectedRows1 = this.selection2.selected;
      console.log(selectedRows1);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedRows1);
      //const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      //const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(wb, `Coupons_export_${new Date().getTime()}.xlsx`);
    }
    if (this.selected.value == 2) {
      var selectedRows2 = this.selection3.selected;
      console.log(selectedRows2);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedRows2);
      //const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      //const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(wb, `Merchandise_export_${new Date().getTime()}.xlsx`);
    }
    if (this.selected.value == 3) {
      var selectedRows3 = this.selection4.selected;
      console.log(selectedRows3);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedRows3);
      //const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      //const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(wb, `Payments_export_${new Date().getTime()}.xlsx`);
    }
  }

  setSelectedVendor(row) {
    localStorage.setItem("selectedVendorRow", JSON.stringify(row));
    let id = row.VendorID;
    localStorage.setItem("VendorID", JSON.stringify(id));
    this.router.navigate(["/apps/e-commerce/vendor-profile"]);
  }

  editVendor(vendor) {
    let id = vendor.VendorID;
    let datas: any = this._aftermarketService.vendorData;
    let Details = datas.Vendors.find(x => x.VendorID == id);
    //console.log(id);
    localStorage.setItem("EditVendor", JSON.stringify(Details));
    this.router.navigate(["apps/e-commerce/edit-vendor"]);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected1(): boolean {
    const numSelected = this.selection1.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }

  isAllSelected2(): boolean {
    const numSelected = this.selection2.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }
  isAllSelected3(): boolean {
    const numSelected = this.selection3.selected.length;
    const numRows = this.dataSource3.filteredData.length;
    return numSelected === numRows;
  }
  isAllSelected4(): boolean {
    const numSelected = this.selection4.selected.length;
    const numRows = this.dataSource4.filteredData.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle1(): void {
    this.isAllSelected1()
      ? this.selection1.clear()
      : this.dataSource1.data.forEach(row => this.selection1.select(row));
  }
  masterToggle2(): void {
    this.isAllSelected2()
      ? this.selection2.clear()
      : this.dataSource2.data.forEach(row => this.selection2.select(row));
  }
  masterToggle3(): void {
    this.isAllSelected3()
      ? this.selection3.clear()
      : this.dataSource3.filteredData.forEach(row =>
          this.selection3.select(row)
        );
  }
  masterToggle4(): void {
    this.isAllSelected4()
      ? this.selection4.clear()
      : this.dataSource4.filteredData.forEach(row =>
          this.selection4.select(row)
        );
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel1(row?: Element1): string {
    if (!row) {
      return `${this.isAllSelected1() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection1.isSelected(row) ? "deselect" : "select"
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
  checkboxLabel3(row?: Element3): string {
    if (!row) {
      return `${this.isAllSelected3() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection3.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }
  checkboxLabel4(row?: Element4): string {
    if (!row) {
      return `${this.isAllSelected4() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection4.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }
  _setDataSource(indexNumber): void {
    setTimeout(() => {
      switch (indexNumber) {
        case 0:
          // tslint:disable-next-line:no-unused-expression
          !this.dataSource1.paginator
            ? (this.dataSource1.paginator = this.paginator.toArray()[0])
            : null;
          break;
        case 1:
          // tslint:disable-next-line:no-unused-expression
          !this.dataSource2.paginator
            ? (this.dataSource2.paginator = this.paginator.toArray()[1])
            : null;
          break;
        // tslint:disable-next-line:no-switch-case-fall-through
        case 2:
          // tslint:disable-next-line:no-unused-expression
          !this.dataSource3.paginator
            ? (this.dataSource3.paginator = this.paginator.toArray()[2])
            : null;
          break;
        // tslint:disable-next-line:no-switch-case-fall-through
        case 3:
          // tslint:disable-next-line:no-unused-expression
          !this.dataSource4.paginator
            ? (this.dataSource4.paginator = this.paginator.toArray()[3])
            : null;
          break;
      }
    });
  }
  setSelectedCoupon(coupon) {
    let id = coupon.VendorID;
    console.log(id);
    localStorage.setItem("FirstName", coupon.FirstName);
    localStorage.setItem("LastName", coupon.LastName);
    localStorage.setItem("VendorName", coupon);
    localStorage.setItem("VendorID", coupon.VendorID);
    //localStorage.setItem()
    this.router.navigate(["/apps/e-commerce/my-coupons", id]);
  }
  setSelectedMerchandise(merchandise) {
    let id = merchandise.VendorID;
    console.log(id);
    localStorage.setItem("FirstName", merchandise.FirstName);
    localStorage.setItem("LastName", merchandise.LastName);
    localStorage.setItem("VendorID", merchandise.VendorID);
    //localStorage.setItem()
    this.router.navigate(["/apps/e-commerce/merchandise-products", id]);
  }

  showPaid() {
    this.showPaidStatus = true;
    this.pay = false;
  }
  /**
   * Delete Vendor
   *
   * @param vendor
   */
  deleteVendor(vendor): void {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._aftermarketService.deleteVendor(vendor.VendorID).then(data => {
          // Show the success message
          if (data.Status == 1) {
            //let result = data.VendorDetails;
            alert(data.Message);
            this.vendorrefresh.next(true);
          } else alert(data.Message);
        });
      }
      this.confirmDialogRef = null;
    });
  }
}

export interface Element1 {
  name: string;
  position: number;
  city: string;
  coupons: number;
  active: number;
  merchandise: number;
  activemer: number;
  action: number;
}
export interface Element2 {
  name: string;
  position: number;
  new: number;
  location: string;
  coupons: number;
  active: number;
  sold: number;
  action: number;
}
export interface Element3 {
  name: string;
  position: number;
  new: number;
  location: string;
  sale: number;
  count: number;
  active: number;
  sold: number;
  action: number;
}
export interface Element4 {
  name: string;
  position: number;
  vendorid: string;
  location: string;
  paid: number;
  balance: number;
}

const ELEMENT_DATA1: Element1[] = [
  {
    position: 1,
    name: "Berik",
    city: "Hyderabad",
    coupons: 30,
    merchandise: 20,
    active: 16,
    activemer: 8,
    action: 123
  }
];

const ELEMENT_DATA2: Element2[] = [
  {
    position: 1,
    name: "Vasanth Kawasaki Motors",
    new: 3,
    location: "Hyderabad",
    coupons: 20,
    active: 10,
    sold: 5,
    action: 123
  }
];
const ELEMENT_DATA3: Element3[] = [
  {
    position: 1,
    name: "Berik",
    new: 3,
    location: "Hyderabad",
    sale: 15000,
    count: 15,
    active: 10,
    sold: 8,
    action: 123
  }
];
const ELEMENT_DATA4: Element4[] = [
  {
    position: 1,
    name: "Berik",
    vendorid: "RYS092",
    location: "Hyderabad",
    paid: 15000,
    balance: 1200
  }
];
