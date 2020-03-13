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
import { EditEventImageComponent } from '../../mail/dialogs/edit-event-image/edit-event-image.component';
import { EcommerceEventImagesService } from './event-image.service';
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
    selector: 'e-commerce-event-image',
    templateUrl: './event-image.component.html',
    styleUrls: ['./event-image.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceEventImageComponent implements OnInit {
    images: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    eventImageData: any[];
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
    refresh: Subject<any> = new Subject();

    constructor(
        private _eventImageService: EcommerceEventImagesService,
        private dialog: MatDialog,private _bikeBrandsService:EcommerceBikeBrandService
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
                this._eventImageService.getEventImages();
            }
        });
     // this.getEventImages();
       this._eventImageService.oneventImageChanged
       .pipe(takeUntil(this._unsubscribeAll))
       .subscribe(eventimage => {
           if (eventimage.Status == 1) {
               this.eventImageData  = eventimage.DefaultImages;
           }
           else {
               this.eventImageData = null
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
    getEventImages() {
        this._eventImageService.getEventImages()
       .then(data =>
        this.images = data.DefaultImages
       )
    }
    addNewImageDialog(): void {
        this.dialogRef = this.dialog.open(AddEventImageComponent, {
            panelClass: 'add-event-image',
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
    editEventImageDialog(image): void {
        this.dialogRef = this.dialog.open(EditEventImageComponent, {
            panelClass: 'edit-event-image',
            width: '400px',
            data:{ editeventValue: image }
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
     deleteImage(image): void {
        
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let data = image;
                console.log(data);
                      
               
                this._eventImageService.deleteEventImage(data).then((data) => {

                    
                    if (data.Status == 1) {
                    
                        alert(data.Message);
                        this.refresh.next(true);
                       this.getEventImages();
                    }
                    else
                        alert(data.Message);
                });
            }
            this.confirmDialogRef = null;
        });

    }

   
}

