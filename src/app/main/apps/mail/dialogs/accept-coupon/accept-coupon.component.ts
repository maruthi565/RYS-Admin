import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'accept-coupon',
    templateUrl: './accept-coupon.component.html',
    styleUrls: ['./accept-coupon.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AcceptCouponComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AcceptCouponComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AcceptCouponComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        // Set the defaults
        this.composeForm = this.createComposeForm();
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
            from: new FormControl({
                value: 'johndoe@creapond.com',
                disabled: true
            }),
            to: new FormControl(''),
            cc: new FormControl(''),
            bcc: new FormControl(''),
            subject: new FormControl(''),
            message: new FormControl('')
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
}
