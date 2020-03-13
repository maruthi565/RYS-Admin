import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EcommerceSendSOSMessageService } from "./sos-send-message.service";

@Component({
  selector: "sos-send-message",
  templateUrl: "./sos-send-message.component.html",
  styleUrls: ["./sos-send-message.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SOSSendMessageComponent {
  showExtraToFields: boolean;
  sendSOSForm: FormGroup;
  fromPage: any[];
  result: any;
  usersids: any[];

  /**
   * Constructor
   *
   * @param {MatDialogRef<SOSSendMessageComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private _sendSOSMessageService: EcommerceSendSOSMessageService,
    public sosmatDialogRef: MatDialogRef<SOSSendMessageComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    // Set the defaults
    this.sendSOSForm = this.createComposeForm();
    this.showExtraToFields = false;
    this.fromPage = _data.sosrequestValue;
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
  onsendSOS() {
    if (this.sendSOSForm.value.Message == "") {
      alert("Please enter your message");
    } else if (this.sendSOSForm.value.Message != "") {
      var sosJson = {
        UserID: this.usersids,
        Message: this.sendSOSForm.value.Message
      };
      this._sendSOSMessageService.sendSOSMessage(sosJson).then(data => {
        if (data.success == 1) {
          alert("Notification Sent Successfully");
          this.sosmatDialogRef.close(true);
        } else alert(data.Message);
        this.sosmatDialogRef.close(true);
      });
    }
  }
}
