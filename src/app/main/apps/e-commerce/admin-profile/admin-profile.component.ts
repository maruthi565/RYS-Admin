import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
}



@Component({
    selector: 'e-commerce-admin-profile',
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class EcommerceAdminProfileComponent {
adminlogin : any;
inactive= true;


    /*
    * Constructor
    *
    * @param {MatDialogRef<EcommerceProfileComponent>} matDialogRef
    * @param _data
    */
    constructor(

    ) {
        // Set the defaults
       
        this.showExtraToFields = false;
    }
    showExtraToFields: boolean;
    addCouponForm: FormGroup;
    tiles: Tile[] = [
        { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
        { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' }

    ];

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /*
    * Create compose form
    *
    * @returns {FormGroup}
    */
   ngOnInit() {

     this.adminlogin = JSON.parse(localStorage.getItem('AdminLoginDetails'));
    
   }
   changeStatus() {
    this.inactive = false;
  }
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

}
