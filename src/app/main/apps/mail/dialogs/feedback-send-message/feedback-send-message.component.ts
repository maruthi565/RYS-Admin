import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EcommerceSendFeedbackMessageService } from "./feedback-send-message.service";

@Component({
  selector: "feedback-send-message",
  templateUrl: "./feedback-send-message.component.html",
  styleUrls: ["./feedback-send-message.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FeedbackSendMessageComponent {
  showExtraToFields: boolean;
  sendFeedbackForm: FormGroup;
  fromPage: any[];
  result: any;
  usersids: any[];

  /**
   * Constructor
   *
   * @param {MatDialogRef<FeedbackSendMessageComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private _sendFeedbackMessageService: EcommerceSendFeedbackMessageService,
    public matDialogRef: MatDialogRef<FeedbackSendMessageComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    // Set the defaults
    this.sendFeedbackForm = this.createComposeForm();
    this.showExtraToFields = false;
    this.fromPage = _data.feedbackrequestValue;
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
  onsendFeedBack() {
    if (this.sendFeedbackForm.value.Message == "") {
      alert("Please enter your message");
    } else {
      var feedbackJson = {
        UserID: this.usersids,
        Message: this.sendFeedbackForm.value.Message
      };
      this._sendFeedbackMessageService
        .sendFeedbackMessage(feedbackJson)
        .then(data => {
          if (data.success == 1) {
            alert("Message Sent Successfully");
            this.matDialogRef.close(true);
          } else alert(data.Message);
        });
    }
  }
}
