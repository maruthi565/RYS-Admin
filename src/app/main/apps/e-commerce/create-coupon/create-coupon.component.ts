import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, FormArray } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { EcommerceCreateCouponService } from "./create-coupon.service";
import { EcommerceAddSosContactsService } from "../add-sos-countries/add-sos-countries.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "e-commerce-create-coupon",
  templateUrl: "./create-coupon.component.html",
  styleUrls: ["./create-coupon.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceCreateCouponComponent {
  showExtraToFields: boolean;
  createCouponForm: FormGroup;
  getcountries: any;
  minDate = new Date();

  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceCreateCouponComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private _createCouponService: EcommerceCreateCouponService,
    private _addsoscontactsService: EcommerceAddSosContactsService,
    private _router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    // Set the defaults
    this.createCouponForm = this.createComposeForm();
    this.showExtraToFields = false;
  }

  ngOnInit() {
    this._addsoscontactsService.getCountries().then(data => {
      this.getcountries = data.Countries;
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
      Title: new FormControl(""),
      VendorName: new FormControl(""),
      ContactNo: new FormControl(""),
      CountryID: new FormControl(""),
      EmailID: new FormControl(""),
      Image: new FormControl(""),
      Logo: new FormControl(""),
      VoucherValue: new FormControl(""),
      Price: new FormControl(""),
      StartDate: new FormControl(""),
      EndDate: new FormControl(""),
      StoreAddress: new FormControl(""),
      VendorID: new FormControl(""),
      City: new FormControl(""),
      Terms_Conditions: new FormArray([new FormControl(null)]),
      CouponPrefix: new FormControl(""),
      Quantity: new FormControl(""),
      rysprice: new FormControl("")
    });
  }
  get Terms_Conditions(): FormArray {
    return this.createCouponForm.get("Terms_Conditions") as FormArray;
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
  onChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          let imageSplits = event.target.result.split(",");
          console.log(imageSplits[1]);
          if (imageSplits != undefined && imageSplits[1] != undefined) {
            this.createCouponForm.value.Image = imageSplits[1];
            console.log(this.createCouponForm.value.Image);
          }
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  onChangeLogo(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          let imageSplits = event.target.result.split(",");
          console.log(imageSplits[1]);
          if (imageSplits != undefined && imageSplits[1] != undefined) {
            this.createCouponForm.value.Logo = imageSplits[1];
            console.log(this.createCouponForm.value.Logo);
          }
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  onAddVendorCoupon() {
    var CouponStartDate = this.datePipe.transform(
      this.createCouponForm.value.StartDate,
      "yyyy/MM/dd"
    );
    var CouponEndDate = this.datePipe.transform(
      this.createCouponForm.value.EndDate,
      "yyyy/MM/dd"
    );

    var startdate = new Date(CouponStartDate);
    var newstartdate = new Date(
      startdate.getFullYear(),
      startdate.getMonth(),
      startdate.getDate()
    );
    console.log(newstartdate);

    var enddate = new Date(CouponEndDate);
    var newenddate = new Date(
      enddate.getFullYear(),
      enddate.getMonth(),
      enddate.getDate()
    );
    console.log(newenddate);
    var current = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );

    if (newstartdate > newenddate) {
      alert("EndDate is less than StartDate");
      this.createCouponForm.patchValue({
        EndDate: undefined
      });
    }
    // return;
    this.createCouponForm.value.VendorID = Number(
      localStorage.getItem("VendorID")
    );
    console.log(this.createCouponForm.value.VendorID);
    this.createCouponForm.value.Quantity = Number(
      this.createCouponForm.value.Quantity
    );
    this.createCouponForm.value.VoucherValue = Number(
      this.createCouponForm.value.VoucherValue
    );
    this.createCouponForm.value.ContactNo = Number(
      this.createCouponForm.value.ContactNo
    );
    this.createCouponForm.value.Price = Number(
      this.createCouponForm.value.Price
    );
    console.log(this.createCouponForm.value);
    this._createCouponService
      .createCoupon(this.createCouponForm.value)
      .then(data => {
        // Show the success message
        if (data.Status == 1) {
          //let result = data.VendorDetails;
          alert("Coupon added successfully");
          this._router.navigate([
            "apps/e-commerce/my-coupons/" +
              Number(localStorage.getItem("VendorID"))
          ]);
        } else alert(data.Message);
      });
  }
}
