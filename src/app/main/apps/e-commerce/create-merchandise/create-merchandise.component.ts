import { Component, Inject, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormArray, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { MatOption } from "@angular/material";
import { EcommerceCreateMerchandiseService } from "./create-merchandise.service";
import { Router } from "@angular/router";

@Component({
  selector: "e-commerce-create-merchandise",
  templateUrl: "./create-merchandise.component.html",
  styleUrls: ["./create-merchandise.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceCreateMerchandiseComponent {
  showExtraToFields: boolean;
  addProductForm: FormGroup;
  fileData: File = null;
  previewUrl: any = null;
  showId = true;
  categorieslist: any;
  getcountries: any;
  isShoe = false;
  isJacket = false;
  stores: any;
  urls = [];
  htmlUrls = [];
  ProductAvailability: any[];
  vendorid: any;
  adminid: any;

  // categoryList = [
  //     {
  //         key: 'Clothing', value: 'Clothing',
  //     },
  //     {
  //         key: 'Accessories', value: 'Accessories',
  //     },
  //     {
  //         key: 'Shoes', value: 'Shoes',
  //     }
  //     // {
  //     //     key: 4, value: 'Others',
  //     // }
  // ];
  sizeList = [
    {
      key: "S",
      value: "S"
    },
    {
      key: "M",
      value: "M"
    },
    {
      key: "XL",
      value: "XL"
    },
    {
      key: "XXXL",
      value: "XXXL"
    }
  ];
  shoeList = [
    {
      key: "26",
      value: "26"
    },
    {
      key: "28",
      value: "28"
    },
    {
      key: "30",
      value: "30"
    },
    {
      key: "40",
      value: "40"
    }
  ];
  cityList = [
    {
      key: "Hyderabad",
      value: "Hyderabad"
    },
    {
      key: "Bangalore",
      value: "Bangalore"
    },
    {
      key: "Pune",
      value: "Pune"
    },
    {
      key: "Mumbai",
      value: "Mumbai"
    }
  ];
  // @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild("allSelected", { static: true })
  allSelected: MatOption;

  @ViewChild("allSelect", { static: true })
  allSelect: MatOption;

  @ViewChild("allSelects", { static: true })
  allSelects: MatOption;

  @ViewChild("allSelectShoe", { static: true })
  allSelectShoe: MatOption;
  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceCreateMerchandiseComponent>} matDialogRef
   * @param _data
   */

  constructor(
    private _ecommercecreateMerchandiseService: EcommerceCreateMerchandiseService,
    private _router: Router
  ) {
    // Set the defaults
    this.addProductForm = this.createComposeForm();
    this.showExtraToFields = false;
    this.vendorid = JSON.parse(localStorage.getItem("VendorID"));
    this.adminid = JSON.parse(localStorage.getItem("AdminUserID"));
  }
  ngOnInit() {
    this._ecommercecreateMerchandiseService.getCategories().then(data => {
      this.categorieslist = data.MerchandiseCategories;
    });
    this._ecommercecreateMerchandiseService.getCountries().then(data => {
      this.getcountries = data.Countries;
    });

    this._ecommercecreateMerchandiseService.getStores().then(data => {
      this.stores = data.Stores;
      console.log(this.stores);
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
      Title: new FormControl("", Validators.required),
      Description: new FormControl("", Validators.required),
      DiscountedPrice: new FormControl("", Validators.required),
      MobileNumber: new FormControl("", Validators.required),
      Catgegory: new FormControl(""),
      CountryID: new FormControl(""),
      MerchandiserName: new FormControl("", Validators.required),
      VendorAddress: new FormControl("", Validators.required),
      Size: new FormControl(""),
      StoreID: new FormControl(""),
      ProductAvailability: new FormControl(""),
      EmailID: new FormControl("", Validators.required),
      VendorID: new FormControl(""),
      Price: new FormControl("", Validators.required),
      Terms_Conditions: new FormArray([new FormControl(null)])
    });
  }
  get Terms_Conditions(): FormArray {
    return this.addProductForm.get("Terms_Conditions") as FormArray;
  }
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
    reader.onload = _event => {
      this.previewUrl = reader.result;

      // this.isShow =true;
      this.showId = !this.showId;
    };
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
          let imageSplits = event.target.result.split(",");
          console.log(imageSplits[1]);
          if (imageSplits != undefined && imageSplits[1] != undefined) {
            this.addProductForm.value.Logo = imageSplits[1];
            console.log(this.addProductForm.value.Logo);
          }
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  onChangeProductImages(event) {
    // if (event.target.files && event.target.files[0]) {
    //     var filesAmount = event.target.files.length;
    //     for (let i = 0; i < filesAmount; i++) {
    //         var reader = new FileReader();

    //         reader.onload = (event: any) => {
    //             let imageSplits = event.target.result.split(',');
    //             console.log(imageSplits[1]);
    //             if (imageSplits != undefined && imageSplits[1] != undefined) {
    //                 this.addProductForm.value.ProductImages = imageSplits[1];
    //                 console.log(this.addProductForm.value.ProductImages);

    //             }

    //         }

    //         reader.readAsDataURL(event.target.files[i]);
    //     }
    // }
    if (this.urls.length <= 4 && event.target.files.length <= 4) {
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();

          reader.onload = (event: any) => {
            let imageSplits = event.target.result.split(",");
            console.log(imageSplits[1]);
            if (imageSplits != undefined && imageSplits[1] != undefined) {
              this.htmlUrls.push(event.target.result);
              this.urls.push(imageSplits[1]);
            }
          };

          reader.readAsDataURL(event.target.files[i]);
        }
      }
    } else {
      alert("Max files limit is 3 ");
    }
  }
  onAddMerchandise() {
    if (this.addProductForm.value == "") {
      alert("Please fill  all the details");
    } else {
      this.addProductForm.value.VendorID = Number(
        localStorage.getItem("VendorID")
      );
      // this.addProductForm.value.StoreID = 10752217;
      if (this.adminid == this.vendorid) {
        this.addProductForm.value.StoreID = 14244062;
      }
      this.addProductForm.value.City = "Hyderabad";
      this.addProductForm.value.ProductImages = this.urls;

      let sizearray = this.addProductForm.value.Size;
      if (sizearray.length > this.sizeList.length) {
        let removedSize = sizearray.pop();
        this.addProductForm.value.Size = sizearray;
      }

      let cityarray = this.addProductForm.value.ProductAvailability;
      if (cityarray.length > this.cityList.length) {
        let removedCity = cityarray.pop();
        this.addProductForm.value.ProductAvailability = cityarray;
      }

      // var size = this.addProductForm.value.Size;
      // var sizeoutput = "'" + size.join("','") + "'";
      // var sizecurly = "{" + sizeoutput + "}";

      // this.addProductForm.value.Size = sizecurly;

      // var available = this.addProductForm.value.ProductAvailability;
      // var availableoutput = "'" + available.join("','") + "'";
      // var productcurly = "{" + availableoutput + "}";
      // this.addProductForm.value.ProductAvailability = productcurly;

      this.addProductForm.value.Price = Number(this.addProductForm.value.Price);
      this.addProductForm.value.DiscountedPrice = Number(
        this.addProductForm.value.DiscountedPrice
      );

      if (
        this.addProductForm.value.StoreID == "" ||
        this.addProductForm.value.StoreID == undefined
      ) {
        alert("Cannot Add Merchandise without stores");
      }
      this._ecommercecreateMerchandiseService
        .addMerchandise(this.addProductForm.value)
        .then(data => {
          // Show the success message
          if (data.Status == 1) {
            //let result = data.VendorDetails;
            alert("Merchandise added successfully");
            this._router.navigate([
              "apps/e-commerce/merchandise-products/" +
                Number(localStorage.getItem("VendorID"))
            ]);
          } else alert(data.Message);
        });
    }
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
    if (this.addProductForm.value.Catgegory === "Shoes") {
      this.isJacket = false;
      this.isShoe = true;
    }

    if (this.addProductForm.value.Catgegory === "Jackets") {
      this.isJacket = true;
      this.isShoe = false;
    }
  }
  tosslePerTwo(all): boolean {
    if (this.allSelects.selected) {
      this.allSelects.deselect();
      return false;
    }
    if (
      this.addProductForm.controls.Size.value.length === this.sizeList.length
    ) {
      this.allSelects.select();
    }
  }
  tosslePerFour(all): boolean {
    if (this.allSelectShoe.selected) {
      this.allSelectShoe.deselect();
      return false;
    }
    if (
      this.addProductForm.controls.Size.value.length === this.shoeList.length
    ) {
      this.allSelectShoe.select();
    }
  }
  toggleAllSelectionShoe(): void {
    if (this.allSelectShoe.selected) {
      this.addProductForm.controls.Size.patchValue([
        ...this.shoeList.map(item => item.key),
        0
      ]);
    } else {
      this.addProductForm.controls.Size.patchValue([]);
    }
  }
  toggleAllSelectionSize(): void {
    if (this.allSelects.selected) {
      this.addProductForm.controls.Size.patchValue([
        ...this.sizeList.map(item => item.key),
        0
      ]);
    } else {
      this.addProductForm.controls.Size.patchValue([]);
    }
  }
  tosslePerThree(all): boolean {
    if (this.allSelect.selected) {
      this.allSelect.deselect();
      return false;
    }
    if (
      this.addProductForm.controls.ProductAvailability.value.length ===
      this.cityList.length
    ) {
      this.allSelect.select();
    }
  }
  toggleAllSelectionCity(): void {
    if (this.allSelect.selected) {
      this.addProductForm.controls.ProductAvailability.patchValue([
        ...this.cityList.map(item => item.key),
        0
      ]);
    } else {
      this.addProductForm.controls.ProductAvailability.patchValue([]);
    }
  }
}
