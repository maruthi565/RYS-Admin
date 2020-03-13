import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';
import { EcommerceAddBikeModelService } from './add-bike-model.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'add-bike-model',
    templateUrl: './add-bike-model.component.html',
    styleUrls: ['./add-bike-model.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddBikeModelComponent {
    showExtraToFields: boolean;
    addbikemodelForm: FormGroup;
    Checked = true;
    isChecked = true;
    bikeBrands: any[];
    private _unsubscribeAll: Subject<any>;
    fileData: File = null;
    previewUrl: any = null;
    showId=true;

    

    @ViewChild('allSelected', { static: true })
    allSelected: MatOption;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AddBikeModelComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public _addbikemodelService: EcommerceAddBikeModelService,
        private _router: Router,
        public matDialogRef: MatDialogRef<AddBikeModelComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        // Set the defaults
        this.addbikemodelForm = this.createComposeForm();
        this.showExtraToFields = false;
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    ngOnInit() {
        // this._addbikemodelService.onBikeBrandChanged
        // .pipe(takeUntil(this._unsubscribeAll))
        // .subscribe(bikebrands => {
  
        //   if (bikebrands.Status == 1) {
        //     this.bikeBrands = bikebrands.BikeBrands;
            
        //   }
  
  
        // });
        this._addbikemodelService.getBikeBrands()
        .then(data => {
            this.bikeBrands = data.BikeBrands;
        })
    }
    /**
     * Create compose form
     *
     * @returns {FormGroup}
     */
    createComposeForm(): FormGroup {
        return new FormGroup({
           BrandID: new FormControl(''),
            ModelName: new FormControl(''),
            Image: new FormControl('')

        });
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
    onChange(event) {
    
        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
    
                reader.onload = (event:any) => {
                let imageSplits = event.target.result.split(',');
            console.log(imageSplits[1]);
            if(imageSplits != undefined && imageSplits[1] != undefined){
             this.addbikemodelForm.value.Image = imageSplits[1];
            console.log(this.addbikemodelForm.value.Image);
            }       
                       
            }
    
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    
    onAddBikeModel() {
        // this.addAdminUserForm.value.VendorID = Number(localStorage.getItem('VendorID'));
        // this.addStoreForm.value.CountryID = 2;
        // this.addStoreForm.value.StoreImages = "images";
        // this.addStoreForm.value.StoreLogo = "mtouch";
        // this.addStoreForm.value.VoucherValue = Number(this.addStoreForm.value.VoucherValue);
        // this.addStoreForm.value.Price = Number(this.addStoreForm.value.Price);
        this._addbikemodelService.addBikeModel(this.addbikemodelForm.value).then((data) => {

            // Show the success message
            if (data.Status == 1) {

                // let result = data.VendorDetails;
                // console.log(result);
                alert("Bike Model added successfully");
                this.matDialogRef.close();
                //this._router.navigate(['apps/e-commerce/bike-brand-detail']);
               
            }
            else
                alert(data.Message);
        });
    }
}
