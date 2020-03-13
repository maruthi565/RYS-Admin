import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { EcommerceSendMessageService } from "./send-message.service";
import { Router } from "@angular/router";
import { AnimationQueryMetadata } from "@angular/animations";

@Component({
  selector: "e-commerce-send-message",
  templateUrl: "./send-message.component.html",
  styleUrls: ["./send-message.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceSendMessageComponent {
  showExtraToFields: boolean;
  sendMessageForm: FormGroup;
  check1 = true;
  check2 = false;
  check3 = true;
  userinfo: any;
  userslist: any;
  result: any;
  usersids: any[];

  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceSendMessageComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private _sendMesageService: EcommerceSendMessageService,
    private _router: Router
  ) {
    // Set the defaults
    this.sendMessageForm = this.createComposeForm();
    this.showExtraToFields = false;
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
      Message: new FormControl("")
    });
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem("SendMessageUser"));
    this.result = this.userinfo.map(a => a.FirstName);
    this.usersids = this.userinfo.map(b => b.UserID);
    console.log(this.result);
    console.log(this.usersids);
  }
  OnSendMessage() {
    if (this.sendMessageForm.value.Message == "") {
      alert("Please enter your message");
    } else {
      var messageJson = {
        UserID: this.usersids,
        Message: this.sendMessageForm.value.Message
      };
      this._sendMesageService.createMessage(messageJson).then(data => {
        if (data.success == 1) {
          alert("Message Sent Successfully");
          this._router.navigate(["apps/e-commerce/users"]);
          //this.matDialogRef.close();
        } else alert(data.Message);
      });
    }
  }
}
