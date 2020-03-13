import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';
//import { EcommerceAddEventImageService } from './add-event-image.service';
import { Router } from '@angular/router';
import { EcommerceEventImagesService } from 'app/main/apps/e-commerce/event-image/event-image.service';
import { Subject } from 'rxjs';
import { EcommerceAddRideImageService } from './add-ride-image.service';
import { EcommerceRideImagesService } from 'app/main/apps/e-commerce/ride-image/ride-image.service';

@Component({
    selector: 'add-ride-image',
    templateUrl: './add-ride-image.component.html',
    styleUrls: ['./add-ride-image.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddRideImageDialog {
    showExtraToFields: boolean;
    addRideImageForm: FormGroup;
    fileData: File = null;
    previewUrl: any = null;
    showId=true;
    refresh: Subject<any> = new Subject();
    images : any;


    /**
     * Constructor
     *
     * @param {MatDialogRef<AddRideImageDialog>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AddRideImageDialog>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private  _rideImageService: EcommerceAddRideImageService,
        private _ridesImagesService: EcommerceRideImagesService,
        private _router:Router
    ) {
        // Set the defaults
        this.addRideImageForm = this.createComposeForm();
        this.showExtraToFields = false;
    }

    ngOnInit() {
        // this.refresh.subscribe(updateDB => {
        //     if (updateDB) {
        //         this._eventImagesService.getEventImages();
        //     }
        // });


        this.getRideImages();
    }
    getRideImages() {
        this._ridesImagesService.getRideImages()
        .then(data => {
            this.images = data.DefaultImages
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
            ImageURL: new FormControl('',Validators.required)

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
             this.addRideImageForm.value.ImageURL = imageSplits[1];
            console.log(this.addRideImageForm.value.ImageURL);
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

    onRideImage() {
        if(this.addRideImageForm.value.ImageURL == []){
            alert ("Please Add Image");
        } 
        else {
        this.addRideImageForm.value.Type = 1;
        this._rideImageService.addRideImage(this.addRideImageForm.value).then((data) => {

            // Show the success message
            if (data.Status == 1) {

                // let result = data.VendorDetails;
                // console.log(result);
                alert("Default Ride Image added successfully");
                this._router.navigate(['apps/e-commerce/ride-image']);
               this.getRideImages();
                this.matDialogRef.close();
            }
            else
                alert(data.Message);
        });
    }
}


}
