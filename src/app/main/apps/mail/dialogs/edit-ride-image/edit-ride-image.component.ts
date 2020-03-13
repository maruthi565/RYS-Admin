import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';
import { EcommerceRideImagesService } from 'app/main/apps/e-commerce/ride-image/ride-image.service';
import { Subject } from 'rxjs';
import { EcommerceEditRideImageService } from './edit-ride-image.service';
import { Router } from '@angular/router';

@Component({
    selector: 'edit-ride-image',
    templateUrl: './edit-ride-image.component.html',
    styleUrls: ['./edit-ride-image.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditRideImageComponent {
    showExtraToFields: boolean;
    editRideImageForm: FormGroup;
    fromPage: any;
    ID : number;
    ImageURL: any;
    fileData: File = null;
    previewUrl: any = null;
    showId=true;
    refresh: Subject<any> = new Subject();
    hideImage = true;


    /**
     * Constructor
     *
     * @param {MatDialogRef<EditRideImageComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<EditRideImageComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _rideImageService : EcommerceRideImagesService,
        private _editRideImageService: EcommerceEditRideImageService,
        private _router : Router
    ) {
        // Set the defaults
        this.editRideImageForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.editRideImageValue;
        console.log(this.fromPage);
        this.ID = this.fromPage.ID;
        console.log(this.ID);
    }

    ngOnInit() {
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._rideImageService.getRideImages();
            }
        });
        this.editRideImageForm.patchValue(this.fromPage);
        this.ImageURL = this.fromPage.ImageURL;
        this.ID = this.fromPage.ID;
        console.log(this.ID);
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
             this.editRideImageForm.value.ImageURL = imageSplits[1];
            console.log(this.editRideImageForm.value.ImageURL);
            }       
                       
            }
    
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }


    /**
     * Create compose form
     *
     * @returns {FormGroup}
     */
    createComposeForm(): FormGroup {
        return new FormGroup({
            ImageURL: new FormControl(''),
            ID : new FormControl('')

        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

    onEditRideImage() {
       

        this.editRideImageForm.value.ID = this.ID;
       this._editRideImageService.editRideImage(this.editRideImageForm.value).then((data) => {

            
            if (data.Status == 1) {

                
                alert("Ride Image Updated successfully");
                this._router.navigate(['apps/e-commerce/ride-image']);
                this.refresh.next(true);
                this.matDialogRef.close();
            }
            else
                alert(data.Message);
        });
    }

}
