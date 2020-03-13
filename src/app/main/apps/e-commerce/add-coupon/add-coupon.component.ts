import {
  Component,
  Inject,
  ViewEncapsulation,
  ChangeDetectorRef
} from "@angular/core";
import { FormControl, FormGroup, FormArray } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { EcommerceAddCouponService } from "./add-coupon.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { EcommerceAddSosContactsService } from "../add-sos-countries/add-sos-countries.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "e-commerce-add-coupon",
  templateUrl: "./add-coupon.component.html",
  styleUrls: ["./add-coupon.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceAddCouponComponent {
  showExtraToFields: boolean;
  addCouponForm: FormGroup;
  urls: [];
  getcountries: any;
  minDate = new Date();

  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceAddCouponComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private _ecommerceAddCouponService: EcommerceAddCouponService,
    private _router: Router,
    private datePipe: DatePipe,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private _addsoscontactsService: EcommerceAddSosContactsService
  ) {
    // Set the defaults
    this.addCouponForm = this.createComposeForm();
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
    return this.addCouponForm.get("Terms_Conditions") as FormArray;
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
            this.addCouponForm.value.Image = imageSplits[1];
            console.log(this.addCouponForm.value.Image);
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
            this.addCouponForm.value.Logo = imageSplits[1];
            console.log(this.addCouponForm.value.Logo);
          }
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onAddCoupon() {
    var CouponStartDate = this.datePipe.transform(
      this.addCouponForm.value.StartDate,
      "yyyy/MM/dd"
    );
    var CouponEndDate = this.datePipe.transform(
      this.addCouponForm.value.EndDate,
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
      this.addCouponForm.patchValue({
        EndDate: undefined
      });
    }

    this.addCouponForm.value.VendorID = Number(
      localStorage.getItem("AdminUserID")
    );
    console.log(this.addCouponForm.value.VendorID);
    // this.addCouponForm.value.CountryID = 2;
    // this.addCouponForm.value.City = "hyderabad";
    this.addCouponForm.value.Quantity = Number(
      this.addCouponForm.value.Quantity
    );
    this.addCouponForm.value.VoucherValue = Number(
      this.addCouponForm.value.VoucherValue
    );
    this.addCouponForm.value.Price = Number(this.addCouponForm.value.Price);
    this.addCouponForm.value.rysprice = Number(
      this.addCouponForm.value.rysprice
    );
    this._ecommerceAddCouponService
      .addCoupon(this.addCouponForm.value)
      .then(data => {
        // Show the success message
        if (data.Status == 1) {
          //let result = data.VendorDetails;
          alert("Coupon added successfully");
          this._router.navigate(["apps/e-commerce/after-market"]);
        } else alert(data.Message);
      });
  }
}
