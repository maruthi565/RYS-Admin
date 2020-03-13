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
    selector: 'e-commerce-bike-images',
    templateUrl: './bike-images.component.html',
    styleUrls: ['./bike-images.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceBikeImagesComponent implements OnInit {
    displayedColumns = ['select', 'id', 'created', 'name', 'location', 'date', 'invite', 'paid', 'invites', 'participants', 'action'];
    selection = new SelectionModel<PeriodicElement>(true, []);
    isChecked = true;
    bikeBrandsData: any[];
    bikebrandsFilteredByTitle: any[];
    searchTerm: string;



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
        private _ecommerceProductsService: EcommerceProductsService,
        private _ecommercebikebrandService: EcommerceBikeBrandService,

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
      //  this.dataSource = new FilesDataSource(this._ecommerceProductsService, this.paginator, this.sort);

        this._ecommercebikebrandService.onbikeBrandsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(bikebrand => {
                if (bikebrand.Status == 1) {
                    this.bikeBrandsData = this.bikebrandsFilteredByTitle = bikebrand.BikeBrands;
                }
                else {
                    this.bikeBrandsData = null
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
    addBikeBrandDialog(): void {
        this.dialogRef = this.dialog.open(AddBikeBrandComponent, {
            panelClass: 'add-bike-brand'
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
    filterBikeBrandsByTitle(): void {
        const searchTerm = this.searchTerm.toLowerCase();

        // Search
        if (searchTerm === '') {
            this.bikeBrandsData = this.bikebrandsFilteredByTitle;
        }
        else {
            this.bikeBrandsData = this.bikebrandsFilteredByTitle.filter((bikebrand) => {
                return bikebrand.BrandName.toLowerCase().includes(searchTerm);
            });
        }
    }
    
}


