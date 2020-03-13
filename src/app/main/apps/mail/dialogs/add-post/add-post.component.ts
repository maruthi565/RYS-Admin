import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'add-post',
    templateUrl: './add-post.component.html',
    styleUrls: ['./add-post.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddPostComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AddPostComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AddPostComponent>,
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
            Price: new FormControl(''),
            purchased: new  FormControl(''),
            location: new FormControl('')
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
}
