import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { EcommerceAdddLeaderboardMessageTypeService } from './add-leader-message-type.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'add-leader-message-type',
    templateUrl: './add-leader-message-type.component.html',
    styleUrls: ['./add-leader-message-type.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddLeaderMessageTypeComponent {
    showExtraToFields: boolean;
    leaderboardForm: FormGroup;
    leaderboardList:any[];
    private _unsubscribeAll: Subject<any>;
    showPlus = true;
   // length: number;

    data = {
        LeaderboardMessageTypes: [
          {
            TypeName: ""
          }

        ]
      }

    /**
     * Constructor
     *
     * @param {MatDialogRef<AddLeaderMessageTypeComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<AddLeaderMessageTypeComponent>,
        private _addleaderboardService : EcommerceAdddLeaderboardMessageTypeService,
        private _router: Router,private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.leaderboardList = [];
        // Set the defaults
        //this.leaderboardForm = this.createComposeForm();
        this.leaderboardForm = this.fb.group({
            LeaderboardMessageTypes: this.fb.array([])
           });
        this.showExtraToFields = false;
        this._unsubscribeAll = new Subject();
        //this.setLeaderBoardType();
    }


    ngOnInit() {

      
        
        this._addleaderboardService.onLeaderboardTypeChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(leaderboardList => {

            this.leaderboardList = leaderboardList.sort((a,b) => a.ID - b.ID);
            for(var i = 0 ; i < this.leaderboardList.length ; i++ ){
               this.setLeaderBoardType();
            }
            this.leaderboardForm.patchValue({
                LeaderboardMessageTypes : this.leaderboardList
            })
     
        });     
        // this.length = this.leaderboardList.length;
        // for(var i = 0 ; i < this.leaderboardList.length ; i++ ){
        //    this.setLeaderBoardType();
        // }
       
    }


     /**
     * On destroy
     */
    ngOnDestroy(): void
    {
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
            LeaderboardMessageTypes:
                new FormArray([
                    new FormControl({TypeName:''})
                ])
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    onAddLeaderboardType() {
        let control = <FormArray>this.leaderboardForm.controls.LeaderboardMessageTypes;
        control.push(
          this.fb.group({
            TypeName: ''
          })
        )
    }
    onKey() {
        this.showPlus = false;
    
      }
    setLeaderBoardType() {
        let control = <FormArray>this.leaderboardForm.controls.LeaderboardMessageTypes;
        this.data.LeaderboardMessageTypes.forEach(x => {
          control.push(this.fb.group({
            TypeName:x.TypeName
          }));
          control.disable();
        })
      }
      onAddLeaderboard() {
        var data = this.leaderboardForm.value.LeaderboardMessageTypes;
        var result = data[0];
         
         this._addleaderboardService.addLeaderboardType(result).then((data) => {
  
              // Show the success message
              if (data.Status == 1) {
                  //let result = data.VendorDetails;
                  alert("LeaderBoardType added successfully");
                  this.matDialogRef.close(true);
                  this._addleaderboardService.getLeaderboardTypes();
              }
              else
                  alert(data.Message);


              this.matDialogRef.close();    
          });
      }
   
}
