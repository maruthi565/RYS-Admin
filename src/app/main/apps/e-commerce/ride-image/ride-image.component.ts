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
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { FormGroup } from '@angular/forms';
import { AddBikeBrandComponent } from '../../mail/dialogs/add-bike-brand/add-bike-brand.component';
import { AddBikeModelComponent } from '../../mail/dialogs/add-bike-model/add-bike-model.component';
import { AddNewImageComponent } from '../../mail/dialogs/add-new-image/add-new-image.component';
import { AddEventImageComponent } from '../../mail/dialogs/add-event-image/add-event-image.component';
import { EditRideImageComponent } from '../../mail/dialogs/edit-ride-image/edit-ride-image.component';
import { AddRideImageDialog } from '../../mail/dialogs/add-ride-image/add-ride-image.component';
import { EcommerceRideImagesService } from './ride-image.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { EcommerceBikeBrandService } from '../images/images.service';
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
    selector: 'e-commerce-ride-image',
    templateUrl: './ride-image.component.html',
    styleUrls: ['./ride-image.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceRideImageComponent implements OnInit {

    rideImageData:  any[];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    refresh: Subject<any> = new Subject();
    infocountboxes :any;
    showCountBox :boolean;


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
        private _ridesImageService: EcommerceRideImagesService,
        private _bikeBrandsService:EcommerceBikeBrandService,
        private dialog: MatDialog
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
        this._bikeBrandsService.getInfoBoxes()
        .then(data => {
            this.infocountboxes = data;
            this.showCountBox =true;
        })
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._ridesImageService.getRideImages();
            }
        });
       
        this._ridesImageService.onrideImageChanged
       .pipe(takeUntil(this._unsubscribeAll))
       .subscribe(rideimage => {
           if (rideimage.Status == 1) {
               this.rideImageData  = rideimage.DefaultImages;
           }
           else {
               this.rideImageData = null
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
    addRideImageDialog(): void {
        this.dialogRef = this.dialog.open(AddRideImageDialog, {
            panelClass: 'add-ride-image'
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
    editRideImageDialog(image): void {
        this.dialogRef = this.dialog.open(EditRideImageComponent, {
            panelClass: 'edit-ride-image',
            width: '400px',
            data : { editRideImageValue : image}
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
      * Delete EventImage
      *
      * @param image
      */
     deleteRideImage(image): void {
        
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let data = image;
                console.log(data);
                      
               
                this._ridesImageService.deleteRideImage(data).then((data) => {

                    
                    if (data.Status == 1) {
                    
                        alert(data.Message);
                        this.refresh.next(true);
                       //this.getRideImages();
                    }
                    else
                        alert(data.Message);
                });
            }
            this.confirmDialogRef = null;
        });

    }
   
}


