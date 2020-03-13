import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { EcommerceAddStoryService } from "./create-story.service";
import { Router } from "@angular/router";

@Component({
  selector: "e-commerce-create-story",
  templateUrl: "./create-story.component.html",
  styleUrls: ["./create-story.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceCreateStoryComponent {
  showExtraToFields: boolean;
  addStoryForm: FormGroup;
  check1 = true;
  check2 = false;
  check3 = true;
  fileData: File = null;
  previewUrl: any = null;
  urls = [];
  htmlUrls = [];

  /**
   * Constructor
   *
   * @param {MatDialogRef<EcommerceCreateStoryComponent>} matDialogRef
   * @param _data
   */
  constructor(
    private _addStoryService: EcommerceAddStoryService,
    private _router: Router
  ) {
    // Set the defaults
    this.addStoryForm = this.createComposeForm();
    this.showExtraToFields = false;
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
      UserID: new FormControl(""),
      ImageURLs: new FormControl([]),
      Caption: new FormControl("", Validators.required),
      Location: new FormControl("", Validators.required)
    });
  }
  onChange(event) {
    if (this.urls.length <= 4 && event.target.files.length <= 4) {
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          //var qual = compressor.compress(event.target.files[i], {quality: .5})
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
          //this.isCheck = false;
        }
      }
    } else {
      alert("Max files limit is 3 ");
    }
  }
  removeSelectedFile(i) {
    // Delete the item from fileNames list
    this.htmlUrls.splice(i, 1);
    // delete file from FileList
    this.urls.splice(i, 1);
  }
  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }

  removeImage(i) {
    this.htmlUrls.splice(i, 1);
  }
  onAddStory() {
    this.addStoryForm.value.UserID = Number(
      localStorage.getItem("AdminUserID")
    );
    this.addStoryForm.value.ImageURLs = this.urls;
    this.addStoryForm.value.Type = 0;
    // this.addStoreForm.value.StoreImages = "images";
    // this.addStoreForm.value.StoreLogo = "mtouch";
    // this.addStoreForm.value.VoucherValue = Number(this.addStoreForm.value.VoucherValue);
    // this.addStoreForm.value.Price = Number(this.addStoreForm.value.Price);
    this._addStoryService.addStory(this.addStoryForm.value).then(data => {
      // Show the success message
      if (data.Status == 1) {
        alert("Story added successfully");
        this._router.navigate(["apps/e-commerce/biker-stories"]);
      } else alert(data.Message);
    });
  }
}
