import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeaderboardService } from './leaderboard.service';
import { Router } from '@angular/router';

@Component({
    selector: 'leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LeaderboardComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    getleaderboard:any[];
    selected=-1;
    fromPage: any;
    UserID : number;
    id : number;
    datas: any;



    @ViewChild('ref', {static: true}) ref;
    /**
     * Constructor
     *
     * @param {MatDialogRef<LeaderboardComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<LeaderboardComponent>,
        private _leaderboardService : LeaderboardService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _router : Router
    ) {
        // Set the defaults
        this.composeForm = this.createComposeForm();
        this.showExtraToFields = false;
        this.fromPage = _data.leaderboardValue;
        console.log(this.fromPage);
        this.UserID = this.fromPage.UserID;
        console.log(this.UserID);
    }

    form = new FormGroup({
        name:new FormControl(),
        resolved: new FormControl()
      })

    ngOnInit() {
        this._leaderboardService.getLeaderboardTypes()
        .then(data => {
            this.getleaderboard = data.LeaderboardMessageTypes.sort((a,b) => a.ID - b.ID);

            this.selected  = this.getleaderboard.findIndex(item => item.UserID == this.UserID);
            //console.log(this.selected);
            this.form.value.resolved = this.selected ;
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
            query1: new FormControl(''),
            query2: new FormControl(''),
            query3: new FormControl(''),
            query4: new FormControl(''),
            // isChecked : new FormControl(false)
           
           
        });
    }
    setLeaderboardId(rank) {

        //console.log("SSSSSSSSSSSSSS");
          //event.preventDefault();
        // if(this.selected == -1) {
        //     console.log('onClick is notttttttt selected '+ this.selected);
        //    // this.selected = !this.selected;
        // }
        // else if(this.selected!=null || this.selected!= undefined) {
        //     console.log('onClick selected '+ this.selected);
        //    // this.selected = !this.selected;
        // }
        console.log("AAAAAAAA:::::"+this.form.value.resolved);

        if(this.form.value.resolved == true || this.form.value.resolved == -1){
             console.log("checkeddddddd::::::"+this.form.value.resolved);
             this.id = rank.ID;
             console.log(this.id);  
        }else if(this.form.value.resolved == false || this.form.value.resolved == 0){
            console.log("unCheckeddddddd::::::"+this.form.value.resolved);
            this.id = rank.ID;
            console.log(this.id);  
        }
      
        this.id =rank.ID;
        console.log(this.id) ;
   
           
       
    }
    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    onAddRank() {
        let id = this.id;
        console.log(id);
        console.log(this.form.value.resolved);
        if(this.form.value.resolved == true || this.form.value.resolved == -1){
            this.datas = {
                "UserID" : 0
    
           }
           console.log(this.datas);
           this._leaderboardService.updateLeaderBoard(this.datas,id).then((data) => {
        
            if (data.Status == 1) {
            alert("LeaderBoardRank Deactivated successfully");
            this.matDialogRef.close(true);
            //this._router.navigate(['apps/e-commerce/users']);
            }
            else
            alert(data.Message);
            });
        }else if(this.form.value.resolved == false || this.form.value.resolved == 0){
            this.datas = {
                "UserID" : this.UserID
    
           }
           this._leaderboardService.updateLeaderBoard(this.datas,id).then((data) => {
        
            if (data.Status == 1) {
            alert("LeaderBoardRank Activated successfully");
            this.matDialogRef.close(true);
            //this._router.navigate(['apps/e-commerce/users']);
            }
            else
            alert(data.Message);
            });
        }
            
                
       
       
       
        
     
        
        }
}
