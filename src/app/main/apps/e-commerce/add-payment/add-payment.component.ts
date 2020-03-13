import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
//import { EcommerceAddAdminUserService } from './add-admin-user.service';
import { Router } from '@angular/router';
import { EcommerceAddPaymentService } from './add-payment.service';

@Component({
    selector: 'e-commerce-add-payment',
    templateUrl: './add-payment.component.html',
    styleUrls: ['./add-payment.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceAddPaymentComponent {
    showExtraToFields: boolean;
    addPaymentForm: FormGroup;
    getcountries: any;
    vendors: any;
    vendorname :any;
    // selected: any;


    /**
     * Constructor
     *
     * @param {MatDialogRef<EcommerceAddPaymentsComponent>} matDialogRef
     * @param _data
     */
    constructor(
        private _paymentService: EcommerceAddPaymentService,
        private _router: Router

    ) {
        // Set the defaults
        this.addPaymentForm = this.createComposeForm();
        this.showExtraToFields = false;
    }
    ngOnInit(){
        this._paymentService.getCountries()
        .then(data => {
          this.getcountries = data.Countries;
      });
      this._paymentService.getVendors()
      .then(data => {
          this.vendors = data.Vendors;
          console.log(this.vendors);
      })
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
            VendorID: new FormControl(''),
            Location: new FormControl(''),
            CountryID: new FormControl(''),
            AmountPaid: new FormControl(''),
            VendorName: new FormControl('')

        });
    }
    getInnerText(innerText){
        this.vendorname = innerText;
        console.log(innerText)
      }
    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    
    }
    onAddVendorPayments() {
        this.addPaymentForm.value.VendorName = this.vendorname;
        this.addPaymentForm.value.AmountPaid = Number(this.addPaymentForm.value.AmountPaid);
        console.log(this.addPaymentForm.value);
        this._paymentService.addPayment(this.addPaymentForm.value).then((data) => {

           // Show the success message
           if (data.Status == 1) {
               
               alert("Vendor Payment added successfully");
               this._router.navigate(['apps/e-commerce/after-market']);
           }
           else
               alert(data.Message);
       });
   }

}
