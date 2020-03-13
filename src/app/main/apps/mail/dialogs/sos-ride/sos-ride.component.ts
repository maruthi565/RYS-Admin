import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EcommerceSOSRideService } from './sos-ride.service';

@Component({
    selector: 'sos-ride',
    templateUrl: './sos-ride.component.html',
    styleUrls: ['./sos-ride.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SosHomeRideDialogComponent {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    rides: any;
    getsosrides: any;
    fromPage:any;
    userid : number;
    sosData: any;
    /**
     * Constructor
     *
     * @param {MatDialogRef<SosHomeRideDialogComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<SosHomeRideDialogComponent>,
        private _viewsosrideService : EcommerceSOSRideService,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        // Set the defaults
        this.composeForm = this.createComposeForm();
        this.showExtraToFields = false;
         
        this.fromPage = _data.pageValue;
        //console.log(this.fromPage);
    }


    ngOnInit() {
        this.sosData = this.fromPage;
        this.userid = this.fromPage.UserID;


        this._viewsosrideService.getSOSRideDetails(this.userid)
                .then(data=> {
                
                    this.getsosrides = data.SOSActivities;
                    if(this.sosData.fromActivity == 'Home'){
                        this.getsosrides = this.getsosrides.filter(item => item.HomeOrRide == 0 );

                    }
                    if(this.sosData.fromActivity == 'Ride'){
                        this.getsosrides = this.getsosrides.filter(item => item.HomeOrRide == 1);

                    }
                   
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
            title: new FormControl(''),
            price: new FormControl(''),
            driven: new FormControl('')
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
}
