import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/internal/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { FormGroup } from '@angular/forms';
import { ViewCouponComponent } from '../../mail/dialogs/view-coupon/view-coupon.component';
import { AcceptCouponComponent } from '../../mail/dialogs/accept-coupon/accept-coupon.component';
import { MyCouponsService } from './my-coupons.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
@Component({
    selector: 'e-commerce-my-coupons',
    templateUrl: './my-coupons.component.html',
    styleUrls: ['./my-coupons.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceMyCouponsComponent implements OnInit {
    displayedColumns = ['id', 'username', 'bike', 'city', 'date', 'price', 'codes'];
    isChecked1 = true;
    isChecked2 = true;
    isChecked3 = true;
    isChecked4 = true;
    isChecked5 = true;
    isChecked6 = true;
    dialogRef: any;
    couponsData: any[];
    couponsFilteredByTitle: any[];
    searchTerm: string;
    isChecked = true;
    VendorID: number;
    vendorname: any;
    vendors :any;
    date :Date;
    id : any;
    datas : any;
    firstname :any;
    lastname : any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    @ViewChild('filter', { static: true })
    filter: ElementRef;
    refresh: Subject<any> = new Subject();
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(private _myCouponsService: MyCouponsService, private dialog: MatDialog, private _router: Router, private route: ActivatedRoute) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.searchTerm = '';
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit() {
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._myCouponsService.getCouponsByVendorID();
            }
        });

        this.route.params.subscribe(params => {
            this.VendorID = params['id'];
            console.log(this.VendorID);
            
        });
        this.firstname = localStorage.getItem("FirstName");
        this.lastname = localStorage.getItem("LastName");
        
        this._myCouponsService.myCouponsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(coupon => {
                if (coupon.Status == 1) {
                    this.couponsData = this.couponsFilteredByTitle = coupon.Coupons;
                    console.log(this.couponsData); 
                    
                }
                else {
                    this.couponsData = null;
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
    modalDialog(coupon): void {
        this.dialogRef = this.dialog.open(ViewCouponComponent, {
            panelClass: 'view-coupon',
            width: '600px',
            data: { couponValue: coupon }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if(response) {
                    this._myCouponsService.getCouponsByVendorID();
                } else if (!response) {
                    return;
                }
                
            });
    }
    editCoupon(coupon) {
        localStorage.setItem("EditCoupon", JSON.stringify(coupon));
        this._router.navigate(['apps/e-commerce/edit-coupon']);
    }
    acceptDialog(): void {
        this.dialogRef = this.dialog.open(AcceptCouponComponent, {
            panelClass: 'accept-coupon'
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
    /**
     * Delete coupon
     *
     * @param coupon
     */
    deleteCoupon(coupon): void {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._myCouponsService.deleteCoupons(coupon.CouponID).then((data) => {
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
    filterCouponsByTitle(): void {
        const searchTerm = this.searchTerm.toLowerCase();
        // Search
        if (searchTerm === '') {
            this.couponsData = this.couponsFilteredByTitle;
        }
        else {
            this.couponsData = this.couponsFilteredByTitle.filter((coupon) => {
                return coupon.Title.toLowerCase().includes(searchTerm);
            });
        }
    }
    hideToUser(value, coupon) {
        if (value.checked === true) {
         // console.log({ checked: true, product_id: ad_id.AdminAdID});
          this.id = coupon.CouponID;
          this.datas = {
              "CouponStatus" : 1
          }

        } else {
         // console.log({ checked: false, product_id: ad_id.AdminAdID});
          this.id = coupon.CouponID;
          this.datas = {
              "CouponStatus" : 3
          }
        }

        this._myCouponsService.onOffCoupon(this.datas,this.id).then((data) => {
        
            if (data.Status == 1) {
            alert("Coupon Updated successfully");
            }
            else
            alert(data.Message);
            });


    }
}
