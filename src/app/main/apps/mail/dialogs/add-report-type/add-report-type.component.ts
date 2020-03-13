import {
  Component,
  Inject,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from "@angular/core";
import { FormControl, FormGroup, FormArray, FormBuilder } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";
import { EcommerceAddReportTypeService } from "./add-report-type.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "add-report-type",
  templateUrl: "./add-report-type.component.html",
  styleUrls: ["./add-report-type.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AddReportTypeComponent implements OnInit, OnDestroy {
  showExtraToFields: boolean;
  reportForm: FormGroup;
  reportTypesList: any[];
  private _unsubscribeAll: Subject<any>;
  length: number;
  showPlus = true;
  showDelete = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  data = {
    ReportTypes: [
      {
        ReportTypeID: "",
        ReportTypeName: ""
      }
    ]
  };

  /**
   * Constructor
   *
   * @param {MatDialogRef<AddReportTypeComponent>} matDialogRef
   * @param _data
   */
  constructor(
    public matDialogRef: MatDialogRef<AddReportTypeComponent>,
    private _addReportTypeService: EcommerceAddReportTypeService,
    private _router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    this.reportTypesList = [];
    this.reportForm = this.fb.group({
      ReportTypes: this.fb.array([])
    });
    this.reportForm = this.createComposeForm();
    this.setReportType();
    this.showExtraToFields = false;
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    // console.log(this.reportTypesList);
    // this._addReportTypeService.onReportTypeChanged
    // .pipe(takeUntil(this._unsubscribeAll))
    // .subscribe(reportTypesList => {

    //     this.reportTypesList = reportTypesList;
    //     this.length = this.reportTypesList.length;

    //       for(var i = 0 ; i < this.reportTypesList.length ; i++ ){
    //         this.setReportType();
    //      }
    //     this.reportForm.patchValue({
    //       ReportTypes : this.reportTypesList
    //     })

    // });
    this._addReportTypeService.getTypes().then(reporttypeData => {
      for (var i = 1; i < reporttypeData.ReportTypes.length; i++) {
        this.setReportType();
        this.showDelete = true;
      }

      this.reportForm.patchValue({
        ReportTypes: JSON.parse(JSON.stringify(reporttypeData.ReportTypes))
      });

      console.log(this.reportForm.value);
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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create compose form
   *
   * @returns {FormGroup}
   */
  createComposeForm(): FormGroup {
    return new FormGroup({
      ReportTypes: this.fb.array([])
      // new FormArray([
      //     new FormControl({ReportTypeName:''})
      // ])
    });
  }
  setReportType() {
    let control = <FormArray>this.reportForm.controls.ReportTypes;
    this.data.ReportTypes.forEach(x => {
      control.push(
        this.fb.group({
          ReportTypeID: x.ReportTypeID,
          ReportTypeName: x.ReportTypeName
        })
      );
      control.disable();
    });
  }
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  deleteReportTypes(index) {
    this.data.ReportTypes.splice(index);
  }
  onAddReportType() {
    this.showDelete = false;
    let control = <FormArray>this.reportForm.controls.ReportTypes;
    control.push(
      this.fb.group({
        ReportTypeID: "",
        ReportTypeName: ""
      })
    );
  }

  onKey() {
    this.showPlus = false;
  }

  reportindexSelected: any;
  deleteReportType(reporttype, index): void {
    console.log(reporttype);
    this.reportindexSelected = index;
    if (reporttype.ReportTypeID != "" && reporttype.ReportTypeName != "") {
      this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage =
        "Are you sure you want to delete?";

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._addReportTypeService
            .deleteReportType(reporttype.ReportTypeID)
            .then(data => {
              if (data.Status == 1) {
                alert(data.Message);
                console.log("index " + this.reportindexSelected);
                this.deleteTypes();
              } else alert(data.Message);
            });
        }
        this.confirmDialogRef = null;
      });
    } else {
      this.deleteTypes();
    }
  }
  deleteTypes() {
    let control = <FormArray>this.reportForm.controls.ReportTypes;
    control.removeAt(this.reportindexSelected);
  }
  onAddReport() {
    console.log(this.length);
    var data = this.reportForm.value.ReportTypes;
    var result = data[0];
    console.log(result);
    this._addReportTypeService.addReportType(result).then(data => {
      if (data.Status == 1) {
        alert("ReportType added successfully");
        this.matDialogRef.close(true);
      } else alert(data.Message);
    });
  }
}
