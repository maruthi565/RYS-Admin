import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'edit-post',
    templateUrl: './edit-post.component.html',
    styleUrls: ['./edit-post.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditPostComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    selected = '650 R';
    selectedBrand = 'Kawasaki';
    selectedmfg = '2017';
    selectedreg = '2018';

    /**
     * Constructor
     *
     * @param {MatDialogRef<EditPostComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<EditPostComponent>,
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
            title: new FormControl(''),
            price: new FormControl(''),
            driven: new FormControl('')
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
}
