import { Component, Inject, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { MatOption } from "@angular/material";
import { EcommerceEditMerchandiseService } from "./edit-merchandise.service";
import { Router } from "@angular/router";
import { EcommerceAddCouponService } from "../add-coupon/add-coupon.service";
import { EcommerceAddMerchandiseService } from "../add-merchandise/add-merchandise.service";
import { EcommerceCreateMerchandiseService } from "../create-merchandise/create-merchandise.service";

@Component({
  selector: "e-commerce-edit-merchandise",
  templateUrl: "./edit-merchandise.component.html",
  styleUrls: ["./edit-merchandise.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceEditMerchandiseComponent {
  showExtraToFields: boolean;
  editMerchandiseForm: FormGroup;
  terms: any;
  last: any;
  selected: any;
  categorieslist: any;
  stores: any;
  getcountries: any;
  isShoe = false;
  isJacket = false;
  vendorid: any;
  adminid: any;
  Logo: any;
  Images: any[];

  categoryList = [
    {
      key: "Clothing",
      value: "Clothing"
    },
    {
      key: "Accessories",
      value: "Accessories"
    },
    {
      key: "Shoes",
      value: "Shoes"
    },
    {
      key: "Others",
      value: "Others"
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
   * @param {MatDialogRef<EcommerceEditMerchandiseComponent>} matDialogRef
   * @param _data
   */

  constructor(
    private _ecommerceEditMerchandiseService: EcommerceEditMerchandiseService,
    private _router: Router,
    private fb: FormBuilder,
    private _ecommerceAddMerchandiseService: EcommerceAddMerchandiseService,
    private _ecommerceCreateMerchandise: EcommerceCreateMerchandiseService
  ) {
    // Set the defaults
    this.editMerchandiseForm = this.createComposeForm();
    this.showExtraToFields = false;
    this.vendorid = JSON.parse(localStorage.getItem("VendorID"));
    this.adminid = JSON.parse(localStorage.getItem("AdminUserID"));
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
      MerchandiseID: new FormControl(""),
      Title: new FormControl(""),
      Description: new FormControl(""),
      DiscountedPrice: new FormControl(""),
      MobileNumber: new FormControl(""),
      Catgegory: new FormControl(""),
      MerchandiserName: new FormControl(""),
      VendorAddress: new FormControl(""),
      Size: new FormControl(""),
      ProductAvailability: new FormControl(),
      EmailID: new FormControl(""),
      VendorID: new FormControl(""),
      Price: new FormControl(""),
      CountryID: new FormControl(""),
      StoreID: new FormControl(""),
      Terms_Conditions: new FormArray([new FormControl(null)])
    });
  }
  get Terms_Conditions(): FormArray {
    return this.editMerchandiseForm.get("Terms_Conditions") as FormArray;
  }

  ngOnInit() {
    this._ecommerceAddMerchandiseService.getCategories().then(data => {
      this.categorieslist = data.MerchandiseCategories;
    });
    this._ecommerceAddMerchandiseService.getCountries().then(data => {
      this.getcountries = data.Countries;
    });

    this._ecommerceCreateMerchandise.getStores().then(data => {
      this.stores = data.Stores;
    });

    this.editMerchandiseForm.patchValue(
      JSON.parse(localStorage.getItem("EditMerchandise"))
    );

    this.terms = JSON.parse(localStorage.getItem("EditMerchandise"));
    let last = this.terms.Terms_Conditions;
    this.Logo = this.terms.Logo;
    this.Images = this.terms.ProductImages;
    console.log(this.Logo);
    console.log(last.length);
    let numberOfTerms = last.length;
    for (let i = 1; i < numberOfTerms; i++) {
      this.Terms_Conditions.push(new FormControl(last[i]));
    }
    this.onCategorySelection();
  }

  onAddTerms_Conditions() {
    this.Terms_Conditions.push(new FormControl());
  }
  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  tosslePerOne(all): boolean {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.editMerchandiseForm.controls.Catgegory.value.length ===
      this.categoryList.length
    ) {
      this.allSelected.select();
    }
  }
  toggleAllSelection(): void {
    if (this.allSelected.selected) {
      this.editMerchandiseForm.controls.Catgegory.patchValue([
        ...this.categoryList.map(item => item.key),
        0
      ]);
    } else {
      this.editMerchandiseForm.controls.Catgegory.patchValue([]);
    }
  }
  tosslePerTwo(all): boolean {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.editMerchandiseForm.controls.Size.value.length ===
      this.sizeList.length
    ) {
      this.allSelected.select();
    }
  }
  tosslePerFour(all): boolean {
    if (this.allSelectShoe.selected) {
      this.allSelectShoe.deselect();
      return false;
    }
    if (
      this.editMerchandiseForm.controls.Size.value.length ===
      this.shoeList.length
    ) {
      this.allSelectShoe.select();
    }
  }
  toggleAllSelectionSize(): void {
    if (this.allSelected.selected) {
      this.editMerchandiseForm.controls.Size.patchValue([
        ...this.sizeList.map(item => item.key),
        0
      ]);
    } else {
      this.editMerchandiseForm.controls.Size.patchValue([]);
    }
  }
  tosslePerThree(all): boolean {
    if (this.allSelect.selected) {
      this.allSelect.deselect();
      return false;
    }
    if (
      this.editMerchandiseForm.controls.ProductAvailability.value.length ===
      this.cityList.length
    ) {
      this.allSelect.select();
    }
  }
  toggleAllSelectionCity(): void {
    if (this.allSelect.selected) {
      this.editMerchandiseForm.controls.ProductAvailability.patchValue([
        ...this.cityList.map(item => item.key),
        0
      ]);
    } else {
      this.editMerchandiseForm.controls.ProductAvailability.patchValue([]);
    }
  }
  toggleAllSelectionShoe(): void {
    if (this.allSelectShoe.selected) {
      this.editMerchandiseForm.controls.Size.patchValue([
        ...this.shoeList.map(item => item.key),
        0
      ]);
    } else {
      this.editMerchandiseForm.controls.Size.patchValue([]);
    }
  }
  onCategorySelection() {
    //console.log(this.addProductForm.value.Catgegory);
    if (this.editMerchandiseForm.value.Catgegory === "Shoes") {
      this.isJacket = false;
      this.isShoe = true;
    }

    if (this.editMerchandiseForm.value.Catgegory === "Jackets") {
      this.isJacket = true;
      this.isShoe = false;
    }
  }
  onEditMerchandise() {
    this.editMerchandiseForm.value.VendorID = Number(
      localStorage.getItem("VendorID")
    );
    // this.editMerchandiseForm.value.CountryID = 2;
    // this.editMerchandiseForm.value.StoreID = 10752217;
    // this.editMerchandiseForm.value.Logo = "logo";
    // this.editMerchandiseForm.value.ProductImages = "{'img'}";
    // this.editMerchandiseForm.value.City = "Hyderabad";
    if (this.adminid == this.vendorid) {
      this.editMerchandiseForm.value.StoreID = 14244062;
    }

    let sizearray = this.editMerchandiseForm.value.Size;
    let removedSize = sizearray.pop();
    this.editMerchandiseForm.value.Size = sizearray;

    let cityarray = this.editMerchandiseForm.value.ProductAvailability;
    let removedCity = cityarray.pop();
    this.editMerchandiseForm.value.ProductAvailability = cityarray;

    this.editMerchandiseForm.value.Price = Number(
      this.editMerchandiseForm.value.Price
    );
    this.editMerchandiseForm.value.DiscountedPrice = Number(
      this.editMerchandiseForm.value.DiscountedPrice
    );
    var merchandiseJSON: any;
    merchandiseJSON = this.editMerchandiseForm.value;
    this._ecommerceEditMerchandiseService
      .editMerchandise(merchandiseJSON)
      .then(data => {
        if (data.Status == 1) {
          alert("Merchandise updated successfully");
          this._router.navigate([
            "apps/e-commerce/merchandise-products/" +
              Number(localStorage.getItem("VendorID"))
          ]);
          //this._router.navigate(['apps/e-commerce/merchandise']);
        } else alert(data.Message);
      });
  }
}
