import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { MatOption } from '@angular/material';
import { EcommerceAddMerchandiseService } from './add-merchandise.service';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
    selector: 'e-commerce-add-merchandise',
    templateUrl: './add-merchandise.component.html',
    styleUrls: ['./add-merchandise.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceAddMerchandiseComponent {
    showExtraToFields: boolean;
    addProductForm: FormGroup;
    fileData: File = null;
    previewUrl: any = null;
    showId = true;
    categorieslist: any;
    getcountries: any;
    isShoe  =false;
    isJacket = false;
    urls = [];
    htmlUrls = [];
    ProductAvailability :  any[];

   
    sizeList = [
        {
            key: 'S', value: 'S',
        },
        {
            key: 'M', value: 'M',
        },
        {
            key: 'XL', value: 'XL',
        },
        {
            key: 'XXXL', value: 'XXXL',
        }
    ];
    shoeList = [
        {
            key: '26', value: '26',
        },
        {
            key: '28', value: '28',
        },
        {
            key: '30', value: '30',
        },
        {
            key: '40', value: '40',
        }
    ];
    cityList = [
        {
            key: 'Hyderabad', value: 'Hyderabad',
        },
        {
            key: 'Bangalore', value: 'Bangalore',
        },
        {
            key: 'Pune', value: 'Pune',
        },
        {
            key: 'Mumbai', value: 'Mumbai',
        }
    ];
    // @ViewChild('allSelected') private allSelected: MatOption;

    // @ViewChild('allSelected', { static: true })
    // allSelected: MatOption;

    @ViewChild('allSelect', { static: true })
    allSelect: MatOption;

    @ViewChild('allSelects', { static: true })
    allSelects: MatOption;

    @ViewChild('allSelectShoe', { static: true })
    allSelectShoe :MatOption
    /**
     * Constructor
     *
     * @param {MatDialogRef<EcommerceAddMerchandiseComponent>} matDialogRef
     * @param _data
     */

    constructor(
        private _ecommerceAddMerchandiseService: EcommerceAddMerchandiseService,
        private _router: Router,
        private imageCompress: NgxImageCompressService
    ) {
        // Set the defaults
        this.addProductForm = this.createComposeForm();
        this.showExtraToFields = false;
    }
    ngOnInit() {
        this._ecommerceAddMerchandiseService.getCategories()
            .then(data => {
                this.categorieslist = data.MerchandiseCategories;
            })
        this._ecommerceAddMerchandiseService.getCountries()
            .then(data => {
                this.getcountries = data.Countries;
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
            Title: new FormControl(''),
            Description: new FormControl(''),
            DiscountedPrice: new FormControl(''),
            MobileNumber: new FormControl(''),
            Catgegory: new FormControl(''),
            CountryID: new FormControl(''),
            MerchandiserName: new FormControl(''),
            VendorAddress: new FormControl(''),
            Size: new FormControl(''),
            ProductImages: new FormControl([]),
            Logo: new FormControl(''),
            ProductAvailability: new FormControl(''),
            EmailID: new FormControl(''),
            VendorID: new FormControl(''),
            Price: new FormControl(''),
            Terms_Conditions:
                new FormArray([
                    new FormControl(null)
                ])

        });
    }
    get Terms_Conditions(): FormArray { return this.addProductForm.get('Terms_Conditions') as FormArray; }
    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    onAddTerms_Conditions() {
        this.Terms_Conditions.push(new FormControl());
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

            // this.isShow =true; 
            this.showId = !this.showId;
        }
    }

    // onChange(event) {

    //     if (event.target.files && event.target.files[0]) {
    //         var filesAmount = event.target.files.length;
    //         for (let i = 0; i < filesAmount; i++) {
    //             var reader = new FileReader();

    //             reader.onload = (event: any) => {
    //                 console.log(event.target.result);

    //                 // this.addCouponForm.value.Image = event.target.result;
    //                 // console.log(this.addCouponForm.value.Image);


    //             }

    //             reader.readAsDataURL(event.target.files[i]);
    //         }
    //     }
    // }
    onChange(event) {

        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event: any) => {
                    let imageSplits = event.target.result.split(',');
                    console.log(imageSplits[1]);
                    if (imageSplits != undefined && imageSplits[1] != undefined) {
                        this.addProductForm.value.Logo = imageSplits[1];
                        console.log(this.addProductForm.value.Logo);

                    }

                }

                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    onChangeProductImages(event) {

        if (this.urls.length <= 4 && event.target.files.length <= 4) {
            if (event.target.files && event.target.files[0]) {
              var filesAmount = event.target.files.length;
              for (let i = 0; i < filesAmount; i++) {
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
              }
            }
          }
          else {
            alert("Max files limit is 3 ")
          }
  
    }



    // onChangeProductImages() {


    //     if (this.urls.length <= 4) {
    
    //       this.imageCompress.uploadFile().then(({ image, orientation }) => {
    //         let isPNG: boolean = image.includes('image/png');
    //         let isJPEG: boolean = image.includes('image/jpeg');
    //         if (isPNG || isJPEG) {
    //           //console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
    //           if (this.imageCompress.byteCount(image) < 200000) {
    //             let imageSplits = image.split(',');
    //             //console.log(imageSplits[1]);
    //             if (imageSplits != undefined && imageSplits[1] != undefined) {
    //               this.htmlUrls.push(image);
    //               this.urls.push(imageSplits[1]);
    
    //             }
    //             //console.warn('Size in bytes is now:', this.imageCompress.byteCount(image));
    //           }
    //           else {
    //             this.imageCompress.compressFile(image, orientation, 20, 20).then(
    //               result => {
    //                 let imageSplits = result.split(',');
    //                 //console.log(imageSplits[1]);
    //                 if (imageSplits != undefined && imageSplits[1] != undefined) {
    //                   this.htmlUrls.push(result);
    //                   this.urls.push(imageSplits[1]);
    
    //                 }
    //                 //console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
    //               }
    //             );
    //           }
    //           //this.isCheck = false;
    //         }
    //         else{
    //           alert("Please select only png/jpeg file format");
    //         }
    
    
    //       });
    //     }
    //     else {
    //       alert("Max files limit is 3 ")
    //     }
    
    //   }
    onAddMerchandise() {
        this.addProductForm.value.VendorID = Number(localStorage.getItem('AdminUserID'));
        this.addProductForm.value.StoreID = 14244062;
        this.addProductForm.value.City = "Hyderabad";

        let sizearray = this.addProductForm.value.Size;
        if(sizearray.length > this.sizeList.length) { 
        let removedSize = sizearray.pop();
        this.addProductForm.value.Size = sizearray;
        }
       
        let cityarray = this.addProductForm.value.ProductAvailability;
        if(cityarray.length > this.cityList.length) {
        let removedCity = cityarray.pop();
        this.addProductForm.value.ProductAvailability = cityarray;
        }
     
        this.addProductForm.value.ProductImages = this.urls;
 
        this.addProductForm.value.Price = Number(this.addProductForm.value.Price);
        this.addProductForm.value.DiscountedPrice = Number(this.addProductForm.value.DiscountedPrice);
        this._ecommerceAddMerchandiseService.addMerchandise(this.addProductForm.value).then((data) => {

            // Show the success message
            if (data.Status == 1) {
                //let result = data.VendorDetails;
                alert("Merchandise added successfully");
                this._router.navigate(['apps/e-commerce/after-market']);
            }
            else
                alert(data.Message);
        });
    }
    // tosslePerOne(all): boolean {
    //     if (this.allSelected.selected) {
    //         this.allSelected.deselect();
    //         return false;
    //     }
    //     if (this.addProductForm.controls.Catgegory.value.length === this.categoryList.length) {
    //         this.allSelected.select();
    //     }
    // }
    // toggleAllSelection(): void {
    //     if (this.allSelected.selected) {
    //         this.addProductForm.controls.Catgegory
    //             .patchValue([...this.categoryList.map(item => item.key), 0]);
    //     } else {
    //         this.addProductForm.controls.Catgegory.patchValue([]);
    //     }
    // }
    onCategorySelection() {
        //console.log(this.addProductForm.value.Catgegory);
        if(this.addProductForm.value.Catgegory === "Shoes") {
            this.isJacket = false;
            this.isShoe = true;
        }
        
        if(this.addProductForm.value.Catgegory === "Jackets") {
            this.isJacket = true;
            this.isShoe = false;
        }
    }
    tosslePerTwo(all): boolean {
        if (this.allSelects.selected) {
            this.allSelects.deselect();
            return false;
        }
        if (this.addProductForm.controls.Size.value.length === this.sizeList.length) {
            this.allSelects.select();
        }
    }
    toggleAllSelectionSize(): void {
        if (this.allSelects.selected) {
            this.addProductForm.controls.Size
                .patchValue([...this.sizeList.map(item => item.key), 0]);
        } else {
            this.addProductForm.controls.Size.patchValue([]);
        }
    }
    tosslePerFour(all): boolean {
        if (this.allSelectShoe.selected) {
            this.allSelectShoe.deselect();
            return false;
        }
        if (this.addProductForm.controls.Size.value.length === this.shoeList.length) {
            this.allSelectShoe.select();
        }
    }
    toggleAllSelectionShoe(): void {
        if (this.allSelectShoe.selected) {
            this.addProductForm.controls.Size
                .patchValue([...this.shoeList.map(item => item.key), 0]);
        } else {
            this.addProductForm.controls.Size.patchValue([]);
        }
    }
   
    tosslePerThree(all): boolean {
        if (this.allSelect.selected) {
            this.allSelect.deselect();
            return false;
        }
        if (this.addProductForm.controls.ProductAvailability.value.length === this.cityList.length) {
            this.allSelect.select();
        }
    }
    toggleAllSelectionCity(): void {
        if (this.allSelect.selected) {
            this.addProductForm.controls.ProductAvailability
                .patchValue([...this.cityList.map(item => item.key), 0]);
        } else {
            this.addProductForm.controls.ProductAvailability.patchValue([]);
        }
    }
}


