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

import { EcommerceProductsService } from "app/main/apps/e-commerce/products/products.service";
import { takeUntil } from "rxjs/internal/operators";
import { MatTableDataSource, MatDialog, MatDialogRef } from "@angular/material";
import { RequestDialogComponent } from "../request-dialog/request-dialog.component";
import { EventsService } from "./events.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";
import { DatePipe } from "@angular/common";
import { MapsAPILoader } from "@agm/core";
export interface PeriodicElement {
  id: number;
  organised: number;
  event: string;
  location: string;
  date: string;
  invites: number;
  going: number;
  paid: string;
  sold: number;
}

@Component({
  selector: "e-commerce-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceEventsComponent implements OnInit {
  //dataSource: FilesDataSource | null;
  // dataSource = new MatTableDataSource<any>();
  //eventData: FilesDataSource | null;
  //: FilesDataSource | null;
  dataSource: MatTableDataSource<any>;

  displayedColumns = [
    "select",
    "id",
    "organised",
    "event",
    "location",
    "date",
    "invites",
    "going",
    "paid",
    "sold",
    "action",
    "demand"
  ];
  ischecked = true;
  selection = new SelectionModel<PeriodicElement>(true, []);
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  eventsrefresh: Subject<any> = new Subject();
  searchTerm: string;
  infocountboxes: any;
  selectedDate: string;
  eventData: any;
  bikeBrands: any;
  selectedBrand: any;
  selectedCity: string;

  @ViewChild("eventsCitySearch", { static: true })
  private eventsCitySearchElementRef: ElementRef;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  // @ViewChild(MatPaginator, { static: true })
  // paginator: MatPaginator;

  // @ViewChild(MatSort, { static: true })
  // sort: MatSort;

  @ViewChild("filter", { static: true })
  filter: ElementRef;

  //refresh: Subject<any> = new Subject();

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _eventsService: EventsService,
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private datePipe: DatePipe,
    private router: Router
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.dataSource = new MatTableDataSource();
    /*  this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._eventsService.getEvents();
            }
        }); */
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
        this.eventsCitySearchElementRef.nativeElement,
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

    this._eventsService.getInfoBoxes().then(data => {
      this.infocountboxes = data.Events;
    });

    this.eventsrefresh.subscribe(updateDB => {
      if (updateDB) {
        this._eventsService.getEvents("eventsfilter").then(data => {
          this.eventData = data.Events;
          this.dataSource.data = this.eventData;
        });
      }
    });

    this._eventsService.getEvents("eventsfilter").then(data => {
      this.eventData = data.Events;
      this.dataSource.data = this.eventData;
    });
    this._eventsService.getBikeBrands().then(data => {
      this.bikeBrands = data.BikeBrands;
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
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
  setSelectedEvent(product) {
    localStorage.setItem("selectedEventRow", JSON.stringify(product));
    this.router.navigate(["/apps/e-commerce/view-event"]);
  }
  editEvent(event) {
    localStorage.setItem("editEventRow", JSON.stringify(event));
    // localStorage.setItem("fromProfileMenu", 'Ride');
    this.router.navigate(["/apps/e-commerce/edit-event"]);
  }
  brandSelectionChange(event) {
    var url = "";
    if (this.selectedBrand != undefined) {
      url = "eventsfilter?BrandID=" + this.selectedBrand;
    }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      url = url + "&City=" + this.selectedCity;
    }
    if (this.selectedDate != undefined && this.selectedDate != "") {
      url = url + "&Date=" + this.selectedDate;
    }

    this._eventsService.getEvents(url).then(data => {
      this.dataSource.data = data.Events;
    });
  }
  citySelectionChange(event) {
    var url = "";
    if (this.selectedBrand != undefined && this.selectedBrand != "") {
      if (url == undefined || url == "") {
        url = "eventsfilter?BrandID=" + this.selectedBrand;
      } else {
        url = url + "&BrandID=" + this.selectedBrand;
      }
    }
    // if(this.selectedBrand != undefined ){
    //     url = "userpostedbikesfilters?BrandID=" + this.selectedBrand;
    // }

    if (this.selectedCity == "") {
      this._eventsService.getEvents(url).then(data => {
        this.eventData = data.Events;
        this.dataSource.data = this.eventData;
      });
    }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      if (url == undefined || url == "") {
        url = "eventsfilter?City=" + this.selectedCity;
      } else {
        url = url + "&City=" + this.selectedCity;
      }
    }
    if (this.selectedDate != undefined && this.selectedDate != "") {
      url = url + "&Date=" + this.selectedDate;
    }

    this._eventsService.getEvents(url).then(data => {
      this.dataSource.data = data.Events;
    });
  }
  filterEventsByName(event): void {
    console.log("filter", event);
    if (this.searchTerm != undefined || this.searchTerm.length < 20) {
      var url = "eventsfilter?QueryString=" + this.searchTerm;
      console.log("url", url);
      this._eventsService.getEvents(url).then(data => {
        //if(data && data.Events.length >  0) {
        this.dataSource.data = data.Events || [];

        // }
      });
    }
    if (this.searchTerm == "" || this.searchTerm.length == 0) {
      this._eventsService.getEvents("eventsfilter").then(data => {
        //if(data && data.Events.length >  0) {
        this.eventData = data.Events || [];
        this.dataSource.data = this.eventData;
        //}
      });
    }
  }
  dateSelectionChange() {
    this.selectedDate = this.datePipe.transform(
      this.selectedDate,
      "yyyy-MM-dd"
    );
    var url = "";

    // if (this.selectedDate != undefined && this.selectedDate != "") {
    //   if (url == undefined || url == "") {
    //     url = "eventsfilter?Date=" + this.selectedDate;
    //   }
    // }

    if (this.selectedBrand != undefined) {
      url = "eventsfilter?BrandID=" + this.selectedBrand;
    }
    // if(this.selectedCity != undefined && this.selectedCity != ''){
    //     url = url + "&City="+ this.selectedCity;
    // }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      if (url == undefined || url == "") {
        url = "eventsfilter?City=" + this.selectedCity;
      } else {
        url = url + "&City=" + this.selectedCity;
      }
    }

    if (this.selectedDate != undefined && this.selectedDate != "") {
      if (url == undefined || url == "") {
        url = "eventsfilter?Date=" + this.selectedDate;
      } else {
        url = url + "&Date=" + this.selectedDate;
      }
    }
    this._eventsService.getEvents(url).then(data => {
      this.dataSource.data = data.Events;
    });
  }
  /**
   * Delete Event
   *
   * @param event
   */
  deleteEvent(event): void {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._eventsService.deleteEvent(event.EventID).then(data => {
          // Show the success message
          if (data.Status == 1) {
            //let result = data.VendorDetails;
            alert(data.Message);

            //this.getEvents();
            this.eventsrefresh.next(true);
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
    XLSX.writeFile(wb, `Events_export_${new Date().getTime()}.xlsx`);
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
}
