import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewCouponDialogService } from './view-coupon.service';
import { Router } from '@angular/router';

@Component({
    selector: 'view-coupon',
    templateUrl: './view-coupon.component.html',
    styleUrls: ['./view-coupon.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewCouponComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    fromCouponPage: any;
    terms:any[];

    /**
     * Constructor
     *
     * @param {MatDialogRef<ViewCouponComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<ViewCouponComponent>,
        private _couponDialogService : ViewCouponDialogService,
        private _router: Router,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        // Set the defaults
        this.composeForm = this.createComposeForm();
        this.showExtraToFields = false;
         this.fromCouponPage = _data.couponValue;
    }
    ngOnInit() {
        this.terms = this.fromCouponPage.Terms_Conditions;
        console.log(this.terms);
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
    // onAcceptCoupon(coupon){
    //     console.log(coupon);

    // }
    onAcceptCoupon(coupon) {
        let data = coupon;
        console.log(data);
        var couponJson = {
            "CouponStatus" : 1
        }
        this._couponDialogService.AcceptCoupon(data,couponJson).then((data) => {
        
            if (data.Status == 1) {
            alert("Coupon Accepted successfully");
            //this._router.navigate(['apps/e-commerce/user-posted']);
            this.matDialogRef.close(true);
            
            }
            else
            alert(data.Message);
            });

    }
}
