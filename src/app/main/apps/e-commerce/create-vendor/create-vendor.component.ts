import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { EcommerceCreateVendorService } from "./create-vendor.service";
import { Router } from "@angular/router";

import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";
@Component({
  selector: "e-commerce-create-vendor",
  templateUrl: "./create-vendor.component.html",
  styleUrls: ["./create-vendor.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceCreateVendorComponent {
  showExtraToFields: boolean;
  addVendorForm: FormGroup;
  selectedFiles: FileList;
  showSuccess = false;
  getcountries: any;
  document: any;
  gobj: any;
  showText: boolean;
  uploadedSoFar: any;
  progress: number;
  previewUrl: any = null;
  fileData: File = null;
  showId=true;

  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceCreateVendorComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private _ecommerceCreateVendorService: EcommerceCreateVendorService,
    private _router: Router
  ) {
    // Set the defaults
    this.addVendorForm = this.createComposeForm();
    this.showExtraToFields = false;
  }
  ngOnInit() {
    this._ecommerceCreateVendorService.getCountries().then(data => {
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
      FirstName: new FormControl("", Validators.required),
      LastName: new FormControl("", Validators.required),
      MobileNumber: new FormControl("", Validators.required),
      EmailID: new FormControl("", Validators.required),
      Password: new FormControl("", Validators.required),
      Country: new FormControl("", Validators.required),
      City: new FormControl("", Validators.required),
      CompanyName: new FormControl("", Validators.required),
      Website: new FormControl("", Validators.required),
      About: new FormControl("", Validators.required),
      EstablishedOn: new FormControl("", Validators.required),
      YearsInBusiness: new FormControl("", Validators.required),
      OwnershipType: new FormControl("", Validators.required),
      PAN: new FormControl("", Validators.required),
      CINN: new FormControl("", Validators.required),
      TIN: new FormControl("", Validators.required),
      GST: new FormControl("", Validators.required),
      ProfilePic: new FormControl("", Validators.required),
      RegistrationDate: new FormControl("", Validators.required),
      NoOfStores: new FormControl("", Validators.required),
      DocumentPath: new FormControl("", Validators.required)
    });
  }
  upload() {
    const file = this.selectedFiles.item(0);
    const contentType = file.type;
    const bucket = new S3({
      // accessKeyId: 'AKIAJIZAP6IJFA3EB3YA',
      accessKeyId: "AKIAJ4OQ64VEXPFWUPMQ",
      secretAccessKey: "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",
      region: "ap-south-1"
    });
    const params = {
      Bucket: "revyoursoulapp",
      Key: "Addvendor/Document/" + file.name,
      Body: file,
      ACL: "public-read",
      ContentType: contentType
    };
    var objx = bucket.upload(params, function(err, data) {
      this.document = data;

      if (err) {
        console.log("There was an error uploading your file: ", err);
        return false;
      }

      console.log("Successfully uploaded file.", data);
      this.showText = true;
      console.log(data.Location);
      this.document = data.Location;
      //this.getPath();

      return true;
    });
    this.gobj = objx;
    bucket
      .upload(params)
      .on("httpUploadProgress", event => {
        this.progress = Math.round((event.loaded / event.total) * 100);
        console.log(this.progress);
        this.showText = true;
        if (this.progress == 100) {
          this.showText = false;
        }
        return event;

        // console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      })

      .send(function(err, data) {
        if (err) {
          console.log("There was an error uploading your file: ", err);
          return false;
        }

        console.log("Successfully uploaded file.", data);

        //console.log(this.document = data.Location);

        return true;
      });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
  // getPath() {
  //     this.addVendorForm.value.DocumentPath = this.document;
  // }
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

        reader.onload = (event: any) => {
          let imageSplits = event.target.result.split(",");
          console.log(imageSplits[1]);
          if (imageSplits != undefined && imageSplits[1] != undefined) {
            this.addVendorForm.value.ProfilePic = imageSplits[1];
            console.log(this.addVendorForm.value.ProfilePic);
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

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  onAddVendor() {
    if (this.addVendorForm.invalid) {
      alert("Please fill all the details");
    } else {
      console.log(this.gobj.document);
      this.addVendorForm.value.DocumentPath = this.gobj.document;
      this.addVendorForm.value.CINN = Number(this.addVendorForm.value.CINN);
      this.addVendorForm.value.GST = Number(this.addVendorForm.value.GST);
      this.addVendorForm.value.NoOfStores = Number(
        this.addVendorForm.value.NoOfStores
      );
      this.addVendorForm.value.MobileNumber = Number(
        this.addVendorForm.value.MobileNumber
      );
      this.addVendorForm.value.TIN = Number(this.addVendorForm.value.TIN);
      this.addVendorForm.value.YearsInBusiness = Number(
        this.addVendorForm.value.YearsInBusiness
      );

      this.addVendorForm.value.CreatedBy = "Admin";

      this._ecommerceCreateVendorService
        .addVendor(this.addVendorForm.value)
        .then(data => {
          // Show the success message
          if (data.Status == 1) {
            //let result = data.VendorDetails;
            alert("Vendor added successfully");
            this._router.navigate(["apps/e-commerce/after-market"]);
          } else alert(data.Message);
        });
    }
  }
}
