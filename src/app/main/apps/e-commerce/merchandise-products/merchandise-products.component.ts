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
import { MatDialog, MatDialogRef } from '@angular/material';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { ViewCouponComponent } from '../../mail/dialogs/view-coupon/view-coupon.component';
import { FormGroup } from '@angular/forms';
import { AcceptCouponComponent } from '../../mail/dialogs/accept-coupon/accept-coupon.component';
import { ViewProductComponent } from '../../mail/dialogs/view-product/view-product.component';
import { AcceptProductComponent } from '../../mail/dialogs/accept-product/accept-product.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EcommerceMerchandiseService } from './merchandise-products.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'e-commerce-merchandise-products',
    templateUrl: './merchandise-products.component.html',
    styleUrls: ['./merchandise-products.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceMerchandiseProductsComponent implements OnInit {
   isChecked = true;
    isChecked2 = true;
    isChecked3 = true;
    VendorID: number;
    merchandiseData: any[];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    id :any;
    datas :any;
    firstname :any;
    lastname: any;



    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    refresh: Subject<any> = new Subject();
    // Private
    private _unsubscribeAll: Subject<any>;
    dialogRef: any;
    @ViewChild('matCarouselSlide', { static: true }) imgEl: ElementRef;

    constructor(
     
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private _merchandiseService: EcommerceMerchandiseService,
        private _router:Router
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.firstname = localStorage.getItem("FirstName");
        this.lastname = localStorage.getItem("LastName");
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._merchandiseService.getMerchandiseByVendorID();
            }
        });
        this.route.params.subscribe(params => {
            this.VendorID = params['id'];
            console.log(this.VendorID);
        });
        this._merchandiseService.myMerchandiseChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(merchandise => {
            if (merchandise.Status == 1) {
                this.merchandiseData  = merchandise.Merchandise;
                console.log(this.merchandiseData);
                
            }
            else {
                this.merchandiseData = null;
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
     /**
     * Delete merchandise
     *
     * @param merchandise
     */
    deleteMerchandise(merchandise): void {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._merchandiseService.deleteMerchandise(merchandise.MerchandiseID).then((data) => {
                    // Show the success message
                    if (data.Status == 1) {
                        //let result = data.VendorDetails;
                        alert(data.Message);
                        this.refresh.next(true);
                    }
                    else
                        alert(data.Message);
                });
            }
            this.confirmDialogRef = null;
        });
    }
    editMerchandise(merchandise) {
        localStorage.setItem("EditMerchandise", JSON.stringify(merchandise));
        this._router.navigate(['apps/e-commerce/edit-merchandise']);
    }
    // storeId(){
    //     this._router.navigate(['apps/e-commerce/create-merchandise']);
    //     //localStorage.setItem('')
    // }
    modalDialog(merchandise): void {
        this.dialogRef = this.dialog.open(ViewProductComponent, {
            panelClass: 'view-product',
            data : { merchandiseValue : merchandise}
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if(response) {
                    this._merchandiseService.getMerchandiseByVendorID();
                } else  if (!response) {
                    return;
                }
               
            });
    }
    acceptDialog(): void {
        this.dialogRef = this.dialog.open(AcceptProductComponent, {
            panelClass: 'accept-product'
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
    hideToUser(value, merchandise) {
        if (value.checked === true) {
         // console.log({ checked: true, product_id: ad_id.AdminAdID});
          this.id = merchandise.MerchandiseID;
          this.datas = {
              "Status" : 1
          }

        } else {
         // console.log({ checked: false, product_id: ad_id.AdminAdID});
          this.id = merchandise.MerchandiseID;
          this.datas = {
              "Status" : 3
          }
        }

        this._merchandiseService.onOffMerchandise(this.datas,this.id).then((data) => {
        
            if (data.Status == 1) {
            alert("Merchandise Updated successfully");
            }
            else
            alert(data.Message);
            });


    }
}


