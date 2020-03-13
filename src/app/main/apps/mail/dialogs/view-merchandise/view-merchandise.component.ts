import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EcommerceBikeUserPostedService } from 'app/main/apps/e-commerce/bike-request/bike-request.service';
import { Router } from '@angular/router';

@Component({
    selector: 'view-merchandise',
    templateUrl: './view-merchandise.component.html',
    styleUrls: ['./view-merchandise.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewMerchandiseComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    fromPage: any;

    @ViewChild('matCarouselSlide', { static: true }) imgEl: ElementRef;
    /**
     * Constructor
     *
     * @param {MatDialogRef<ViewMerchandiseComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<ViewMerchandiseComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _ecommerceBikeUserPostedService: EcommerceBikeUserPostedService,
        private _router :Router
    ) {
        // Set the defaults
        this.composeForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.pagerequestProductValue;
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
    OnAcceptMerchandise(element) {
        let data = element;
        console.log(data);
        var merchandiseJson = {
            "Status" : 1
        }
        this._ecommerceBikeUserPostedService.AcceptUserMerchandise(data,merchandiseJson).then((data) => {
        
            if (data.Status == 1) {
            alert("UserPosted Merchandise updated successfully");
            this._router.navigate(['apps/e-commerce/user-posted']);
            this.matDialogRef.close();
            }
            else
            alert(data.Message);
            });

    }
    OnRejectMerchandise(element) {
        let data = element;
        console.log(data);
        var merchandiserejectJson = {
            "Status" : 0
        }
        this._ecommerceBikeUserPostedService.RejectUserMerchandise(data,merchandiserejectJson).then((data) => {
        
            if (data.Status == 1) {
            alert("UserPosted Merchandise Rejected successfully");
            this._router.navigate(['apps/e-commerce/user-posted']);
            }
            else
            alert(data.Message);
            });

    }
}
