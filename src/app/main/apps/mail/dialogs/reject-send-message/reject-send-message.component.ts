import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EcommerceSendRejectMessageService } from "./reject-send-message.service";

@Component({
  selector: "reject-send-message",
  templateUrl: "./reject-send-message.component.html",
  styleUrls: ["./reject-send-message.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RejectSendMessageDialog {
  showExtraToFields: boolean;
  sendFeedbackForm: FormGroup;
  sendRejectForm:FormGroup;
  fromPage: any[];
  result: any;
  usersids: any[];

  /**
   * Constructor
   *
   * @param {MatDialogRef<RejectSendMessageDialog>} matDialogRef
   * @param _data
   */
  constructor(
    private _sendRejectMessageService: EcommerceSendRejectMessageService,
    public matDialogRef: MatDialogRef<RejectSendMessageDialog>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    // Set the defaults
    this.sendFeedbackForm = this.createComposeForm();
    this.showExtraToFields = false;
    this.fromPage = _data.rejectrequestValue;
    //console.log(this.fromPage);
    let names = this.fromPage.map(a => a.FirstName);
    this.usersids = this.fromPage.map(b => b.UserID);
    this.result = names.join(", ");
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
      Message: new FormControl("", Validators.required)
    });
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  onsendReject() {
    if (this.sendFeedbackForm.value.Message == "") {
      alert("Please enter your message");
    } else {
      var rejectJson = {
        UserID: this.usersids,
        Message: this.sendFeedbackForm.value.Message
      };
      this._sendRejectMessageService
        .sendRejectMessage(rejectJson)
        .then(data => {
          if (data.success == 1) {
            alert("Message Sent Successfully");
            this.matDialogRef.close(true);
          } else alert(data.Message);
        });
    }
  }
}
