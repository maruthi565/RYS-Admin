import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';

@Component({
    selector: 'view-ads-posted',
    templateUrl: './view-ads-posted.component.html',
    styleUrls: ['./view-ads-posted.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewAdsPostedComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    Checked = true;
    isChecked = true;
    fromPage: any;


    /**
     * Constructor
     *
     * @param {MatDialogRef<ViewAdsPostedComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<ViewAdsPostedComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        // Set the defaults
        this.composeForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.AdsPageValue;
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
            brand: new FormControl('')

        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

}
