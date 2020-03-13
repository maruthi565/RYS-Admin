import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EcommerceAddAdminUserPostedBikeService } from './add-new.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EcommerceUserPostedService } from 'app/main/apps/e-commerce/user-posted/user-posted.service';
import { MapsAPILoader } from '@agm/core';

@Component({
    selector: 'add-new',
    templateUrl: './add-new.component.html',
    styleUrls: ['./add-new.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddNewComponent {
    showExtraToFields: boolean;
    adduserpostedBikeForm: FormGroup;
    getbikebrand : any;
    models : any;
    getmodel: any;
    getbikemodel :any;
    selectedValue: any;
    urls = [];
    htmlUrls = [];
    countries : any;
    refresh: Subject<any> = new Subject();
    getuserpostedbikes : any;
    location :any;

    @ViewChild('bikeCitySearch', { static: true }) private bikeCitySearchElementRef: ElementRef;
    /**
     * Constructor
     *
     * @param {MatDialogRef<AddNewComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AddNewComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _adminuserpostedbikeService: EcommerceAddAdminUserPostedBikeService,
        private _userpostedService : EcommerceUserPostedService,
        private _router :Router,private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
    ) {
        // Set the defaults
        this.adduserpostedBikeForm = this.createComposeForm();
        this.showExtraToFields = false;
    }
    ngOnInit() {
        this.mapsAPILoader.load().then(() => {
     
            let autocomplete = new google.maps.places.Autocomplete(this.bikeCitySearchElementRef.nativeElement, {
              types: ['(cities)']
            });
            autocomplete.addListener("place_changed", () => {
              this.ngZone.run(() => {
                //get the place result
      
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();
      
                this.location = place.name;
                //this.citySelectionChange(this.selectedCity);
               
              });
            });
          });
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
               // this._userpostedService.getUserPostedBikes();
               this._userpostedService.getUserPostedBikes('userpostedbikes')
                .then(data => {
                    //this.bikes = res;
                    this.getuserpostedbikes = data.UserpostedBikes;
                  
        
                })
            }
        });
        this._adminuserpostedbikeService.getBikebrands()
        .then(data => {
            this.getbikebrand = data.BikeBrands;
        })
        this._adminuserpostedbikeService.getBikemodels()
        .then(data => {
            this.getbikemodel = data.Bike;
        })
        this._adminuserpostedbikeService.getCountries()
        .then(data => {
            this.countries = data.Countries;
        })

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
            Title: new FormControl(''),
            BrandID : new FormControl(''),
            ModelID : new FormControl(''),
            ManufacturedYear :new  FormControl(''),
            RegistrationYear: new FormControl(''),
            KMdriven: new FormControl(''),
            ImageURLs: new FormControl([]),
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
  onAddUserPostedBike() {
    this.adduserpostedBikeForm.value.ImageURLs = this.urls;
    this.adduserpostedBikeForm.value.UserID = localStorage.getItem('AdminUserID');
    this.adduserpostedBikeForm.value.Location = this.location;
    this.adduserpostedBikeForm.value.Type = 'admin';
    this._adminuserpostedbikeService.adduserPostedBike(this.adduserpostedBikeForm.value).then((data) => {

        // Show the success message
        if (data.Status == 1) {

            // let result = data.VendorDetails;
            // console.log(result);
            alert("UserPosted Bike added successfully");
           // this._router.navigate(['apps/e-commerce/user-posted']);
           // this.refresh.next(true);
            this.matDialogRef.close(true);
        
        }
        else
            alert(data.Message);
    });
}
    
}
