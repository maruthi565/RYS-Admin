import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { MatCarouselSlide, MatCarouselSlideComponent } from '@ngmodule/material-carousel';

@Component({
    selector: 'e-commerce-get-ride',
    templateUrl: './get-ride.component.html',
    styleUrls: ['./get-ride.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceGetRideComponent {
    showExtraToFields: boolean;
    addCouponForm: FormGroup;
    isChecked = true;
    Checked = true;
    isCheck = true;
    selectedRideDetails:any;
    StartTime :any;
    EndTime : any;
    public slides;


    /**
     * Constructor
     *
     * @param {MatDialogRef<EcommerceViewRideComponent>} matDialogRef
     * @param _data
     */
    constructor(

    ) {
        // Set the defaults
        this.addCouponForm = this.createComposeForm();
        this.showExtraToFields = false;
    }
    ngOnInit() {
        this.selectedRideDetails = JSON.parse(localStorage.getItem('selectedRideRow'));
       
        this.StartTime = this.selectedRideDetails.StartTime;
        var H = +this.StartTime.substr(0, 2);
        var h = (H % 12) || 12;
        var ampm = H < 12 ? "AM" : "PM";
        this.StartTime = h + this.StartTime.substr(2, 3) + ampm;
        
        this.EndTime = this.selectedRideDetails.EndTime;
        var H = +this.EndTime.substr(0,2);
        var h = (H % 12) || 12;
        var ampm = H < 12 ? "AM" : "PM";
        this.EndTime = h + this.StartTime.substr(2, 3) + ampm;
        this.slides =[
            { image: "assets/images/cards/rideview.png" },  
            { image: "assets/images/backgrounds/rider.jpeg" },   
            { image: "assets/images/backgrounds/event.jpeg" },   
        ];

        
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
            name: new FormControl(''),
            description: new FormControl(''),
            location: new FormControl(''),
            venue: new FormControl(''),
            city: new FormControl(''),
            invite: new FormControl(''),
            premium: new FormControl(''),
            price: new FormControl(''),
            descrip: new FormControl(''),

        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    

}
