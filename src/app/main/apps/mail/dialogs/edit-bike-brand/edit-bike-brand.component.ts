import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';
import { Router } from '@angular/router';
import { EcommerceEditBikeBrandService } from './edit-bike-brand.service';
import { Subject } from 'rxjs';
import { EcommerceBikeBrandService } from 'app/main/apps/e-commerce/images/images.service';

@Component({
    selector: 'edit-bike-brand',
    templateUrl: './edit-bike-brand.component.html',
    styleUrls: ['./edit-bike-brand.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditBikeBrandDialog {
    showExtraToFields: boolean;
    editBikeBrandForm: FormGroup;
    Checked = true;
    isChecked = true;
    fileData: File = null;
    previewUrl: any = null;
    //fileUploadProgress: string = null;
    showId = true;
    fromPage : any;
    BrandID : any;
    result :any;
    refresh: Subject<any> = new Subject();
    ImageURL : any;
    hideImage = true;

    /**
     * Constructor
     *
     * @param {MatDialogRef<EditBikeBrandDialog>} matDialogRef
     * @param _data
     */
    constructor(
       private _router: Router,
        public matDialogRef: MatDialogRef<EditBikeBrandDialog>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _editBikeBrandService: EcommerceEditBikeBrandService,
        private _bikebrandsService: EcommerceBikeBrandService

    ) {
        // Set the defaults
        this.editBikeBrandForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.pageValue;
        console.log(this.fromPage);
        this.BrandID = this.fromPage.BrandID;
    }
    ngOnInit() {
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._bikebrandsService.getBikeBrands('bikebrands');
            }
        });
        this.editBikeBrandForm.patchValue(this.fromPage);
        this.BrandID = this.fromPage.BrandID;
        this.ImageURL = this.fromPage.Image;
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
            BrandID: new FormControl(''),
            BrandName: new FormControl(''),
           //Image: new FormControl(''),
            RSA : new FormControl('')

        });
    }
    hide() {
        this.hideImage = !this.hideImage;
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
             this.editBikeBrandForm.value.Image = imageSplits[1];
            console.log(this.editBikeBrandForm.value.Image);
            }       
                       
            }
    
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    onEditBikeBrand() {
       

        this.editBikeBrandForm.value.BrandID = this.BrandID;
       this._editBikeBrandService.editBikeBrand(this.editBikeBrandForm.value).then((data) => {

            
            if (data.Status == 1) {

                
                alert("Bike Brand Updated successfully");
                this.refresh.next(true);
                this.matDialogRef.close(true);
            }
            else
                alert(data.Message);
        });
    }

}
