import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material';
//import { EcommerceAddBikeModelService } from './add-bike-model.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { EcommerceEditBikeModelService } from './edit-bike-model.service';
import { EcommerceAddBikeModelService } from '../add-bike-model/add-bike-model.service';
import { EcommerceAddAddsService } from '../add-ads/add-ads.service';

@Component({
    selector: 'edit-bike-model',
    templateUrl: './edit-bike-model.component.html',
    styleUrls: ['./edit-bike-model.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditBikeModelDialog {
    showExtraToFields: boolean;
    editbikemodelForm: FormGroup;
    Checked = true;
    isChecked = true;
    bikeBrands: any[];
    private _unsubscribeAll: Subject<any>;
    fileData: File = null;
    previewUrl: any = null;
    showId=true;
    fromPage : any;
    BikeModelID: number;
    Image : any;
    id: number;
    refresh: Subject<any> = new Subject();
    hideImage = true;
    bike :any;

    

    @ViewChild('allSelected', { static: true })
    allSelected: MatOption;

    /**
     * Constructor
     *
     * @param {MatDialogRef<EditBikeModelDialog>} matDialogRef
     * @param _data
     */
    constructor(
        public _editbikemodelService: EcommerceEditBikeModelService,
        private _router: Router,
        public matDialogRef: MatDialogRef<EditBikeModelDialog>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _addbikemodelService: EcommerceAddBikeModelService,
        private _adsService :EcommerceAddAddsService
    ) {
        // Set the defaults
        this.editbikemodelForm = this.createComposeForm();
        this.showExtraToFields = false;
        this._unsubscribeAll = new Subject();
        this.fromPage = _data.editBikeModelValue;
        console.log(this.fromPage);
        this.BikeModelID = this.fromPage.BikeModelID;

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    ngOnInit() { 
        this._adsService.getBikeBrands()
        .then(data => {
            this.bikeBrands = data.BikeBrands;
             console.log(this.bikeBrands);
        })
        // this._addbikemodelService.getBikeBrands()
        // .then(data => {
        //     this.bikeBrands = data.BikeBrands;
        // })
        // this.refresh.subscribe(updateDB => {
        //     if (updateDB) {
        //         this._editbikemodelService.getBikeBrands();
        //     }
        // });
        //this.bike = localStorage.getItem('BikeBrand');


        // this._addbikemodelService.getBikeBrands()
        // .then(data => {
        //     this.bikeBrands = data.BikeBrands;
        //     console.log(this.bikeBrands);
        // })
       

        this.editbikemodelForm.patchValue(this.fromPage);
        this.BikeModelID = this.fromPage.BikeModelID;
        this.Image = this.fromPage.Image;
        this.id = this.fromPage.BrandID;
    }
    /**
     * Create compose form
     *
     * @returns {FormGroup}
     */
    createComposeForm(): FormGroup {
        return new FormGroup({
            // BikeModelID: new FormControl(''),
            BrandID: new FormControl(''),
            ModelName: new FormControl(''),
            Image: new FormControl('')

        });
    }
    hide() {
        this.hideImage = !this.hideImage;
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
             this.editbikemodelForm.value.Image = imageSplits[1];
            console.log(this.editbikemodelForm.value.Image);
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
    
    onEditBikeModel() {
       
        
        this.editbikemodelForm.value.BikeModelID = this.BikeModelID;
       this._editbikemodelService.editBikeModel(this.editbikemodelForm.value).then((data) => {

            
            if (data.Status == 1) { 
                alert("Bike Model Updated successfully");
                this.matDialogRef.close(true);
            }
            else
                alert(data.Message);
        });
    }
}
