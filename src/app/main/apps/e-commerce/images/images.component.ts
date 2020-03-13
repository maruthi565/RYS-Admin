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
import { MatTableDataSource, MatDialog, MatTabChangeEvent, MatTabGroup } from '@angular/material';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { FormGroup } from '@angular/forms';
import { AddBikeBrandComponent } from '../../mail/dialogs/add-bike-brand/add-bike-brand.component';
import { EcommerceBikeBrandService } from './images.service';
import { Router } from '@angular/router';
import { EditBikeBrandDialog } from '../../mail/dialogs/edit-bike-brand/edit-bike-brand.component';


@Component({
    selector: 'e-commerce-images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceImagesComponent implements OnInit {
    bikeBrandsData: any[];
    bikebrandsFilteredByTitle: any[];
    searchTerm: string;
    isChecked = true;
    Checked1 = true;
    Checked2 = true;
    Checked3 = true;
    Checked4 = true;
    bikebrand: any;
    brandcount :number;
    id :any;
    datas :any;
    infocountboxes :any;
    showCountBox :boolean;
    selectedIndex :any;
    // public tabGroup: MatTabGroup;

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
        private _bikeBrandsService: EcommerceBikeBrandService,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.searchTerm = '';
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
        this.selectedIndex = JSON.parse(localStorage.getItem("ImagesTabLocation"));
        console.log(this.selectedIndex);
        this._bikeBrandsService.getInfoBoxes()
        .then(data => {
            this.infocountboxes = data;
            this.showCountBox =true;
        })
        this._bikeBrandsService.onbikeBrandsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(bikebrand => {
                if (bikebrand.Status == 1) {
                    this.bikeBrandsData = this.bikebrandsFilteredByTitle = bikebrand.BikeBrands;
                    this.brandcount = this.bikeBrandsData.length;
                 }
                else {
                    this.bikeBrandsData = null
                }

            });
    }
    onTabChanged(event: MatTabChangeEvent) {
        console.log(event.index);
       let index = event.index;
       localStorage.setItem("ImagesTabLocation", JSON.stringify(index));
     }

    filterBrandsByName(event): void {


        if(this.searchTerm == undefined || this.searchTerm.length < 3){
            //return;
            var url = 'bikebrands?QueryString='+this.searchTerm ;   
            this._bikeBrandsService.getBikeBrands(url)
            // .then(data => {
            //     this.dataSource.data = data.FeedBacks;
            // })
        }
       
        if(this.searchTerm == '' || this.searchTerm.length == 0) {
            this._bikeBrandsService.getBikeBrands('bikebrands')
            // .then(data => {
            //     this.feedbackData = data.Feedback
            //       this.dataSource.data =this.feedbackData;
            // })
        }

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
    hideToUser(value, brand_id) {
        if (value.checked === true) {
         // console.log({ checked: true, product_id: ad_id.AdminAdID});
          this.id = brand_id.BrandID;
          this.datas = {
              "Status" : 1
          }

        } else {
         // console.log({ checked: false, product_id: ad_id.AdminAdID});
          this.id = brand_id.BrandID;
          this.datas = {
              "Status" : 2
          }
        }

        this._bikeBrandsService.onOffAdd(this.datas,this.id).then((data) => {
        
            if (data.Status == 1) {
            alert("BikeBrand Updated successfully");
            }
            else
            alert(data.Message);
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
    selected(bikebrand) {
        localStorage.setItem("EditBikeBrand", JSON.stringify(bikebrand));
    }
    editBikeBrandDialog(bikebrand): void {
        this.dialogRef = this.dialog.open(EditBikeBrandDialog, {
            panelClass: 'edit-bike-brand',
            data:{ pageValue: bikebrand }
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

    // filterBrandByTitle(event) {
    //     if(this.searchTerm == undefined || this.searchTerm.length < 3){
    //         //return;
    //         var url = 'feedbackfilter?QueryString='+this.searchTerm ;   
    //         this._feedbackService.getFeedback(url)
    //         .then(data => {
    //             this.dataSource.data = data.FeedBacks;
    //         })
    //     }
       
    //     if(this.searchTerm == '' || this.searchTerm.length == 0) {
    //         this._feedbackService.getFeedback('feedback')
    //         .then(data => {
    //             this.feedbackData = data.Feedback
    //               this.dataSource.data =this.feedbackData;
    //         })
    //     }
    // }
    setSelectedBrand(bikebrand) {
        let id = bikebrand.BrandID;
        console.log(bikebrand.BrandID);
        localStorage.setItem("BikeBrand", JSON.stringify(bikebrand));
        this.router.navigate(['/apps/e-commerce/bike-brand-detail', id]);
    }

}


