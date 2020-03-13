import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";
import { EcommerceAddFeedbackService } from "./add-feedback-type.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "add-feedback-type",
  templateUrl: "./add-feedback-type.component.html",
  styleUrls: ["./add-feedback-type.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AddFeedbackTypeComponent {
  showExtraToFields: boolean;
  feedbackForm: FormGroup;
  feedbackTypesList: any[];
  private _unsubscribeAll: Subject<any>;
  length: number;
  showPlus = true;
  showDelete = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  data = {
    FeedbackTypes: [
      {
        TypeID: "",
        TypeName: ""
      }
    ]
  };
  /**
   * Constructor
   *
   * @param {MatDialogRef<AddFeedbackTypeComponent>} matDialogRef
   * @param _data
   */
  constructor(
    public matDialogRef: MatDialogRef<AddFeedbackTypeComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ecommercefeedbackService: EcommerceAddFeedbackService,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    this.feedbackTypesList = [];
    this.feedbackForm = this.fb.group({
      FeedbackTypes: this.fb.array([])
    });

    this.feedbackForm = this.createComposeForm();
    this.setFeedbackType();

    this.showExtraToFields = false;
    this._unsubscribeAll = new Subject();
  }
  ngOnInit() {
    // this._ecommercefeedbackService.onFeedbackTypeChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(feedbackTypesList => {
    //     this.feedbackTypesList = feedbackTypesList;
    //     this.length = this.feedbackTypesList.length;
    //
    //     for (var i = 0; i < this.feedbackTypesList.length; i++) {
    //       this.setFeedbackType();
    //     }
    //     this.feedbackForm.patchValue({
    //       FeedbackTypes: this.feedbackTypesList
    //     });
    //   });

    this._ecommercefeedbackService.getFeedbackTypes().then(feedbackData => {
      this.length = feedbackData.FeedbackTypes.length;
      if (this.length >= 6) {
        this.showPlus = false;
      }
      for (var i = 1; i < feedbackData.FeedbackTypes.length; i++) {
        this.setFeedbackType();
        this.showDelete = true;
      }

      this.feedbackForm.patchValue({
        FeedbackTypes: JSON.parse(JSON.stringify(feedbackData.FeedbackTypes))
      });
      console.log(this.feedbackForm.value);
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
      FeedbackTypes: this.fb.array([])
      // new FormArray([new FormControl({ TypeName: "" })])
    });
  }
  setFeedbackType() {
    let control = <FormArray>this.feedbackForm.controls.FeedbackTypes;
    this.data.FeedbackTypes.forEach(x => {
      control.push(
        this.fb.group({
          TypeID: x.TypeID,
          TypeName: x.TypeName
        })
      );
      control.disable();
    });
  }
  onAddFeedbackType() {
    this.showDelete = false;
    let control = <FormArray>this.feedbackForm.controls.FeedbackTypes;
    control.push(
      this.fb.group({
        TypeID: "",
        TypeName: ""
      })
    );
  }
  onKey() {
    this.showPlus = false;
  }

  /**
   * Delete Feedback
   *
   * @param feedback
   */

  feedbackindexSelected: any;
  deleteFeedbackType(feedback, index): void {
    this.showPlus = true;
    if (this.length >= 6) {
      this.showPlus = false;
    }
    console.log(feedback);
    this.feedbackindexSelected = index;
    if (feedback.TypeID != "" && feedback.TypeName != "") {
      this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage =
        "Are you sure you want to delete?";

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._ecommercefeedbackService
            .deleteFeedback(feedback.TypeID)
            .then(data => {
              if (data.Status == 1) {
                alert(data.Message);
                console.log("index " + this.feedbackindexSelected);
                this.deleteFeedBackTypes();
              } else alert(data.Message);
            });
        }
        this.confirmDialogRef = null;
      });
    } else {
      this.deleteFeedBackTypes();
    }
  }

  deleteFeedBackTypes() {
    let control = <FormArray>this.feedbackForm.controls.FeedbackTypes;
    control.removeAt(this.feedbackindexSelected);
  }
  onAddFeedback() {
    console.log(this.length);
    var data = this.feedbackForm.value.FeedbackTypes;
    var result = data[0];
    this._ecommercefeedbackService.addFeedbackType(result).then(data => {
      // Show the success message
      if (data.Status == 1) {
        //let result = data.VendorDetails;
        alert("FeedbackType added successfully");
        this.matDialogRef.close(true);
      } else alert(data.Message);
    });
  }

  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
}
