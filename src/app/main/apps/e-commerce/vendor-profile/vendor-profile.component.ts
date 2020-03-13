import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { EcommerceProductsService } from 'app/main/apps/e-commerce/products/products.service';
import { takeUntil } from 'rxjs/internal/operators';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { FormGroup } from '@angular/forms';
import { AddBikeBrandComponent } from '../../mail/dialogs/add-bike-brand/add-bike-brand.component';
import { AddBikeModelComponent } from '../../mail/dialogs/add-bike-model/add-bike-model.component';
import { AddNewImageComponent } from '../../mail/dialogs/add-new-image/add-new-image.component';
import { EditNewImageComponent } from '../../mail/dialogs/edit-new-image/edit-new-image.component';
import { ViewProductComponent } from '../../mail/dialogs/view-product/view-product.component';
import { ViewCouponComponent } from '../../mail/dialogs/view-coupon/view-coupon.component';
import { EcommerceVendorProfileService } from './vendor-profile.service';
export interface PeriodicElement {
    id: number;
    username: string;
    bike: string;
    city: string;
    date: string;
    price: number;
    codes: number;

}

@Component({
    selector: 'e-commerce-vendor-profile',
    templateUrl: './vendor-profile.component.html',
    styleUrls: ['./vendor-profile.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceVendorProfileComponent implements OnInit {
    // dataSource: FilesDataSource | null;
    // displayedColumns = ['select', 'id', 'created', 'name', 'location', 'date', 'invite', 'paid', 'invites', 'participants', 'action'];
    // selection = new SelectionModel<PeriodicElement>(true, []);
    selectedVendorDetails: any;
    couponsData: any[];
    merchandiseData : any[];
    adminid :any;
    vendorid : any;
    vendors : any;
    vendorDetails: any; 
    
    toggle1 = true;
    toggle2 = true;
    toggle3 = true;
    toggle4 = true;
    toggle5 = true;
    toggle6 = true;
    toggles1 = true;
    toggles2 = true;
    toggles3 = true;
    toggles4 = true;
    toggles5 = true;
    toggles6 = true;


    @ViewChild('matCarouselSlide', { static: true }) imgEl: ElementRef;
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;
    dialogRef: any;

    constructor(
        private _vendorProfileService: EcommerceVendorProfileService,
        private dialog: MatDialog
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.vendorid = JSON.parse(localStorage.getItem("VendorID"));
        this.adminid = JSON.parse(localStorage.getItem("AdminUserID"));
    }

   
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.selectedVendorDetails = JSON.parse(localStorage.getItem('selectedVendorRow'));
        let id = this.selectedVendorDetails.VendorID;

        let datas: any  = this._vendorProfileService.vendorData;
        this.vendorDetails =  datas.Vendors.find(x => x.VendorID == id);
       // console.log (th);

        this._vendorProfileService.myCouponsChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(coupon => {

            if (coupon.Status == 1) {
                this.couponsData  = coupon.Coupons;
             
            }
            else {
                this.couponsData = null;
            }

        });
        this._vendorProfileService.merchandiseChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(merchandise => {

            if (merchandise.Status == 1) {
                this.merchandiseData = merchandise.Merchandise;
             
            }
            else {
                this.merchandiseData = [];
            }
        });

    }
    
    openAlertDialog(): void {
        const dialogRef = this.dialog.open(RequestDialogComponent, {
            data: {
                message: 'Your Request has been Successfully Sent !',
                buttonText: {
                    cancel: 'Done'
                }
            },
        });
    }
    onImgError(event) {
        event.target.src = 'assets/images/profile/default-avatar.png';
    }
    couponDialog(coupon): void {
        this.dialogRef = this.dialog.open(ViewCouponComponent, {
            panelClass: 'view-coupon',
            data: {couponValue: coupon}
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Send
                     */
                    case 'send':
                        console.log('new Mail', formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        console.log('delete Mail');
                        break;
                }
            });
    }
    modalDialog(merchandise): void {
        this.dialogRef = this.dialog.open(ViewProductComponent, {
            panelClass: 'view-product',
            data:{merchandiseValue: merchandise}
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Send
                     */
                    case 'send':
                        console.log('new Mail', formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        console.log('delete Mail');
                        break;
                }
            });
    }
    addNewImageDialog(): void {
        this.dialogRef = this.dialog.open(AddNewImageComponent, {
            panelClass: 'add-new-image'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Send
                     */
                    case 'send':
                        console.log('new Mail', formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        console.log('delete Mail');
                        break;
                }
            });
    }
    editNewImageDialog(): void {
        this.dialogRef = this.dialog.open(EditNewImageComponent, {
            panelClass: 'edit-new-image',
            width: '400px',
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Send
                     */
                    case 'send':
                        console.log('new Mail', formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        console.log('delete Mail');
                        break;
                }
            });
    }
}
