import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'e-commerce-request-dialog',
  templateUrl: './request-dialog.component.html'
})
export class RequestDialogComponent {
  message: '';
  cancelButtonText = 'Cancel';
  matDialogRef: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RequestDialogComponent>) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
    this.dialogRef.updateSize('500vw', '500vw');
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
