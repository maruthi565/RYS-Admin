import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption, MatRadioButton } from '@angular/material';
import { EcommerceEditAdsService } from './edit-ads.service';
import { Router } from '@angular/router';
import { EcommerceAdsService } from 'app/main/apps/e-commerce/ads-posted/ads-posted.service';
import { EcommerceAddAddsService } from '../add-ads/add-ads.service';
import { Subject } from 'rxjs';
import { MapsAPILoader } from '@agm/core';

@Component({
    selector: 'edit-ads',
    templateUrl: './edit-ads.component.html',
    styleUrls: ['./edit-ads.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditAdsComponent {
    showExtraToFields: boolean;
    editAdsForm: FormGroup;
    Checked = true;
    isChecked = true;
    fromPage  : any;
    AdminAdID : number;
    fileData: File = null;
    previewUrl: any = null;
    //fileUploadProgress: string = null;
    showId = true;
    adsimage: any;
    countries: any;
    bikeBrands: any;
    ImageURL: any;
    hideImage = true;
    selectedadsCity :string;
    flag:any;
    location :any;
    
    
    @ViewChild('adsCitySearch', { static: false }) private adsCitySearchElementRef: ElementRef;

    @ViewChild('allSelected', { static: true })
    allSelected: MatOption;

    @ViewChild('pan', { static: true })
    pan: MatRadioButton;

    @ViewChild('city', { static: true })
    city: MatRadioButton;

    /**
     * Constructor
     *
     * @param {MatDialogRef<EditAdsComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<EditAdsComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _editAdsService: EcommerceEditAdsService,
        private _ecommerceadsService : EcommerceAdsService,
        private _adsService: EcommerceAddAddsService,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
        private _router:Router
    ) {
        // Set the defaults
        this.editAdsForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.editAdsValue;
        console.log(this.fromPage);
        this.AdminAdID = this.fromPage.AdminAdID;
    }
    ngOnInit() {

        this.mapsAPILoader.load().then(() => {
            /*   let autocomplete = new google.maps.places.Autocomplete(this.eventCitySearchElementRef.nativeElement);
              autocomplete.setFields(
                ['(cities)']); */
              //autocomplete.bindTo('bounds', map);
              let autocomplete = new google.maps.places.Autocomplete(this.adsCitySearchElementRef.nativeElement, {
                types: ['(cities)']
              });
              //autocomplete.setFields(['address_component']);
              autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                  //get the place result
        
                  let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        
                 this.selectedadsCity = place.name;
                  //this.createEventForm.value.InviteCities = place.name;
                 
                });
              });
            });
       
        this._adsService.getCountries()
        .then(data => {
            this.countries = data.Countries;
        })
        this._adsService.getBikeBrands()
        .then(data => {
            this.bikeBrands = data.BikeBrands;
        })
        this.editAdsForm.patchValue(this.fromPage);
        this.AdminAdID = this.fromPage.AdminAdID;
        this.ImageURL = this.fromPage.ImageURL;
      
        this.location = this.fromPage.Location[0];
        console.log(this.location);

        if ( this.location === "Pan") {
            
             this.pan.checked = true;
           
          }
          else {
            this.city.checked = true;
        } 
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
            AdminAdID: new FormControl(''),
            CallToAction: new FormControl(''),
            WebsiteURL: new FormControl(''),
            Brand: new FormControl(''),
            Location: new FormControl([]),
            ImageURL: new FormControl(''),
            CountryID: new FormControl('')
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files[0];
        this.preview();
    }
    hide() {
        this.hideImage = !this.hideImage;
    }
 
    preview() {
        // Show preview 
        var mimeType = this.fileData.type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(this.fileData);
        reader.onload = (_event) => {
            this.previewUrl = reader.result;
            this.showId = !this.showId; 
               // this.isShow =true; 
                
        }
    }
    onChange(event) {
    
        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
    
                reader.onload = (event:any) => {
                let imageSplits = event.target.result.split(',');
            console.log(imageSplits[1]);
            if(imageSplits != undefined && imageSplits[1] != undefined){

              this.adsimage =  imageSplits[1];
                this.editAdsForm.value.ImageURL = this.adsimage ;
            console.log(this.editAdsForm.value.ImageURL);
            }       
                       
            }
    
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    onEditAd() {
        if (this.pan.checked) {
            this.editAdsForm.patchValue({
              Location: ["Pan"]
            });
          }
          else {
              this.editAdsForm.value.Location = this.selectedadsCity;
            }
        this.editAdsForm.value.ImageURL = this.adsimage;

        this.editAdsForm.value.AdminAdID = this.AdminAdID;
       // var bikeJSON: any;
       // bikeJSON = (this.editBikeBrandForm.value);
        this._editAdsService.editAds(this.editAdsForm.value).then((data) => {

            
            if (data.Status == 1) {

                
                alert("Ads Posted Updated successfully");
               // this._router.navigate(['apps/e-commerce/ads-posted']);
                this.matDialogRef.close(true);
            }
            else
                alert(data.Message);
        });
    }

}
