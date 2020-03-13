import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EcommerceReportsSendMessageService } from "./report-send-message.service";

@Component({
  selector: "report-send-message",
  templateUrl: "./report-send-message.component.html",
  styleUrls: ["./report-send-message.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ReportSendMessageComponent {
  showExtraToFields: boolean;
  composeForm: FormGroup;
  reportTypes: any;
  fromPage: any;
  message: any;
  reportsdata: any;

  /**
   * Constructor
   *
   * @param {MatDialogRef<ReportSendMessageComponent>} matDialogRef
   * @param _data
   */
  constructor(
    public matDialogRef: MatDialogRef<ReportSendMessageComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _sendMessageService: EcommerceReportsSendMessageService
  ) {
    // Set the defaults
    this.composeForm = this.createComposeForm();
    this.showExtraToFields = false;
    this.fromPage = _data.sendValue;
  }

  ngOnInit() {
    console.log(this.fromPage);
    this._sendMessageService.getUserReportTypes().then(data => {
      this.reportTypes = data.UserReportTypes;
    });
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
      UserID: new FormControl(""),
      Title: new FormControl(""),
      Message: new FormControl(""),
      ReportID: new FormControl(""),
      UserReportTypeID: new FormControl("")
    });
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  getData(report) {
    this.reportsdata = report;
    console.log(this.reportsdata);
    this.message = this.reportsdata.UserReportTypeMessage;
  }
  onSendMessageUser() {
    this.composeForm.value.UserID = this.fromPage.ReportToUserID;
    this.composeForm.value.Title = this.reportsdata.UserReportTypeTitle;
    this.composeForm.value.Message = this.reportsdata.UserReportTypeMessage;
    // this.composeForm.value.Action = this.fromPage.ReportToUserID;
    this.composeForm.value.ReportID = this.fromPage.ReportID;
    this.composeForm.value.UserReportTypeID = this.reportsdata.UserReportTypeID;
    console.log(this.composeForm.value);

    this._sendMessageService
      .sendMessageUer(this.composeForm.value)
      .then(data => {
        // Show the success message
        if (data.Status == 1) {
          alert("Message Sent Successfully");
          this.matDialogRef.close(true);
          //this._router.navigate(['apps/e-commerce/admin-users']);
        } else alert(data.Message);
      });
  }
}
