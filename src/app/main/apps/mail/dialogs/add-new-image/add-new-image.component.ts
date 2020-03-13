import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';

@Component({
    selector: 'add-new-image',
    templateUrl: './add-new-image.component.html',
    styleUrls: ['./add-new-image.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddNewImageComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    Checked = true;
    isChecked = true;


    /**
     * Constructor
     *
     * @param {MatDialogRef<AddNewImageComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AddNewImageComponent>,
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
