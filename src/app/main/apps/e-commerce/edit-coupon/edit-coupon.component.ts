import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { EcommerceAddSosContactsService } from '../add-sos-countries/add-sos-countries.service';
import { EcommerceEditCouponService } from './edit-coupon.service';
import { Router } from '@angular/router';

@Component({
    selector: 'e-commerce-edit-coupon',
    templateUrl: './edit-coupon.component.html',
    styleUrls: ['./edit-coupon.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceEditCouponComponent {
    showExtraToFields: boolean;
    editCouponForm: FormGroup;
    getcountries: any;
    fileData: File = null;
    previewUrl: any = null;
    showId = true;
    terms: any;
    hideImage = true;
    Logo: any;
    Image: any;
    hideLog = true;


    /**
     * Constructor
     *
     * @param {MatDialogRef<EcommerceEditCouponComponent>} matDialogRef
     * @param _data
     */
    constructor(
        private _addsoscontactsService: EcommerceAddSosContactsService,
        private _ecommerceEditCouponsService: EcommerceEditCouponService,
        private _router: Router

    ) {
        // Set the defaults
        this.editCouponForm = this.createComposeForm();
        this.showExtraToFields = false;
    }

    ngOnInit() {
        this._addsoscontactsService.getCountries()
            .then(data => {
                this.getcountries = data.Countries;

            });
        this.loadingMethods();


        this.terms = JSON.parse(localStorage.getItem('EditCoupon'));
        console.log(this.terms);
        let last = this.terms.Terms_Conditions;
        this.Image = this.terms.Image;
        this.Logo = this.terms.Logo;
        
        let numberOfTerms = last.length;
        for (let i = 1; i < numberOfTerms; i++) {
            this.Terms_Conditions.push(new FormControl(last[i]));

        }

    }

    loadingMethods() {
        this.editCouponForm.patchValue(JSON.parse(localStorage.getItem("EditCoupon")));
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
            CouponID: new FormControl(''),
            Title: new FormControl(''),
            VendorName: new FormControl(''),
            ContactNo: new FormControl(''),
            CountryID: new FormControl(''),
            EmailID: new FormControl(''),
            VoucherValue: new FormControl(''),
            Price: new FormControl(''),
            City: new FormControl(''),
            StartDate: new FormControl(''),
            EndDate: new FormControl(''),
            StoreAddress: new FormControl(''),
            VendorID: new FormControl(''),
            Terms_Conditions: new FormArray([
                new FormControl(null)
            ]),
            CouponPrefix: new FormControl(''),
            Quantity: new FormControl('')
           // rysprice: new FormControl(''),
        });
    }
    get Terms_Conditions(): FormArray { return this.editCouponForm.get('Terms_Conditions') as FormArray; }
    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    onAddTerms_Conditions() {
        this.Terms_Conditions.push(new FormControl());
    }
    fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files[0];
        this.preview();
    }
    hide() {
        this.hideImage = !this.hideImage;
    }
    hideLogo() {
        this.hideLog = this.hideLog;
    }

    preview() {
        // Show preview 
        var mimeType = this.fileData.type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(this.fileData);
        reader.onload = (_event) => {
            this.previewUrl = reader.result;
            this.showId = !this.showId;
            // this.isShow =true; 

        }
    }
    onChange(event) {

        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event: any) => {
                    let imageSplits = event.target.result.split(',');
                    console.log(imageSplits[1]);
                    if (imageSplits != undefined && imageSplits[1] != undefined) {
                        this.editCouponForm.value.Image = imageSplits[1];
                        console.log(this.editCouponForm.value.Image);
                    }

                }

                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    onChangeLogo(event) {

        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event: any) => {
                    let imageSplits = event.target.result.split(',');
                    console.log(imageSplits[1]);
                    if (imageSplits != undefined && imageSplits[1] != undefined) {
                        this.editCouponForm.value.Logo = imageSplits[1];
                        console.log(this.editCouponForm.value.Logo);
                    }

                }

                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    onEditCoupon() {
       // this.editCouponForm.value.rysprice = 2300;
       // this.editCouponForm.value.quantity = 30;
       // this.editCouponForm.value.Code = "RYSS";
        this.editCouponForm.value.VoucherValue = Number(this.editCouponForm.value.VoucherValue);
        this.editCouponForm.value.Price = Number(this.editCouponForm.value.Price);
        var couponJSON: any;
        couponJSON = (this.editCouponForm.value);
        this._ecommerceEditCouponsService.editCoupon(couponJSON).then((data) => {

            if (data.Status == 1) {
                alert("Coupon updated successfully");
                this._router.navigate(['apps/e-commerce/my-coupons/' + Number(localStorage.getItem('VendorID'))]);
            }
            else
                alert(data.Message);
        });

    }


}
