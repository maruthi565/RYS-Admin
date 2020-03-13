import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'accept-product',
    templateUrl: './accept-product.component.html',
    styleUrls: ['./accept-product.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AcceptProductComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AcceptProductComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AcceptProductComponent>,
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
