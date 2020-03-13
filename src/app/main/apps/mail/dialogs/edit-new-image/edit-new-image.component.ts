import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';

@Component({
    selector: 'edit-new-image',
    templateUrl: './edit-new-image.component.html',
    styleUrls: ['./edit-new-image.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditNewImageComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    Checked = true;
    isChecked = true;


    /**
     * Constructor
     *
     * @param {MatDialogRef<EditNewImageComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<EditNewImageComponent>,
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
