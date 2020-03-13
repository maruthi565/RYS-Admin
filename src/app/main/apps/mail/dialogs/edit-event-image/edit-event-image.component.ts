import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';
import { EcommerceEditEventImageService } from './edit-event-image.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EcommerceEventImagesService } from 'app/main/apps/e-commerce/event-image/event-image.service';

@Component({
    selector: 'edit-event-image',
    templateUrl: './edit-event-image.component.html',
    styleUrls: ['./edit-event-image.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditEventImageComponent {
    showExtraToFields: boolean;
    editEventImageForm: FormGroup;
    Checked = true;
    isChecked = true;
    fromPage :any;
    ID :number;
    fileData: File = null;
    previewUrl: any = null;
    showId=true;
    refresh: Subject<any> = new Subject();
    ImageURL :any;
    hideImage = true;

    /**
     * Constructor
     *
     * @param {MatDialogRef<EditEventImageComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<EditEventImageComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private  _editEventImageService :EcommerceEditEventImageService,
        private _router:Router,
        private _eventImageService : EcommerceEventImagesService
    ) {
        // Set the defaults
        this.editEventImageForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.editeventValue;
        console.log(this.fromPage);
        this.ID = this.fromPage.ID;
        console.log(this.ID);
    }
    ngOnInit() {
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._eventImageService.getEventImages();
            }
        });
        this.editEventImageForm.patchValue(this.fromPage);
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
             this.editEventImageForm.value.ImageURL = imageSplits[1];
            console.log(this.editEventImageForm.value.ImageURL);
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

    onEditEventImage() {
       

        this.editEventImageForm.value.ID = this.ID;
       this._editEventImageService.editEventImage(this.editEventImageForm.value).then((data) => {

            
            if (data.Status == 1) {

                
                alert("Event Image Updated successfully");
                this._router.navigate(['apps/e-commerce/event-image']);
                this.refresh.next(true);
                this.matDialogRef.close();
            }
            else
                alert(data.Message);
        });
    }
}
