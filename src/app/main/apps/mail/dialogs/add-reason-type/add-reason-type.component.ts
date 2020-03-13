import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EcommerceAddReasonTypeService } from './add-reason-type.service';

@Component({
    selector: 'add-reason-type',
    templateUrl: './add-reason-type.component.html',
    styleUrls: ['./add-reason-type.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddReasonTypeComponent {
    showExtraToFields: boolean;
    reasonForm: FormGroup;
    reasonsList: any[];
    reasonTypeData: any[];
    reasonid : any;
    reasonname : any;


    data = {
        ReasonType: [
          {
            ReasonTitle: "",
            ReasonTypeID: ""
    
          },
          {
            ReasonTitle: "",
            ReasonTypeID: ""
    
          },
          {
            ReasonTitle: "",
            ReasonTypeID: ""
    
          }
         

        ]
      }

    /**
     * Constructor
     *
     * @param {MatDialogRef<AddReasonTypeComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AddReasonTypeComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private fb: FormBuilder,private _addreasontypeService : EcommerceAddReasonTypeService
    ) {
        // Set the defaults
        this.reasonForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.reasonForm = this.fb.group({
            ReasonTitle: this.fb.array([])
           });
           this.setReasonType();
    }

    ngOnInit() {
     
      
        this.reasonsList = this._addreasontypeService.reasonTypeData;
        this.reasonsList = this.reasonsList.sort((a,b) => a.ReasonTypeID - b.ReasonTypeID);
        this.reasonForm.patchValue({
            ReasonTitle : this.reasonsList
        })
        console.log(this.reasonsList);
        console.log(this.reasonsList[0].ReasonTitle);
    }

    setReasonType() {
        let control = <FormArray>this.reasonForm.controls.ReasonTitle;
        this.data.ReasonType.forEach(x => {
          control.push(this.fb.group({
            ReasonTitle:x.ReasonTitle,
           ReasonTypeID: x.ReasonTypeID
          }))
        })
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
            ReasonTitle: this.fb.array([]),
              
        });
    }

    onKey(event, reason)
    {
       console.log(event.target.value);
       console.log(reason.value.ReasonTypeID);
       this.reasonid = reason.value.ReasonTypeID;
       this.reasonname = event.target.value;
   
    
    }
    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    onAddReason() {
        this.reasonForm.value.ReasonTitle = this.reasonname;
        this.reasonForm.value.ReasonTypeID = this.reasonid;
        
        this._addreasontypeService.updateReasonTypes(this.reasonForm.value).then((data) => {
        
        if (data.Status == 1) {
        alert("Reason updated successfully");
        this.matDialogRef.close(true);
        this._addreasontypeService.getReasonTypes();
        //this._router.navigate(['apps/e-commerce/business-query']);
        }
        else
        alert(data.Message);
        this.matDialogRef.close(true);
        });
        
        }
}
