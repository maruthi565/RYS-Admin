import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { FuseUtils } from "@fuse/utils";

import { EcommerceProductsService } from "app/main/apps/e-commerce/products/products.service";
import { takeUntil } from "rxjs/internal/operators";
import { MatTableDataSource, MatDialog, MatDialogRef } from "@angular/material";
import { RequestDialogComponent } from "../request-dialog/request-dialog.component";
import { FormGroup } from "@angular/forms";
import { AddBikeBrandComponent } from "../../mail/dialogs/add-bike-brand/add-bike-brand.component";
import { AddBikeModelComponent } from "../../mail/dialogs/add-bike-model/add-bike-model.component";
import { EcommerceBikeBrandService } from "../images/images.service";
import { EcommercegetBikeModelsService } from "./bike-brand-detail.service";
import { ActivatedRoute } from "@angular/router";
import { EditBikeModelDialog } from "../../mail/dialogs/edit-bike-model/edit-bike-model.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
export interface PeriodicElement {
  id: number;
  username: string;
  bike: string;
  city: string;
  date: string;
  price: number;
  codes: number;
}

@Component({
  selector: "e-commerce-bike-brand-detail",
  templateUrl: "./bike-brand-detail.component.html",
  styleUrls: ["./bike-brand-detail.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EcommerceBikeBrandDetailComponent implements OnInit {
  Checked = true;
  bikeBrandsData: any;
  getbikeModelsData: any[];
  bikemodelsFilteredByTitle: any[];
  searchTerm: string;
  BrandID: number;
  models: any[];
  brandname: string;
  brandid: number;
  bike: any;
  infocountboxes: any;
  showCountBox: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild("filter", { static: true })
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;
  dialogRef: any;
  refresh: Subject<any> = new Subject();

  constructor(
    private _ecommercegetbikemodelsService: EcommercegetBikeModelsService,
    private _ecommercebikebrandService: EcommerceBikeBrandService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.refresh.subscribe(updateDB => {
      if (updateDB) {
        //this._adsService.getAdsPosted();
        this.getBikeModels();
      }
    });

    this._ecommercegetbikemodelsService.getInfoBoxes().then(data => {
      this.infocountboxes = data;
      this.showCountBox = true;
    });

    this.getBikeModels();
  }

  getBikeModels() {
    this.route.params.subscribe(params => {
      this.BrandID = params["id"];
      console.log(this.BrandID);
      let data: any = this._ecommercegetbikemodelsService.getbikeModelsData;

      let model = data.BikeBrandModels.find(x => x.BrandID == this.BrandID);
      model.BikeModels.forEach(item => (item.BrandID = Number(this.BrandID)));

      this.bike = localStorage.getItem("BikeBrand");
      this.brandname = model.BrandName;
      console.log(model.BrandName);
      this.models = model.BikeModels;
      console.log(this.models);
    });
  }
  //   filterBikeModelsByTitle(): void {
  //     const searchTerm = this.searchTerm.toLowerCase();

  //     // Search
  //     if (searchTerm === "") {
  //       this.models = this.bikemodelsFilteredByTitle;
  //     } else {
  //       this.models = this.bikemodelsFilteredByTitle.filter(bikemodel => {
  //         return bikemodel.ModelName.toLowerCase().includes(searchTerm);
  //       });
  //     }
  //   }
  openAlertDialog(): void {
    const dialogRef = this.dialog.open(RequestDialogComponent, {
      data: {
        message: "Your Request has been Successfully Sent !",
        buttonText: {
          cancel: "Done"
        }
      }
    });
  }
  addBikeModelDialog(): void {
    this.dialogRef = this.dialog.open(AddBikeModelComponent, {
      panelClass: "add-bike-model"
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];
      switch (actionType) {
        /**
         * Send
         */
        case "send":
          console.log("new Mail", formData.getRawValue());
          break;
        /**
         * Delete
         */
        case "delete":
          console.log("delete Mail");
          break;
      }
    });
  }
  editBikeModelDialog(model): void {
    this.dialogRef = this.dialog.open(EditBikeModelDialog, {
      panelClass: "edit-bike-model",
      data: { editBikeModelValue: model }
    });
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      this.refresh.next(true);
    });
  }
  /**
   * Delete bikemodels
   *
   * @param bikemodels
   */
  deleteBikeModels(bikemodels): void {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._ecommercegetbikemodelsService
          .deleteBikeModels(bikemodels.BikeModelID)
          .then(data => {
            // Show the success message
            if (data.Status == 1) {
              //let result = data.VendorDetails;
              alert(data.Message);
              this.refresh.next(true);
              this.getBikeModels();
            } else alert(data.Message);
          });
      }
      this.confirmDialogRef = null;
    });
  }
  filterBikeBrandsByTitle(): void {
    const searchTerm = this.searchTerm.toLowerCase();

    // Search
    if (searchTerm === "") {
      this.getbikeModelsData = this.bikemodelsFilteredByTitle;
    } else {
      this.getbikeModelsData = this.bikemodelsFilteredByTitle.filter(
        getbikemodel => {
          return getbikemodel.ModelName.toLowerCase().includes(searchTerm);
        }
      );
    }
  }
}
