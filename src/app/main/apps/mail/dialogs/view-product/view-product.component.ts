import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewProductDialogService } from './view-product.service';

@Component({
    selector: 'view-product',
    templateUrl: './view-product.component.html',
    styleUrls: ['./view-product.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewProductComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    fromPage :any;
    terms: any[];
    percent: any;
    @ViewChild('matCarouselSlide', { static: true }) imgEl: ElementRef;
    /**
     * Constructor
     *
     * @param {MatDialogRef<ViewProductComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<ViewProductComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _merchandiseDialogService: ViewProductDialogService
    ) {
        // Set the defaults
        this.composeForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.merchandiseValue;
        this.terms = this.fromPage.Terms_Conditions;
        // ((merchandise.DiscountedPrice/merchandise.Price)*100).toFixed(2)
        let discount = this.fromPage.DiscountedPrice;
        let price = this.fromPage.Price;
        this.percent = (discount/price)* 100;
        console.log(this.terms);
        console.log(this.fromPage);
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
    onAcceptMerchandise(merchandise) {
        let data = merchandise;
        console.log(data);
        var merchandiseJson = {
            "Status" : 1
        }
        this._merchandiseDialogService.AcceptProduct(data,merchandiseJson).then((data) => {
        
            if (data.Status == 1) {
            alert("Merchandise Accepted successfully");
            //this._router.navigate(['apps/e-commerce/user-posted']);
            this.matDialogRef.close(true);
            
            }
            else
            alert(data.Message);
            });

    }
}
