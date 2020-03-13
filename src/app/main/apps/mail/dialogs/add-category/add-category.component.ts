import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";
import { EcommerceAddCategoryService } from "./add-category.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "add-category",
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AddCategoryComponent {
  showExtraToFields: boolean;
  categoryForm: FormGroup;
  categoryList: any[];
  private _unsubscribeAll: Subject<any>;
  length: number;
  showDelete = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  data = {
    MerchandiseCategories: [
      {
        CategoryID: "",
        CategoryName: ""
      }
    ]
  };
  /**
   * Constructor
   *
   * @param {MatDialogRef<AddCategoryComponent>} matDialogRef
   * @param _data
   */
  constructor(
    public matDialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ecommerceaddcategoryService: EcommerceAddCategoryService,
    private _router: Router
  ) {
    this.categoryList = [];
    // Set the defaults
    this.categoryForm = this.fb.group({
      MerchandiseCategories: this.fb.array([])
    });
    this.categoryForm = this.createComposeForm();
    this.setCategory();

    this.showExtraToFields = false;
    this._unsubscribeAll = new Subject();
  }
  ngOnInit() {
    // this._ecommerceaddcategoryService.onCategoryChanged
    // .pipe(takeUntil(this._unsubscribeAll))
    // .subscribe(categoryList => {

    //     this.categoryList = categoryList;
    //     this.length = this.categoryList.length;
    //      for(var i = 0 ; i < this.categoryList.length ; i++ ){
    //         this.setCategory();
    //      }
    //     this.categoryForm.patchValue({
    //         MerchandiseCategories : this.categoryList
    //     })

    // });

    this._ecommerceaddcategoryService.getCategories().then(categorytypeData => {
      for (var i = 1; i < categorytypeData.MerchandiseCategories.length; i++) {
        this.setCategory();
        this.showDelete = true;
      }

      this.categoryForm.patchValue({
        MerchandiseCategories: JSON.parse(
          JSON.stringify(categorytypeData.MerchandiseCategories)
        )
      });

      console.log(this.categoryForm.value);
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
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
      MerchandiseCategories: this.fb.array([])
      //   new FormArray([
      //       new FormControl({CategoryName:''})
      //   ])
    });
  }

  /**
   * Toggle extra to fields
   */
  toggleExtraToFields(): void {
    this.showExtraToFields = !this.showExtraToFields;
  }
  setCategory() {
    let control = <FormArray>this.categoryForm.controls.MerchandiseCategories;
    this.data.MerchandiseCategories.forEach(x => {
      control.push(
        this.fb.group({
          CategoryID: x.CategoryID,
          CategoryName: x.CategoryName
        })
      );
      control.disable();
    });
  }
  onAddCategory() {
    let control = <FormArray>this.categoryForm.controls.MerchandiseCategories;
    control.push(
      this.fb.group({
        CategoryID: "",
        CategoryName: ""
      })
    );
  }

  categoryindexSelected: any;
  deleteCategoryType(categorytype, index): void {
    console.log(categorytype);
    this.categoryindexSelected = index;
    if (categorytype.CategoryID != "" && categorytype.CategoryName != "") {
      this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage =
        "Are you sure you want to delete?";

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._ecommerceaddcategoryService
            .deleteCategoryType(categorytype.CategoryID)
            .then(data => {
              if (data.Status == 1) {
                alert(data.Message);
                console.log("index " + this.categoryindexSelected);
                this.deleteCategory();
              } else alert(data.Message);
            });
        }
        this.confirmDialogRef = null;
      });
    } else {
      this.deleteCategory();
    }
  }

  deleteCategory() {
    let control = <FormArray>this.categoryForm.controls.MerchandiseCategories;
    control.removeAt(this.categoryindexSelected);
  }
  AddCategory() {
    var data = this.categoryForm.value.MerchandiseCategories;
    var result = data[0];

    this._ecommerceaddcategoryService.addCategory(result).then(data => {
      if (data.Status == 1) {
        alert("Category added successfully");
        this.matDialogRef.close(true);
      } else alert(data.Message);
    });
  }
}
