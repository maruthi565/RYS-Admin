import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EcommerceAddBusinessQueryService } from './add-business-query.service';
import { Router } from '@angular/router';

@Component({
    selector: 'add-business-query',
    templateUrl: './add-business-query.component.html',
    styleUrls: ['./add-business-query.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddBusinessQueryComponent {
    showExtraToFields: boolean;
    businessQueryForm: FormGroup;
    queriesList: any[];
    queryTypeData: any[];
    query: any;
    queryid:number;
    queryname: any;
     

    data = {
        BusinessQueryTypes: [
          {
            TypeName: "",
            QueryTypeID: ""
    
          },
          {
            TypeName: "",
            QueryTypeID: ""
    
          },
        
          {
            TypeName: "",
            QueryTypeID: ""
    
          },
          {
            TypeName: "",
            QueryTypeID: ""
    
          }

        ]
      }
    /**
     * Constructor
     *
     * @param {MatDialogRef<AddBusinessQueryComponent>} matDialogRef
     * @param _data
     */
    constructor(
        private _ecommerceAddbusinessqueryService: EcommerceAddBusinessQueryService,
        private _router: Router, private fb: FormBuilder,
        public matDialogRef: MatDialogRef<AddBusinessQueryComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        // Set the defaults
       // this.businessQueryForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.businessQueryForm = this.fb.group({
           TypeName: this.fb.array([])
          });
          this.setBusinessQuery();
        
    }

   
    ngOnInit() {

        this.queriesList = this._ecommerceAddbusinessqueryService.queryTypeData;



        this.businessQueryForm.patchValue({
            TypeName : this.queriesList
        })
        console.log(this.queriesList);
        console.log(this.queriesList[0].TypeName);


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
            TypeName: this.fb.array([]),
              
        });
    }
   // get TypeName(): FormArray { return this.businessQueryForm.get('TypeName') as FormArray; }
    /**
     * Toggle extra to fields
     */

    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
   
    setBusinessQuery() {
        let control = <FormArray>this.businessQueryForm.controls.TypeName;
        this.data.BusinessQueryTypes.forEach(x => {
          control.push(this.fb.group({
           TypeName:x.TypeName,
           QueryTypeID: x.QueryTypeID
          }))
        })
      }
  


    onKey(event, query)
    {
       console.log(event.target.value);
       console.log(query.value.QueryTypeID);
       this.queryid = query.value.QueryTypeID;
       this.queryname = event.target.value;
   
    
    }
    onAddquery() {
        this.businessQueryForm.value.TypeName = this.queryname;
        this.businessQueryForm.value.QueryTypeID = this.queryid;
        
        this._ecommerceAddbusinessqueryService.updateBusinessQueryTypes(this.businessQueryForm.value).then((data) => {
        
        if (data.Status == 1) {
        alert("Query updated successfully");
        this.matDialogRef.close(true);
        this._ecommerceAddbusinessqueryService.getBusinessQueryTypes();
        //this._router.navigate(['apps/e-commerce/business-query']);
        }
        else
        alert(data.Message);
        this.matDialogRef.close(true);
        });
        
        }
    
}
