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
import { BehaviorSubject, merge, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { FuseUtils } from "@fuse/utils";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { RequestDialogComponent } from "../request-dialog/request-dialog.component";
import { FormGroup } from "@angular/forms";
import { AddFeedbackTypeComponent } from "../../mail/dialogs/add-feedback-type/add-feedback-type.component";
import { FeedbackSendMessageComponent } from "../../mail/dialogs/feedback-send-message/feedback-send-message.component";
import { FeedbackService } from "./feedback.service";
import * as XLSX from "xlsx";
import { DatePipe } from "@angular/common";
import { MapsAPILoader } from "@agm/core";
import { EcommerceAddFeedbackService } from "../../mail/dialogs/add-feedback-type/add-feedback-type.service";

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
  selector: "e-commerce-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceFeedbackComponent implements OnInit {
  // feedbackData: FilesDataSource | null;
  // dataSource: FilesDataSource | null;
  dataSource: MatTableDataSource<any>;
  displayedColumns = [
    "select",
    "id",
    "username",
    "city",
    "rating",
    "ride",
    "about"
  ];
  selection = new SelectionModel<PeriodicElement>(true, []);
  searchTerm: string;
  feedbackData: any;
  selectedDate: string;
  selectedCity: string;

  @ViewChild("feedbackCitySearch", { static: true })
  private feedbackCitySearchElementRef: ElementRef;

  @ViewChild("TABLE", { static: true }) table: ElementRef;

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
    private _feedbackService: FeedbackService,
    private _addFeedbackService: EcommerceAddFeedbackService,
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
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
        this.feedbackCitySearchElementRef.nativeElement,
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
    this._feedbackService.getFeedback("feedback").then(data => {
      this.feedbackData = data.Feedback;
      this.dataSource.data = this.feedbackData;
    });

    // this.dataSource = new FilesDataSource(this._feedbackService, this.paginator, this.sort);
    // console.log(this.dataSource);
    // fromEvent(this.filter.nativeElement, 'keyup')
    //     .pipe(
    //         takeUntil(this._unsubscribeAll),
    //         debounceTime(150),
    //         distinctUntilChanged()
    //     )
    //     .subscribe(() => {
    //         if (!this.dataSource) {
    //             return;
    //         }

    //         this.dataSource.filter = this.filter.nativeElement.value;
    //     });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
  }
  modalDialog(): void {
    console.log(this.selection.selected);
    let feedbackrow = this.selection.selected;
    //localStorage.setItem("FeedbackUser", JSON.stringify(feedbackrow));
    this.dialogRef = this.dialog.open(FeedbackSendMessageComponent, {
      panelClass: "feedback-send-message",
      data: { feedbackrequestValue: feedbackrow }
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
    });
  }
  onImgError(event) {
    event.target.src = "assets/images/profile/default-avatar.png";
  }
  keyPress(event: any) {
    console.log(event.target.value);

    if (event && event.target.value == "") {
      this._feedbackService.getFeedback("feedback").then(data => {
        this.feedbackData = data.Feedback;
        this.dataSource.data = this.feedbackData;
      });
    }
  }
  addDialog(): void {
    this.dialogRef = this.dialog.open(AddFeedbackTypeComponent, {
      panelClass: "add-feedback-type"
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this._addFeedbackService.getFeedbackTypes();
      }
      if (!response) {
        return;
      }
    });
  }
  citySelectionChange(event) {
    var url = "";
    // if(this.selectedBrand != undefined ){
    //     url = "adminadsfilter?Brand=" + this.selectedBrand;
    // }

    // if(this.selectedCity == ''){
    //     this._feedbackService.getFeedback('feedback')
    // .then(data => {
    //     this.feedbackData = data.Feedback
    //       this.dataSource.data =this.feedbackData;
    // });
    // }

    if (this.selectedCity != undefined && this.selectedCity != "") {
      if (url == undefined || url == "") {
        url = "feedbackfilter?City=" + this.selectedCity;
      }
      // else{
      //     url = url + "?City="+ this.selectedCity;

      // }
    }
    if (this.selectedDate != undefined && this.selectedDate != "") {
      url = url + "&Date=" + this.selectedDate;
    }

    this._feedbackService.getFeedback(url).then(data => {
      this.dataSource.data = data.FeedBacks;
    });
  }
  dateSelectionChange() {
    this.selectedDate = this.datePipe.transform(
      this.selectedDate,
      "yyyy-MM-dd"
    );
    var url = "";
    // if(this.selectedBrand != undefined ){
    //     url = "adminadsfilter?Brand=" + this.selectedBrand;
    // }
    if (this.selectedCity != undefined && this.selectedCity != "") {
      url = "feedbackfilter?City=" + this.selectedCity;
    }
    if (this.selectedDate != undefined && this.selectedDate != "") {
      if (url == undefined || url == "") {
        url = "feedbackfilter?Date=" + this.selectedDate;
      } else {
        url = url + "&Date=" + this.selectedDate;
      }
    }

    this._feedbackService.getFeedback(url).then(data => {
      this.dataSource.data = data.FeedBacks;
    });
  }
  filterFeedbackByName(event): void {
    if (this.searchTerm == undefined || this.searchTerm.length < 3) {
      //return;
      var url = "feedbackfilter?QueryString=" + this.searchTerm;
      this._feedbackService.getFeedback(url).then(data => {
        this.dataSource.data = data.FeedBacks;
      });
    }

    if (this.searchTerm == "" || this.searchTerm.length == 0) {
      this._feedbackService.getFeedback("feedback").then(data => {
        this.feedbackData = data.Feedback;
        this.dataSource.data = this.feedbackData;
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
    XLSX.writeFile(wb, `Feedback_export_${new Date().getTime()}.xlsx`);
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
}
