import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { EcommerceAddAdminUserService } from './add-admin-user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'e-commerce-add-admin-user',
    templateUrl: './add-admin-user.component.html',
    styleUrls: ['./add-admin-user.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceAddAdminUserComponent {
    showExtraToFields: boolean;
    addAdminUserForm: FormGroup;


    /**
     * Constructor
     *
     * @param {MatDialogRef<EcommerceAddAdminUserComponent>} matDialogRef
     * @param _data
     */
    constructor(
        private _ecommerceAddAdminUserService: EcommerceAddAdminUserService,
        private _router: Router

    ) {
        // Set the defaults
        this.addAdminUserForm = this.createComposeForm();
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
            FirstName: new FormControl('',Validators.required),
            LastName: new FormControl('',Validators.required),
            EmailID: new FormControl('',Validators.required),
            MobileNumber: new FormControl('',Validators.required),
            Password: new FormControl('',Validators.required)

        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    onAddAdminUser() {
        if(this.addAdminUserForm.invalid){
            alert("Please fill all the details")
        }
        else {
        this._ecommerceAddAdminUserService.addAdminUser(this.addAdminUserForm.value).then((data) => {

            // Show the success message
            if (data.Status == 1) {
                
                alert("Admin User added successfully");
                this._router.navigate(['apps/e-commerce/admin-users']);
            }
            else
                alert(data.Message);
        });
    }
    }

}
