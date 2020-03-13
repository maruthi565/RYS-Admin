import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';
import { EcommerceAddEventImageService } from './add-event-image.service';
import { Router } from '@angular/router';
import { EcommerceEventImagesService } from 'app/main/apps/e-commerce/event-image/event-image.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'add-event-image',
    templateUrl: './add-event-image.component.html',
    styleUrls: ['./add-event-image.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddEventImageComponent {
    showExtraToFields: boolean;
    addEventImageForm: FormGroup;
    fileData: File = null;
    previewUrl: any = null;
    showId=true;
    refresh: Subject<any> = new Subject();
    images : any;



    /**
     * Constructor
     *
     * @param {MatDialogRef<AddEventImageComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AddEventImageComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private  _eventImageService: EcommerceAddEventImageService,
        private _eventImagesService: EcommerceEventImagesService,
        private _router:Router
    ) {
        // Set the defaults
        this.addEventImageForm = this.createComposeForm();
        this.showExtraToFields = false;
    }

    ngOnInit() {
        // this.refresh.subscribe(updateDB => {
        //     if (updateDB) {
        //         this._eventImagesService.getEventImages();
        //     }
        // });
        this.getEventImages();
    }
    getEventImages() {
        this._eventImagesService.getEventImages()
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
             this.addEventImageForm.value.ImageURL = imageSplits[1];
            console.log(this.addEventImageForm.value.ImageURL);
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

    onEventImage() {
        if(this.addEventImageForm.invalid){
            alert ("Please Add Image");
        }
        // if(this.addEventImageForm.value.ImageURL == []){
        //     alert ("Please Add Image");
        // }
        else if(this.addEventImageForm.value.ImageURL != []) {
        this.addEventImageForm.value.Type = 0;
        this._eventImageService.addEventImage(this.addEventImageForm.value).then((data) => {

            if (data.Status == 1) {

                alert("Default Event Image added successfully");
                this._router.navigate(['apps/e-commerce/event-image']);
                this.getEventImages();
                this.matDialogRef.close();
            }
            else
                alert(data.Message);
        });
    }
}


}
