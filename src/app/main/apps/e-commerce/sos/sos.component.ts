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
import { FormGroup, FormControl } from "@angular/forms";
import { AddBikeBrandComponent } from "../../mail/dialogs/add-bike-brand/add-bike-brand.component";
import { SosHomeRideDialogComponent } from "../../mail/dialogs/sos-ride/sos-ride.component";
import { SOSActivityService } from "./sos.service";
import * as XLSX from "xlsx";
import { MapsAPILoader } from "@agm/core";
import { FeedbackSendMessageComponent } from "../../mail/dialogs/feedback-send-message/feedback-send-message.component";
import { SOSSendMessageComponent } from "../../mail/dialogs/sos-send-message/sos-send-message.component";

@Component({
  selector: "e-commerce-sos",
  templateUrl: "./sos.component.html",
  styleUrls: ["./sos.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceSosComponent {
  selected = new FormControl(0);
  dataSource2: MatTableDataSource<any>;
  dataSource: MatTableDataSource<any>;

  // dataSource: FilesDataSource | null;
  // displayedColumns = ['select', 'id', 'created', 'name', 'location', 'date', 'invite', 'paid', 'invites', 'participants', 'action'];
  displayedColumns = ["select", "position", "name", "type", "used"];
  displayedColumns2 = ["select", "position", "name", "type", "used"];
  selection2 = new SelectionModel<Element2>(true, []);

  selection = new SelectionModel<Element>(true, []);
  Checked = true;
  gethomeactivity: any;
  getrideactivity: any;
  bikeBrands: any;
  selectedBrand: string;
  selectedCity: string;
  searchTerm: string;
  infoboxescount: any;

  @ViewChild("SOSCitySearch", { static: true })
  private sosCitySearchElementRef: ElementRef;
  @ViewChild("TABLE", { static: true }) table: ElementRef;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  @ViewChild("filter", { static: true })
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;
  dialogRef: any;

  constructor(
    private _ecommerceProductsService: EcommerceProductsService,
    private _sosactivity: SOSActivityService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.dataSource = new MatTableDataSource();
    // this.dataSource= new MatTableDataSource(this.gethomeactivity);
    this.dataSource2 = new MatTableDataSource();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit() {
    this._sosactivity.getInfoBoxes().then(data => {
      this.infoboxescount = data;
    });
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.sosCitySearchElementRef.nativeElement,
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

    this._sosactivity.getHomeSOSActivity("sosactivity?Type=0").then(data => {
      this.gethomeactivity = data.SOSActivities;
      this.dataSource.data = this.gethomeactivity;
      let length = this.dataSource.data.length;
      console.log(length);
      this.cdr.detectChanges();
    });
    this._sosactivity.getRideSOSActivity("sosactivity?Type=1").then(data => {
      this.getrideactivity = data.SOSActivities;
      this.dataSource2.data = this.getrideactivity;
      this.cdr.detectChanges();
    });
    this._sosactivity.getBikeBrands().then(data => {
      this.bikeBrands = data.BikeBrands;
    });
  }
  /**
   * On init
   */
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
    this.dataSource2.paginator = this.paginator.toArray()[1];
    this.dataSource2.sort = this.sort.toArray()[1];
  }
  modalDialog(): void {
    console.log(this.selection.selected);
    let sosrow = this.selection.selected;
    //localStorage.setItem("FeedbackUser", JSON.stringify(feedbackrow));
    this.dialogRef = this.dialog.open(SOSSendMessageComponent, {
      panelClass: "sos-send-message",
      data: { sosrequestValue: sosrow }
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
    });
  }
  brandSelectionChange(event) {
    var url = "";
    if (this.selected.value == 0) {
      if (this.selectedBrand != undefined) {
        url = "sosfilter?HomeOrRide=0&BrandID=" + this.selectedBrand;
      }
      if (this.selectedCity != undefined && this.selectedCity != "") {
        url = url + "&City=" + this.selectedCity;
      }
    }
    if (this.selected.value == 1) {
      if (this.selectedBrand != undefined) {
        url = "sosfilter?HomeOrRide=1&BrandID=" + this.selectedBrand;
      }
      if (this.selectedCity != undefined && this.selectedCity != "") {
        url = url + "&City=" + this.selectedCity;
      }
    }
    this._sosactivity.getHomeSOSActivity(url).then(data => {
      if (this.selected.value == 0) {
        this.dataSource.data = data.SOSActivity;
      }
      if (this.selected.value == 1) {
        this.dataSource2.data = data.SOSActivity;
      }
    });
  }
  citySelectionChange(event) {
    var url = "";
    if (this.selected.value == 0) {
      if (this.selectedBrand != undefined) {
        url = "sosfilter?HomeOrRide=0&BrandID=" + this.selectedBrand;
      }
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "sosfilter?HomeOrRide=0&City=" + this.selectedCity;
        } else {
          url = url + "&City=" + this.selectedCity;
        }
      }
    }
    if (this.selected.value == 1) {
      if (this.selectedBrand != undefined) {
        url = "sosfilter?HomeOrRide=1&BrandID=" + this.selectedBrand;
      }
      if (this.selectedCity != undefined && this.selectedCity != "") {
        if (url == undefined || url == "") {
          url = "sosfilter?HomeOrRide=1&City=" + this.selectedCity;
        } else {
          url = url + "&City=" + this.selectedCity;
        }
      }
    }

    this._sosactivity.getHomeSOSActivity(url).then(data => {
      if (this.selected.value == 0) {
        this.dataSource.data = data.SOSActivity;
      }
      if (this.selected.value == 1) {
        this.dataSource2.data = data.SOSActivity;
      }
    });
  }
  filterSOSByName(event): void {
    if (this.selected.value == 0) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url = "sosfilter?HomeOrRide=0&QueryString=" + this.searchTerm;
        this._sosactivity.getHomeSOSActivity(url).then(data => {
          this.dataSource.data = data.SOSActivity;
          console.log(this.dataSource.data);
        });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._sosactivity
          .getHomeSOSActivity("sosactivity?Type=0")
          .then(data => {
            this.gethomeactivity = data.SOSActivities;
            this.dataSource.data = this.gethomeactivity;
          });
      }
    } else if (this.selected.value == 1) {
      if (this.searchTerm == undefined || this.searchTerm.length < 4) {
        //return;
        var url = "sosfilter?HomeOrRide=1&QueryString=" + this.searchTerm;
        this._sosactivity.getRideSOSActivity(url).then(data => {
          this.dataSource2.data = data.SOSActivity;
          console.log(this.dataSource2.data);
        });
      }

      if (this.searchTerm == "" || this.searchTerm.length == 0) {
        this._sosactivity
          .getRideSOSActivity("sosactivity?Type=1")
          .then(data => {
            this.getrideactivity = data.SOSActivities;
            this.dataSource2.data = this.getrideactivity;
          });
      }
    }
  }
  exportToExcel() {
    if (this.selected.value == 1) {
      var selectedRows2 = this.selection2.selected;
      console.log(selectedRows2);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedRows2);
      //const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      //const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(wb, `Ride_SOS_export_${new Date().getTime()}.xlsx`);
    }
    if (this.selected.value == 0) {
      var selectedRows = this.selection.selected;
      console.log(selectedRows);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedRows);
      //const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      //const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(wb, `Home_SOS_export_${new Date().getTime()}.xlsx`);
    }
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
  view_Home_RideDialog(element, activity): void {
    element.fromActivity = activity;
    this.dialogRef = this.dialog.open(SosHomeRideDialogComponent, {
      panelClass: "sos-ride",
      width: "470px",
      data: { pageValue: element }
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
  onImgError(event) {
    event.target.src = "assets/images/profile/default-avatar.png";
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

        // !this.dataSource3.paginator ? this.dataSource3.paginator = this.paginator3 : null;
      }
    });
  }
}

export interface Element {
  name: string;
  position: number;
  city: string;
  bikes: string;
  ratings: number;
  rides: number;
  type: number;
  used: number;
}
export interface Element2 {
  name: string;
  position: number;
  city: string;
  bikes: string;
  ratings: number;
  rides: number;
  type: number;
  used: number;
}
const ELEMENT_DATA: Element[] = [
  {
    position: 1,
    name: "wayne",
    city: "Bangalore",
    bikes: "Ducati,Kawasaki",
    ratings: 3,
    rides: 7,
    type: 8,
    used: 6
  },
  {
    position: 2,
    name: "Robert",
    city: "Hyderabad",
    bikes: "Ducati",
    ratings: 3,
    rides: 6,
    type: 8,
    used: 9
  }
];
const ELEMENT_DATA2: Element2[] = [
  {
    position: 1,
    name: "wayne",
    city: "Bangalore",
    bikes: "Ducati,Kawasaki",
    ratings: 3,
    rides: 7,
    type: 8,
    used: 6
  },
  {
    position: 2,
    name: "Robert",
    city: "Hyderabad",
    bikes: "Ducati",
    ratings: 3,
    rides: 6,
    type: 8,
    used: 9
  }
];
