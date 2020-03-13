import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { EcommerceCreateVendorService } from "../create-vendor/create-vendor.service";
import { EcommerceEditVendorService } from "./edit-vendor.service";
import { Router } from "@angular/router";

@Component({
  selector: "e-commerce-edit-vendor",
  templateUrl: "./edit-vendor.component.html",
  styleUrls: ["./edit-vendor.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceEditVendorComponent {
  showExtraToFields: boolean;
  editVendorForm: FormGroup;
  getcountries: any;
  vendordetails: any;
  Image: any;
  fileData: File = null;
  previewUrl: any = null;
  showId = true;
  hideImage = true;

  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceEditVendorComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private _ecommerceCreateVendorService: EcommerceCreateVendorService,
    private _editVendorService: EcommerceEditVendorService,
    private _router: Router
  ) {
    // Set the defaults
    this.editVendorForm = this.createComposeForm();
    this.showExtraToFields = false;
  }
  ngOnInit() {
    this._ecommerceCreateVendorService.getCountries().then(data => {
      this.getcountries = data.Countries;
    });

    setTimeout(() => {
      this.loadingMethods();
    }),
      50000;

    this.vendordetails = JSON.parse(localStorage.getItem("EditVendor"));
    console.log(this.vendordetails.Country);
    this.Image = this.vendordetails.ProfilePic;
    console.log(this.Image);
  }
  loadingMethods() {
    this.editVendorForm.patchValue(
      JSON.parse(localStorage.getItem("EditVendor"))
    );
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
      VendorID: new FormControl(""),
      FirstName: new FormControl(""),
      LastName: new FormControl(""),
      MobileNumber: new FormControl(""),
      EmailID: new FormControl({ value: "", disabled: true }),
      Password: new FormControl(""),
      Country: new FormControl(""),
      City: new FormControl(""),
      CompanyName: new FormControl(""),
      Website: new FormControl(""),
      About: new FormControl(""),
      EstablishedOn: new FormControl(""),
      YearsInBusiness: new FormControl(""),
      OwnershipType: new FormControl(""),
      PAN: new FormControl(""),
      CINN: new FormControl(""),
      TIN: new FormControl(""),
      GST: new FormControl(""),
      ProfilePic: new FormControl(""),
      RegistrationDate: new FormControl(""),
      NoOfStores: new FormControl(""),
      DocumentPath: new FormControl("")
    });
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
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
    reader.onload = _event => {
      this.previewUrl = reader.result;
      this.showId = !this.showId;
      // this.isShow =true;
    };
  }
  onChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          let imageSplits = event.target.result.split(",");
          console.log(imageSplits[1]);
          if (imageSplits != undefined && imageSplits[1] != undefined) {
            this.editVendorForm.value.ProfilePic = imageSplits[1];
            console.log(this.editVendorForm.value.ProfilePic);
          }
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onEditVendor() {
    var vendorJSON: any;
    vendorJSON = this.editVendorForm.value;
    // this.editVendorForm.removeControl("EmailID");
    this._editVendorService.editVendor(vendorJSON).then(data => {
      if (data.Status == 1) {
        alert("Vendor updated successfully");
        this._router.navigate(["apps/e-commerce/after-market"]);
      } else alert(data.Message);
    });
  }
}
