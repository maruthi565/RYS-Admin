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

//import { EcommerceProductsService } from 'app/main/apps/e-commerce/products/products.service';
import { takeUntil } from "rxjs/internal/operators";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { RequestDialogComponent } from "../request-dialog/request-dialog.component";
import { RidesService } from "app/main/apps/e-commerce/rides/rides.service";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import * as XLSX from "xlsx";
import { EcommerceUserPostedService } from "../user-posted/user-posted.service";
import { DatePipe } from "@angular/common";
import { MapsAPILoader } from "@agm/core";

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
  selector: "e-commerce-rides",
  templateUrl: "./rides.component.html",
  styleUrls: ["./rides.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceRidesComponent implements OnInit {
  // ridesData: FilesDataSource | null;
  //dataSource: FilesDataSource | null;
  dataSource: MatTableDataSource<any>;
  // dataSource : MatTableDataSource<any>;
  displayedColumns = [
    "select",
    "id",
    "created",
    "name",
    "location",
    "date",
    "invite",
    "paid",
    "invites",
    "participants",
    "action"
  ];
  selection = new SelectionModel<PeriodicElement>(true, []);
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  adminUserID: any;
  ridesData: any[];
  searchTerm: string;
  infocountboxes: any;
  totalkms: any;
  bikeBrands: any;
  selectedBrand: any;
  selectedDate: string;
  totalhours: any;
  selectedCity: string;

  ridecitieslist: any;

  @ViewChild("TABLE", { static: true }) table: ElementRef;

  @ViewChild("rideCitySearch", { static: true })
  private rideCitySearchElementRef: ElementRef;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  // @ViewChild(MatPaginator, { static: true })
  // paginator: MatPaginator;

  // @ViewChild(MatSort, { static: true })
  // sort: MatSort;

  @ViewChild("filter", { static: true })
  filter: ElementRef;
  ridesrefresh: Subject<any> = new Subject();

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _ridesService: RidesService,
    private _userpostedService: EcommerceUserPostedService,
    //private _ecommerceProductsService: EcommerceProductsService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private router: Router
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
        this.rideCitySearchElementRef.nativeElement,
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
    this._ridesService.getInfoBoxes().then(data => {
      this.infocountboxes = data.UserReports;
      console.log(this.infocountboxes);
      var kms = data.UserReports[0].TotalNumberofKMS;
      this.totalkms = Math.trunc(kms);
      var hours = data.UserReports[0].TotalRidingHours;
      this.totalhours = Math.trunc(hours);
      console.log(this.totalhours);
    });

    /**
     * Watch re-render-refresh for updating db
     */
    this.adminUserID = localStorage.getItem("AdminUserID");
    this.ridesrefresh.subscribe(updateDB => {
      if (updateDB) {
        //this._ridesService.getRides('rides');
        this._ridesService.getRides("rides").then(data => {
          this.ridesData = data.Rides;
          this.dataSource.data = this.ridesData;
        });
      }
    });

    this._ridesService.getRides("rides").then(data => {
      this.ridesData = data.Rides;
      this.dataSource.data = this.ridesData;
    });
    this._userpostedService.getBikeBrands().then(data => {
      this.bikeBrands = data.BikeBrands;
    });
    this._ridesService.getrideCities().then(data => {
      this.ridecitieslist = data.Cities;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
  }
  dateSelectionChange() {
    this.selectedDate = this.datePipe.transform(
      this.selectedDate,
      "yyyy-MM-dd"
    );
    var url = "";

    if (this.selectedDate != undefined && this.selectedDate != "") {
      if (url == undefined || url == "") {
        url = "ridesfilter?Date=" + this.selectedDate;
      }
    }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      if (url == undefined || url == "") {
        url = "ridesfilter?City=" + this.selectedCity;
      } else {
        url = url + "&City=" + this.selectedCity;
      }
    }

    this._ridesService.getRides(url).then(data => {
      this.dataSource.data = data.Rides;
    });
  }
  citySelectionChange(event) {
    var url = "";
    if (this.selectedCity != undefined && this.selectedCity != "") {
      if (url == undefined || url == "") {
        url = "ridesfilter?City=" + this.selectedCity;
      } else {
        url = url + "&City=" + this.selectedCity;
      }
      if (this.selectedDate != undefined && this.selectedDate != "") {
        url = url + "&Date=" + this.selectedDate;
      }
      this._ridesService.getRides(url).then(data => {
        this.dataSource.data = data.Rides;
      });
    }
  }
  brandSelectionChange(event) {
    var url = "";
    if (this.selectedBrand != undefined) {
      url = "ridesfilter?BrandID=" + this.selectedBrand;
    }
    // if(this.selectedCity != undefined && this.selectedCity != ''){
    //     url = url + "&City="+ this.selectedCity;
    // }
    // if(this.selectedDate != undefined && this.selectedDate != '' ){
    //     url = url  + "&Date="+ this.selectedDate
    // }

    this._ridesService.getRides(url).then(data => {
      this.dataSource.data = data.Rides;
    });
  }
  // applyFilter(filterValue: string) {
  //     filterValue = filterValue.trim();
  //     filterValue = filterValue.toLowerCase();
  //     this.dataSource.filter = filterValue;
  //   }
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
  setSelectedRide(row) {
    localStorage.setItem("selectedRideRow", JSON.stringify(row));
  }
  setSelected(product) {
    localStorage.setItem("selectedRideRow", JSON.stringify(product));

    this.router.navigate(["/apps/e-commerce/view-ride"]);
  }
  getUserProfile(ride) {
    localStorage.setItem("userID", ride.UserID);
    localStorage.setItem("fromProfileMenu", "Ride");
    this.router.navigate(["/apps/e-commerce/view-ride"]);
  }

  editRide(ride) {
    localStorage.setItem("selectedRideRow", JSON.stringify(ride));
    localStorage.setItem("fromProfileMenu", "Ride");
    this.router.navigate(["/apps/e-commerce/edit-ride"]);
  }
  filterRidesByTitle(event): void {
    if (this.searchTerm != undefined || this.searchTerm.length < 10) {
      var url = "ridesfilter?QueryString=" + this.searchTerm;
      this._ridesService.getRides(url).then(data => {
        this.dataSource.data = data.Rides;
      });
    }
    if (this.searchTerm == "" || this.searchTerm.length == 0) {
      this._ridesService.getRides("rides").then(data => {
        this.ridesData = data.Rides;
        this.dataSource.data = this.ridesData;
      });
    }
  }
  /**
   * Delete Ride
   *
   * @param ride
   */
  deleteRide(ride): void {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._ridesService.deleteRide(ride.RideID).then(data => {
          // Show the success message
          if (data.Status == 1) {
            //let result = data.VendorDetails;
            alert(data.Message);
            this.ridesrefresh.next(true);
          } else alert(data.Message);
        });
      }
      this.confirmDialogRef = null;
    });
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
    XLSX.writeFile(wb, `Rides_export_${new Date().getTime()}.xlsx`);
  }
}
