import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EcommerceAddAdminUserMerchandiseService } from './add-merchandsie.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MapsAPILoader } from '@agm/core';

@Component({
    selector: 'add-merchandise',
    templateUrl: './add-merchandise.component.html',
    styleUrls: ['./add-merchandise.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddMerchandiseComponent {
    showExtraToFields: boolean;
    addUserMerchandiseForm: FormGroup;
    urls = [];
    htmlUrls = [];
    countries:any;
    location :any;
    today=new Date();

    @ViewChild('merchandiseCitySearch', { static: true }) private merchandiseCitySearchElementRef: ElementRef;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AddMerchandiseComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AddMerchandiseComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _userpostedMerchandiseService: EcommerceAddAdminUserMerchandiseService,
        private _router:Router,private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,private datePipe: DatePipe
    ) {
        // Set the defaults
        this.addUserMerchandiseForm = this.createComposeForm();
        this.showExtraToFields = false;
    }


    ngOnInit() {

      this.mapsAPILoader.load().then(() => {
     
        let autocomplete = new google.maps.places.Autocomplete(this.merchandiseCitySearchElementRef.nativeElement, {
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
        this._userpostedMerchandiseService.getCountries()
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
            PurchaseDate: new FormControl(''),
            Location: new FormControl(''),
            Contact: new FormControl(''),
            Email: new FormControl(''),
            Price: new FormControl(''),
            ImageURLs: new FormControl([]),
            CountryID : new FormControl('')


        });
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
    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    onAddUserPostedMerchandise() {
        this.addUserMerchandiseForm.value.Location = this.location;
        this.addUserMerchandiseForm.value.ImageURLs = this.urls;
        this.addUserMerchandiseForm.value.UserID = localStorage.getItem('AdminUserID');
        this.addUserMerchandiseForm.value.Type = 'admin';
        this.addUserMerchandiseForm.value.PurchaseDate = this.datePipe.transform(this.addUserMerchandiseForm.value.PurchaseDate, 'yyyy-MM-dd');
        this._userpostedMerchandiseService.adduserPostedMerchandise(this.addUserMerchandiseForm.value).then((data) => {
    
            // Show the success message
            if (data.Status == 1) {
    
                alert("User Merchandise added successfully");
                this._router.navigate(['apps/e-commerce/user-posted']);
                //this.refresh.next(true);
                this.matDialogRef.close(true);
            
            }
            else
                alert(data.Message);
        });
    }
}
