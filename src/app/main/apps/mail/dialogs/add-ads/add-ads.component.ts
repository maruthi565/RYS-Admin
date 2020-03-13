import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormControl, FormGroup ,Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption, MatRadioButton } from '@angular/material';
import { EcommerceAddBikeModelService } from '../add-bike-model/add-bike-model.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { EcommerceAddAddsService } from './add-ads.service';
import { Router } from '@angular/router';
import { EcommerceAdsService } from 'app/main/apps/e-commerce/ads-posted/ads-posted.service';
import { MapsAPILoader } from '@agm/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
    selector: 'add-ads',
    templateUrl: './add-ads.component.html',
    styleUrls: ['./add-ads.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddAdsComponent {
    showExtraToFields: boolean;
    addForm: FormGroup;
    Checked = true;
    isChecked = true;
    private _unsubscribeAll: Subject<any>;
    bikeBrands:any[];
    countries: any;
    fileData: File = null;
    previewUrl: any = null;
    //fileUploadProgress: string = null;
    showId=true;
    adsimage :any;
    selectedadsCity :string;
    image :any;

    @ViewChild('adsCitySearch', { static: false }) private adsCitySearchElementRef: ElementRef;

    //@ViewChild('adsCitySearch', { static: false }) adsCitySearchElementRef ;
    display = false;


    // locationList = [
    //     {
    //         key: 1, value: 'Hyderabad',
    //     },
    //     {
    //         key: 2, value: 'Bangalore',
    //     },
    //     {
    //         key: 3, value: 'Chennai',
    //     },
    //     {
    //         key: 4, value: 'Host an Event',
    //     }
    // ];

    @ViewChild('pan', { static: true })
    pan: MatRadioButton;

    @ViewChild('city', { static: true })
    city: MatRadioButton;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AddAdsComponent>} matDialogRef
     * @param _data
     */
    constructor(
        private _addsService:EcommerceAddAddsService,
        private _ecommerceadsService:EcommerceAdsService,
        public matDialogRef: MatDialogRef<AddAdsComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
        private imageCompress: NgxImageCompressService,

        private _router:Router
    ) {
        // Set the defaults
        this.addForm = this.createComposeForm();
        this.showExtraToFields = false;
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    ngOnInit() {
        this.display = true;
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

      
        this._addsService.getCountries()
        .then(data => {
            this.countries = data.Countries;
        })
        this._addsService.getBikeBrands()
        .then(data => {
            this.bikeBrands = data.BikeBrands;
        })
       
    // this.addForm.patchValue({
    //     Location: 'Paid'
        
    //   });
    }
    /**
     * Create compose form
     *
     * @returns {FormGroup}
     */
    createComposeForm(): FormGroup {
        return new FormGroup({
            CallToAction: new FormControl('',Validators.required),
            WebsiteURL: new FormControl('',Validators.required),
            Brand: new FormControl('',Validators.required),
            Location: new FormControl([],Validators.required),
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
    
    // onChange(event) {
    
    //     if (event.target.files && event.target.files[0]) {
    //         var filesAmount = event.target.files.length;
    //         for (let i = 0; i < filesAmount; i++) {
    //             var reader = new FileReader();
    
    //         reader.onload = (event:any) => {
    //         let imageSplits = event.target.result.split(',');
    //         console.log(imageSplits[1]);
    //         if(imageSplits != undefined && imageSplits[1] != undefined){
    //             this.adsimage =  imageSplits[1];
    //             this.addForm.value.ImageURL = this.adsimage ;
    //                 console.log(this.addForm.value.ImageURL);
    //         }       
                       
    //         }
    
    //             reader.readAsDataURL(event.target.files[i]);
    //         }
    //     }
      
        
    // }
  
    onChange() {


        if (this.addForm.value.ImageURL <= 1) {
    
          this.imageCompress.uploadFile().then(({ image, orientation }) => {
            this.image = image;
            let isPNG: boolean = image.includes('image/png');
            let isJPEG: boolean = image.includes('image/jpeg');
            if (isPNG || isJPEG) {
              //console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
              if (this.imageCompress.byteCount(image) < 200000) {
                let imageSplits = image.split(',');
                //console.log(imageSplits[1]);
                if (imageSplits != undefined && imageSplits[1] != undefined) {
                    this.adsimage =  imageSplits[1];
                     this.addForm.value.ImageURL = this.adsimage ;
    
                }
                //console.warn('Size in bytes is now:', this.imageCompress.byteCount(image));
              }
              else {
                this.imageCompress.compressFile(image, orientation, 20, 20).then(
                  result => {
                    this.image = result;
                    let imageSplits = result.split(',');
                    //console.log(imageSplits[1]);
                    if (imageSplits != undefined && imageSplits[1] != undefined) {
                     this.adsimage =  imageSplits[1];
                     this.addForm.value.ImageURL = this.adsimage ;
    
                    }
                    //console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
                  }
                );
              }
              //this.isCheck = false;
            }
            else{
              alert("Please select only png/jpeg file format");
            }
    
    
          });
        }
     
    
      }  
   
    onAddPost() {

       if(this.addForm.invalid) {
      alert ("Please fill all the details");
    }
      else {

        if (this.pan.checked) {
            this.addForm.patchValue({
              Location: ["Pan"]
           });
          }
          else if (this.city.checked){
              this.addForm.value.Location = this.selectedadsCity;
              console.log(this.addForm.value.Location);
        } 
       
        this.addForm.value.ImageURL = this.adsimage;
        this.addForm.value.UserID = localStorage.getItem('AdminUserID');  
        console.log(this.addForm.value); 
        this._addsService.addAds(this.addForm.value).then((data) => {
            console.log(this.addForm.value); 


            if (data.Status == 1) {

                alert("Ads added successfully");
                this.matDialogRef.close(true);
            }
            else
                alert(data.Message);
        });
    }
  }

}
