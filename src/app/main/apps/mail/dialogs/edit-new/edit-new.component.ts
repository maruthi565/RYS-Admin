import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EcommerceAddAdminUserPostedBikeService } from '../add-new/add-new.service';
import { Router } from '@angular/router';
import { EcommerceEditUserBikeService } from './edit-new.service';
import { Subject } from 'rxjs';
import { EcommerceUserPostedService } from 'app/main/apps/e-commerce/user-posted/user-posted.service';

@Component({
    selector: 'edit-new',
    templateUrl: './edit-new.component.html',
    styleUrls: ['./edit-new.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditNewComponent {
    showExtraToFields: boolean;
    editBikeForm: FormGroup;
    // selected = '650 R';
    // selectedBrand = 'Kawasaki';
    // selectedmfg = '2017';
    // selectedreg = '2018';
    fromPage: any;
    models : any;
    getmodel: any;
    getbikemodel :any;
    selectedValue: any;
    urls = [];
    htmlUrls = [];
    countries : any;
    getbikebrand: any;
    ID: number;
    images: any[];
    bikemodels:any;
    refresh: Subject<any> = new Subject();
    getuserpostedbikes :any;

    /**
     * Constructor
     *
     * @param {MatDialogRef<EditNewComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<EditNewComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _adminuserpostedbikeService: EcommerceAddAdminUserPostedBikeService,
        private _userpostedService: EcommerceUserPostedService,
        private _editbikeService: EcommerceEditUserBikeService,
        private _router:Router
    ) {
        // Set the defaults
        this.editBikeForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.editbikeValue;
        console.log(this.fromPage);
    }

    ngOnInit() {
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._userpostedService.getUserPostedBikes('userpostedbikes')
                .then(data => {
                    //this.bikes = res;
                    this.getuserpostedbikes = data.UserpostedBikes
                  
                  
        
                })
            }
        });
        this._adminuserpostedbikeService.getBikebrands()
        .then(data => {
            this.getbikebrand = data.BikeBrands;
        })
        
        this._adminuserpostedbikeService.getCountries()
        .then(data => {
            this.countries = data.Countries;
        });

        this._adminuserpostedbikeService.getBikemodels()
        .then(data => {
            this.getbikemodel = data.Bike;
           // this.bikemodels = JSON.stringify((this.getbikemodel.filter(item=> item.BikeModelID == this.fromPage.ModelID)));
            //console.log(this.getbikemodel);
           // console.log("model id " + JSON.stringify((this.getbikemodel.filter(item=> item.BikeModelID == this.fromPage.ModelID))));
            this.editBikeForm.patchValue(this.fromPage);
        })
      
        console.log(this.fromPage.ModelID);
        this.ID = this.fromPage.ID;
        this.images = this.fromPage.ImageURLs;
        console.log(this.images);
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
            ID: new FormControl(''),
            Title: new FormControl(''),
            BrandID : new FormControl(''),
            ModelID : new FormControl(''),
            ManufacturedYear :new  FormControl(''),
            RegistrationYear: new FormControl(''),
            KMdriven: new FormControl(''),
            //ImageURLs: new FormControl([]),
            Location: new FormControl(''),
            Price: new FormControl(''),
            Contact: new FormControl(''),
            Email: new FormControl(''),
            CountryID : new FormControl('')
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    onChange(event) {
        if (this.urls.length <= 4 && event.target.files.length <= 4) {
          if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
              //var qual = compressor.compress(event.target.files[i], {quality: .5})
              var reader = new FileReader();
    
              reader.onload = (event: any) => {
    
                let imageSplits = event.target.result.split(',');
                console.log(imageSplits[1]);
                if (imageSplits != undefined && imageSplits[1] != undefined) {
                  this.htmlUrls.push(event.target.result);
                  this.urls.push(imageSplits[1]);
    
                }
              }
    
              reader.readAsDataURL(event.target.files[i]);
             // this.isCheck = false;
            }
          }
        }
        else {
          alert("Max files limit is 3 ")
        }
    
      }
    onDropdownChange(e){
        console.log(e)//you will get the id  
        this.models=  this.getbikemodel.filter(x => x.BrandID == e.value);
        
        console.log(this.models);
        console.log(this.models.BikeModelID);
         //if you want to bind it to your model
      }
      onEditUserBike() {
        this.editBikeForm.value.UserPostedMerchandiseID = this.ID;
        // this.editBikeForm.value.ImageURLs = this.urls;
        // this.editBikeForm.value.UserID = localStorage.getItem('AdminUserID');
        // this.editBikeForm.value.Type = 'admin';
        this._editbikeService.editUserBike(this.editBikeForm.value).then((data) => {
    
            // Show the success message
            if (data.Status == 1) {
    
                // let result = data.VendorDetails;
                // console.log(result);
                alert("UserPosted Bike updated successfully");
                //this._router.navigate(['apps/e-commerce/user-posted']);
                //this.refresh.next(true);
                this.matDialogRef.close(true);
            
            }
            else
                alert(data.Message);
        });
    }
}
