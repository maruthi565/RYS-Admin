import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';
import { EcommerceAddBikeBrandService } from './add-bike-brand.service';
import { Router } from '@angular/router';
import { EcommerceBikeBrandService } from 'app/main/apps/e-commerce/images/images.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'add-bike-brand',
    templateUrl: './add-bike-brand.component.html',
    styleUrls: ['./add-bike-brand.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddBikeBrandComponent {
    showExtraToFields: boolean;
    addBikeBrandForm: FormGroup;
    Checked = true;
    isChecked = true;
    fileData: File = null;
    previewUrl: any = null;
    //fileUploadProgress: string = null;
    showId=true;
    refresh: Subject<any> = new Subject();


    /**
     * Constructor
     *
     * @param {MatDialogRef<AddBikeBrandComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public _addbikebrandService: EcommerceAddBikeBrandService,
        private _bikebrandsService: EcommerceBikeBrandService,
        private _router: Router,
        public matDialogRef: MatDialogRef<AddBikeBrandComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any

    ) {
        // Set the defaults
        this.addBikeBrandForm = this.createComposeForm();
        this.showExtraToFields = false;
    }

    ngOnInit() {
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._bikebrandsService.getBikeBrands('bikebrands');
            }
        });
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
            BrandName: new FormControl(''),
            Image: new FormControl(''),
            RSA: new FormControl('')

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
    onChange(event) {
    
        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
    
                reader.onload = (event:any) => {
                let imageSplits = event.target.result.split(',');
            console.log(imageSplits[1]);
            if(imageSplits != undefined && imageSplits[1] != undefined){
             this.addBikeBrandForm.value.Image = imageSplits[1];
            console.log(this.addBikeBrandForm.value.Image);
            }       
                       
            }
    
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    onAddBikeBrand() {
        this._addbikebrandService.addBikeBrand(this.addBikeBrandForm.value).then((data) => {

            // Show the success message
            if (data.Status == 1) {

                // let result = data.VendorDetails;
                // console.log(result);
                alert("Bike Brand added successfully");
                //this._router.navigate(['apps/e-commerce/images']);
                this.refresh.next(true);
                this.matDialogRef.close(true);
            }
            else
                alert(data.Message);
        });
    }

}
