import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
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
import { MatTableDataSource, MatDialog } from "@angular/material";
import { RequestDialogComponent } from "../request-dialog/request-dialog.component";
import { FormGroup } from "@angular/forms";
import { AddBusinessQueryComponent } from "../../mail/dialogs/add-business-query/add-business-query.component";
import { MailComposeDialogComponent } from "../../mail/dialogs/compose/compose.component";
import { ReportSendMessageComponent } from "../../mail/dialogs/report-send-message/report-send-message.component";
import { AddReportTypeComponent } from "../../mail/dialogs/add-report-type/add-report-type.component";
import { EcommerceReportsService } from "./report.service";
import { AddSendMessageDialog } from "../../mail/dialogs/add-send-message/add-send-message.component";
import { MapsAPILoader } from "@agm/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { EcommerceAddUserReportTypeService } from "../../mail/dialogs/add-send-message/add-send-message.service";
export interface PeriodicElement {
  id: number;
  username: string;
  bike: string;
  city: string;
  date: string;
  price: number;
  codes: number;
}

@Component({
  selector: "e-commerce-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceReportComponent implements OnInit {
  // dataSource: FilesDataSource | null;
  dataSource: MatTableDataSource<any>;
  displayedColumns = [
    "select",
    "id",
    "username",
    "city",
    "bike",
    "reports",
    "reported",
    "ride",
    "type",
    "action"
  ];
  selection = new SelectionModel<PeriodicElement>(true, []);
  reportData: any;
  searchTerm: string;
  bikeBrands: any;
  selectedCity: string;
  selectedDate: string;
  selectedRide: number;
  rideDetails: any;

  @ViewChild("reportCitySearch", { static: true })
  private reportCitySearchElementRef: ElementRef;
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

  constructor(
    private _ecommerceReportsService: EcommerceReportsService,
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router,
    private _addsendmessageService: EcommerceAddUserReportTypeService,
    private datePipe: DatePipe
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.dataSource = new MatTableDataSource();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.reportCitySearchElementRef.nativeElement,
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

    this._ecommerceReportsService.getReports("userreportsfilter").then(data => {
      this.reportData = data.UserReports;
      this.dataSource.data = this.reportData;
      console.log(this.reportData);
    });
    this._ecommerceReportsService.getRides().then(data => {
      this.rideDetails = data.Rides;
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
  }
  previousReports(reports) {
    var reporttouserid = reports.ReportToUserID;
    var reportbyuserid = reports.ReportByUserID;
    localStorage.setItem("ReportToUserID", JSON.stringify(reporttouserid));
    localStorage.setItem("ReportByUserID", JSON.stringify(reportbyuserid));
    this.router.navigate(["/apps/e-commerce/previous-report"]);
  }
  addSendMessageDialog(): void {
    this.dialogRef = this.dialog.open(AddSendMessageDialog, {
      panelClass: "report-send-message",
      width: "700px"
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this._addsendmessageService.getUserReportTypes();
      }
      if (!response) {
        return;
      }
    });
  }
  modalDialog(product): void {
    this.dialogRef = this.dialog.open(ReportSendMessageComponent, {
      panelClass: "report-send-message",
      data: { sendValue: product }
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
  addDialog(): void {
    this.dialogRef = this.dialog.open(AddReportTypeComponent, {
      panelClass: "add-report-type"
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
          //  console.log('new Mail', formData.getRawValue());
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

  rideSelectionChange(event) {
    var url = "";
    if (this.selectedRide != undefined) {
      url = "userreportsfilter?RideID=" + this.selectedRide;
    }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      url = url + "&City=" + this.selectedCity;
    }
    if (this.selectedDate != undefined && this.selectedDate != "") {
      url = url + "&Date=" + this.selectedDate;
    }

    this._ecommerceReportsService.getReports(url).then(data => {
      this.dataSource.data = data.UserReports;
    });
  }
  citySelectionChange(event) {
    var url = "";
    if (this.selectedRide != undefined) {
      url = "userreportsfilter?RideID=" + this.selectedRide;
    }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      if (url == undefined || url == "") {
        url = "userreportsfilter?City=" + this.selectedCity;
      } else {
        url = url + "&City=" + this.selectedCity;
      }
    }
    if (this.selectedDate != undefined && this.selectedDate != "") {
      url = url + "&Date=" + this.selectedDate;
    }

    this._ecommerceReportsService.getReports(url).then(data => {
      this.dataSource.data = data.UserReports;
    });
  }
  dateSelectionChange() {
    this.selectedDate = this.datePipe.transform(
      this.selectedDate,
      "yyyy-MM-dd"
    );
    var url = "";
    if (this.selectedRide != undefined) {
      url = "userreportsfilter?RideID=" + this.selectedRide;
    }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      url = url + "&City=" + this.selectedCity;
    }
    if (this.selectedDate != undefined && this.selectedDate != "") {
      if (url == undefined || url == "") {
        url = "userreportsfilter?Date=" + this.selectedDate;
      } else {
        url = url + "&Date=" + this.selectedDate;
      }
    }

    this._ecommerceReportsService.getReports(url).then(data => {
      this.dataSource.data = data.UserReports;
    });
  }
  onImgError(event) {
    event.target.src = "assets/images/profile/default-avatar.png";
  }
  filterReportByName(event): void {
    if (this.searchTerm == undefined || this.searchTerm.length < 20) {
      //return;
      var url = "userreportsfilter?QueryString=" + this.searchTerm;
      this._ecommerceReportsService.getReports(url).then(data => {
        this.dataSource.data = data.UserReports;
      });
    }

    if (this.searchTerm == "" || this.searchTerm.length == 0) {
      this._ecommerceReportsService
        .getReports("userreportsfilter")
        .then(data => {
          this.reportData = data.UserReports;
          this.dataSource.data = this.reportData;
        });
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
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
}
