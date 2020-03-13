import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EcommerceEditUserMerchandiseService } from './edit-merchandise.service';
import { Router } from '@angular/router';
import { EcommerceAddAdminUserMerchandiseService } from '../add-merchandise/add-merchandsie.service';


@Component({
    selector: 'edit-merchandise',
    templateUrl: './edit-merchandise.component.html',
    styleUrls: ['./edit-merchandise.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditMerchandiseComponent {
    showExtraToFields: boolean;
    editMerchandiseDialogForm: FormGroup;
    fromPage : any;
    ID : any;
    images: any;
    urls = [];
    htmlUrls = [];
    countries:any;



    /**
     * Constructor
     *
     * @param {MatDialogRef<EditMerchandiseComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<EditMerchandiseComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _userpostededitMerchandise : EcommerceEditUserMerchandiseService,
        private _router : Router,
        private _userpostedMerchandiseService: EcommerceAddAdminUserMerchandiseService,
    ) {
        // Set the defaults
        this.editMerchandiseDialogForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.editMerchandiseValue;
        console.log(this.fromPage);
    }

    ngOnInit() {
      this._userpostedMerchandiseService.getCountries()
        .then(data => {
            this.countries = data.Countries;
        })
        this.editMerchandiseDialogForm.patchValue(this.fromPage);
        this.ID = this.fromPage.UserPostedMerchandiseID;
        this.images = this.fromPage.ImageURLs;
        console.log(this.images);
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
            UserPostedMerchandiseID: new FormControl(''),
            Title: new FormControl(''),
            PurchaseDate: new FormControl(''),
            Location: new FormControl(''),
            Contact: new FormControl(''),
            Email: new FormControl(''),
            Price: new FormControl(''),
           // ImageURLs: new FormControl([]),
            CountryID : new FormControl('')

        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

    onChange(event) {
        if (this.urls.length <= 4 && event.target.files.length <= 4) {
          if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
              //var qual = compressor.compress(event.target.files[i], {quality: .5})
              var reader = new FileReader();
    
              reader.onload = (event: any) => {
    
                let imageSplits = event.target.result.split(',');
                console.log(imageSplits[1]);
                if (imageSplits != undefined && imageSplits[1] != undefined) {
                  this.htmlUrls.push(event.target.result);
                  this.urls.push(imageSplits[1]);
    
                }
              }
    
              reader.readAsDataURL(event.target.files[i]);
             // this.isCheck = false;
            }
          }
        }
        else {
          alert("Max files limit is 3 ")
        }
    
      }
      onEditUserPostedMerchandise() {
      //  this.editMerchandiseDialogForm.value.ImageURLs = this.urls;
       // this.editMerchandiseDialogForm.value.UserID = localStorage.getItem('AdminUserID');
      //  this.editMerchandiseDialogForm.value.Type = 'admin';
      this.editMerchandiseDialogForm.value.ID = this.ID;
        this._userpostededitMerchandise.editUserMerchandise(this.editMerchandiseDialogForm.value).then((data) => {
    
            // Show the success message
            if (data.Status == 1) {
    
                // let result = data.VendorDetails;
                // console.log(result);
                alert("UserPosted Merchandise updated successfully");
                //this._router.navigate(['apps/e-commerce/user-posted']);
                //this.refresh.next(true);
                this.matDialogRef.close(true);
            
            }
            else
                alert(data.Message);
        });
    }
}
