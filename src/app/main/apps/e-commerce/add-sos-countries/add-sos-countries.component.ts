import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";

import { Router } from "@angular/router";
import { EcommerceAddSosContactsService } from "./add-sos-countries.service";

@Component({
  selector: "e-commerce-add-sos-countries",
  templateUrl: "./add-sos-countries.component.html",
  styleUrls: ["./add-sos-countries.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceAddSosCountriesComponent {
  showExtraToFields: boolean;
  addSosContactsForm: FormGroup;
  getcountries: any;

  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceAddSosCountriesComponent>} matDialogRef
   * @param _data
   */
  constructor(
    // private _ecommerceAddAdminUserService: EcommerceAddAdminUserService,
    private _router: Router,
    private _addsoscontactsService: EcommerceAddSosContactsService
  ) {
    // Set the defaults
    this.addSosContactsForm = this.createComposeForm();
    this.showExtraToFields = false;
  }

  ngOnInit() {
    this._addsoscontactsService.getCountries().then(data => {
      this.getcountries = data.Countries;
    });
  }

  /**
   * Create compose form
   *
   * @returns {FormGroup}
   */
  createComposeForm(): FormGroup {
    return new FormGroup({
      CountryID: new FormControl("", Validators.required),
      Ambulance: new FormControl("", Validators.required),
      Police: new FormControl("", Validators.required),
      NHAI: new FormControl("", Validators.required),
      ThirdPartyRSA: new FormControl("", Validators.required)
    });
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  onAddSosContacts() {
    if (
      this.addSosContactsForm.value.CountryID == "" ||
      this.addSosContactsForm.value.Ambulance == "" ||
      this.addSosContactsForm.value.Police == "" ||
      this.addSosContactsForm.value.NHAI == "" ||
      this.addSosContactsForm.value.ThirdPartyRSA == ""
    ) {
      //alert(this.addSosContactsForm.value);
      alert("Please fill all the details");
    } else {
      this._addsoscontactsService
        .addSosContacts(this.addSosContactsForm.value)
        .then(data => {
          // Show the success message
          if (data.Status == 1) {
            alert("SOS  Contact added successfully");
            this._router.navigate(["apps/e-commerce/sos-contacts"]);
          } else alert(data.Message);
        });
    }
  }
}
