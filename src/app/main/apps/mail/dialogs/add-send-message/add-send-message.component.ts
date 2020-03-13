import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";
import { Subject } from "rxjs";
import { EcommerceAddUserReportTypeService } from "./add-send-message.service";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "add-send-message",
  templateUrl: "./add-send-message.component.html",
  styleUrls: ["./add-send-message.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AddSendMessageDialog {
  showExtraToFields: boolean;
  userReportForm: FormGroup;
  userreportTypesList: any[];
  private _unsubscribeAll: Subject<any>;
  length: number;
  showPlus = true;
  showDelete = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  data = {
    UserReportTypes: [
      {
        UserReportTypeID: "",
        UserReportTypeTitle: "",
        UserReportTypeMessage: ""
      }
    ]
  };
  /**
   * Constructor
   *
   * @param {MatDialogRef<AddSendMessageDialog>} matDialogRef
   * @param _data
   */
  constructor(
    public matDialogRef: MatDialogRef<AddSendMessageDialog>,
    private _adduserReportTypeService: EcommerceAddUserReportTypeService,
    private _router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    this.userreportTypesList = [];
    this.userReportForm = this.fb.group({
      UserReportTypes: this.fb.array([])
    });
    this.userReportForm = this.createComposeForm();
    this.setUserReportType();
    this.showExtraToFields = false;
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._adduserReportTypeService.getReportTypes().then(reportData => {
      for (var i = 1; i < reportData.UserReportTypes.length; i++) {
        this.setUserReportType();
        this.showDelete = true;
      }

      this.userReportForm.patchValue({
        UserReportTypes: JSON.parse(JSON.stringify(reportData.UserReportTypes))
      });
      console.log(this.userReportForm.value);
    });
    /* this._adduserReportTypeService.onUserReportTypeChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(userreportData => {
       

        for (var i = 0; i < userreportData.length; i++) {
          this.setUserReportType();
        }
        this.userReportForm.patchValue(
          JSON.parse(JSON.stringify(this.userreportTypesList))
        );
      }); */
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
      UserReportTypes: this.fb.array([])
    });
  }

  setUserReportType() {
    let control = <FormArray>this.userReportForm.controls.UserReportTypes;
    this.data.UserReportTypes.forEach(x => {
      control.push(
        this.fb.group({
          UserReportTypeID: x.UserReportTypeID,
          UserReportTypeTitle: x.UserReportTypeTitle,
          UserReportTypeMessage: x.UserReportTypeMessage
        })
      );
      control.disable();
    });
  }
  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }

  // deleteUserReportTypes(index) {
  //   this.data.UserReportTypes.splice(index);
  // }
  onAddUserReportType() {
    this.showDelete = false;
    let control = <FormArray>this.userReportForm.controls.UserReportTypes;
    control.push(
      this.fb.group({
        UserReportTypeID: "",
        UserReportTypeTitle: "",
        UserReportTypeMessage: ""
      })
    );
  }
  onKey() {
    this.showPlus = false;
  }
  /**
   * Delete Message
   *
   * @param message
   */

  indexSelected: any;
  deleteMessage(message, index): void {
    console.log(message);
    this.indexSelected = index;
    if (
      message.UserReportTypeID != "" &&
      message.UserReportTypeTitle != "" &&
      message.UserReportTypeMessage != ""
    ) {
      this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage =
        "Are you sure you want to delete?";

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._adduserReportTypeService
            .deleteSendMessage(message.UserReportTypeID)
            .then(data => {
              if (data.Status == 1) {
                alert(data.Message);
                console.log("index " + this.indexSelected);
                this.deleteReportTypes();
              } else alert(data.Message);
            });
        }
        this.confirmDialogRef = null;
      });
    } else {
      this.deleteReportTypes();
    }
  }
  deleteReportTypes() {
    let control = <FormArray>this.userReportForm.controls.UserReportTypes;
    control.removeAt(this.indexSelected);
  }
  // getReportTypes() {
  //   this._adduserReportTypeService.getReportTypes().then(reportData => {
  //     this.data.UserReportTypes.splice(this.indexSelected);
  //     this.userReportForm
  //       .get("UserReportTypes")
  //       .patchValue(reportData.UserReportTypes);
  //     console.log(this.userReportForm.value);
  //   });
  // }
  onAddUserReport() {
    console.log(this.length);
    var data = this.userReportForm.value.UserReportTypes;

    console.log(data);
    var result = data[0];
    console.log(result);
    this._adduserReportTypeService.addUserReportType(result).then(data => {
      // Show the success message
      if (data.Status == 1) {
        alert("UserReportType added successfully");
        this.matDialogRef.close(true);
      } else alert(data.Message);
    });
  }
}
