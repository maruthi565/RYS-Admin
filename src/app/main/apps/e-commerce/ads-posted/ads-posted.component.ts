import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation ,NgZone} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { MapsAPILoader } from '@agm/core';
import { DatePipe } from '@angular/common';

import { EcommerceProductsService } from 'app/main/apps/e-commerce/products/products.service';
import { takeUntil } from 'rxjs/internal/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AddAdsComponent } from '../../mail/dialogs/add-ads/add-ads.component';
import { EditAdsComponent } from '../../mail/dialogs/edit-ads/edit-ads.component';
import { ViewAdsPostedComponent } from '../../mail/dialogs/view-ads-posted/view-ads-posted.component';
import { EcommerceAdsService } from './ads-posted.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
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
    selector: 'e-commerce-ads-posted',
    templateUrl: './ads-posted.component.html',
    styleUrls: ['./ads-posted.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceAdsPostedComponent implements OnInit {
    adsFilteredByBrand: any[];
    searchTerm: string;
    isChecked1 = true;
    isChecked2 = true;
    isChecked3 = true;
    getadsposted: any[];
    adsData: any[];
    bikeBrands: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    selectedBrand: string;
    selectedCity: string;
    selectedDate: string;
    datas: any;
    id :any;
   
    

    @ViewChild('addPostedCitySearch', { static: true }) private addPostedCitySearchElementRef: ElementRef;

    // @ViewChild(MatPaginator, { static: true })
    // paginator: MatPaginator;

    // @ViewChild(MatSort, { static: true })
    // sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    adsPostedreRefresh: Subject<any> = new Subject();
    // Private
    private _unsubscribeAll: Subject<any>;
    dialogRef: any;

    constructor(
        private _ecommerceProductsService: EcommerceProductsService,private datePipe: DatePipe,
        private _adsService: EcommerceAdsService, private ngZone: NgZone,fb :FormBuilder,
        private dialog: MatDialog, private mapsAPILoader: MapsAPILoader
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

        this.mapsAPILoader.load().then(() => {
     
            let autocomplete = new google.maps.places.Autocomplete(this.addPostedCitySearchElementRef.nativeElement, {
              types: ['(cities)']
            });
            autocomplete.addListener("place_changed", () => {
              this.ngZone.run(() => {
                //get the place result
      
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();
      
                this.selectedCity = place.name;
                this.citySelectionChange(this.selectedCity);
               
              });
            });
          });
    
        this.adsPostedreRefresh.subscribe(updateDB => {
            if (updateDB) {
                this._adsService.getAdsPosted('adminadsfilter');
               
            }
        });
        this._adsService.getBikeBrands()
        .then(data => {
            this.bikeBrands = data.BikeBrands;
        });
        this._adsService.myadsChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(ads => {

            if (ads.Status == 1) {
                this.adsData = this.adsFilteredByBrand = ads.Ad == undefined ? ads.AdminAds : ads.Ad;
                console.log(this.adsData)
                
             
            }
            else {
                this.adsData = null;
            }

        });
    }

    brandSelectionChange(event){
        var url = '' ; 
        if(this.selectedBrand != undefined ){
            url = "adminadsfilter?Brand=" + this.selectedBrand;
        }
        if(this.selectedCity != undefined && this.selectedCity != ''){
            url = url + "&City="+ this.selectedCity;
        }
        if(this.selectedDate != undefined && this.selectedDate != '' ){
            url = url  + "&Date="+ this.selectedDate
        }
    
        this._adsService.getAdsPosted(url);
    }
    citySelectionChange(event){
        var url = '' ; 
        if(this.selectedBrand != undefined && this.selectedBrand != '' ){

            if(url == undefined || url ==''){
                url = "adminadsfilter?Brand="+ this.selectedBrand;

            }
            else{
                url = url + "&Brand="+ this.selectedBrand;

            }
        }
        // if(this.selectedBrand != undefined ){
        //     url = "adminadsfilter?Brand=" + this.selectedBrand;
        // }
        if(this.selectedCity != undefined && this.selectedCity != ''){
            if(url == undefined || url ==''){
                url = "adminadsfilter?City="+ this.selectedCity;

            }
            else{
                url = url + "&City="+ this.selectedCity;

            }
        }
        if(this.selectedDate != undefined && this.selectedDate != '' ){
           
            url = url  + "&Date="+ this.selectedDate
        }
    
        this._adsService.getAdsPosted(url);
    }
    dateSelectionChange(){
        this.selectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
        var url = '' ; 
        if(this.selectedBrand != undefined ){
            url = "adminadsfilter?Brand=" + this.selectedBrand;
        }
        // if(this.selectedCity != undefined && this.selectedCity != ''){
        //     url = url + "&City="+ this.selectedCity;
        // }
        if(this.selectedCity != undefined && this.selectedCity != ''){
            if(url == undefined || url ==''){
                url = "adminadsfilter?City="+ this.selectedCity;

            }
            else{
                url = url + "&City="+ this.selectedCity;

            }
        }
        if(this.selectedDate != undefined && this.selectedDate != '' ){

            if(url == undefined || url ==''){
                url = "adminadsfilter?Date="+ this.selectedDate;

            }
            else{
                url = url + "&Date="+ this.selectedDate;

            }
        }
    
        this._adsService.getAdsPosted(url);
    }
    hideToUser(value, ad_id) {
        if (value.checked === true) {
         // console.log({ checked: true, product_id: ad_id.AdminAdID});
          this.id = ad_id.AdminAdID;
          this.datas = {
              "Status" : 1
          }

        } else {
         // console.log({ checked: false, product_id: ad_id.AdminAdID});
          this.id = ad_id.AdminAdID;
          this.datas = {
              "Status" : 2
          }
        }

        this._adsService.onOffAdd(this.datas,this.id).then((data) => {
        
            if (data.Status == 1) {
            alert("Ads Updated successfully");
            }
            else
            alert(data.Message);
            });


    }
    addDialog(): void {
        this.dialogRef = this.dialog.open(AddAdsComponent, {
            panelClass: 'add-ads'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                if(response) {
                    this._adsService.getAdsPosted('adminadsfilter');
                }
            });
    }
    editDialog(ads): void {
        this.dialogRef = this.dialog.open(EditAdsComponent, {
            panelClass: 'edit-ads',
            data: {editAdsValue : ads}
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

                if(response) {
                    this._adsService.getAdsPosted('adminadsfilter');
                }
                if (!response) {
                    return;
                }
                
            });
    }

    viewDialog(ads): void {
        this.dialogRef = this.dialog.open(ViewAdsPostedComponent, {
            panelClass: 'view-ads-posted',
            data: {AdsPageValue :  ads}

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
      * Delete ads
      *
      * @param ads
      */
     deleteAdsPosted(ads): void {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._adsService.deleteAdsPosted(ads.AdminAdID).then((data) => {

                    // Show the success message
                    if (data.Status == 1) {
                        //let result = data.VendorDetails;
                        alert(data.Message);
                        this.adsPostedreRefresh.next(true);
                    }
                    else
                        alert(data.Message);
                });
            }
            this.confirmDialogRef = null;
        });

    } 
    
    /**
     * Filter coupons by Title
     */
    filterAdsByBrand(event): void {


        if(this.searchTerm == undefined || this.searchTerm.length < 20){
           // return;
           var url = 'adminadsfilter?QueryString='+this.searchTerm ;   
           this._adsService.getAdsPosted(url);
        }
       
        
        if(this.searchTerm == '' || this.searchTerm.length == 0) {
            this._adsService.getAdsPosted('adminadsfilter')
            // .then(data => {
                
            //     this.adsData = data.Ad;
            // })
            
        }
}

      /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._unsubscribeAll.unsubscribe();

    }
    
}


