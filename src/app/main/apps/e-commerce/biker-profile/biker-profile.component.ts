import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { EcommerceBikerProfileService } from './biker-profile.service';

@Component({
    selector: 'e-commerce-biker-profile',
    templateUrl: './biker-profile.component.html',
    styleUrls: ['./biker-profile.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceBikerProfileComponent {
    showExtraToFields: boolean;
    addCouponForm: FormGroup;
    check1 = true;
    check2 = false;
    check3 = true;
    UserID : number;
    getstoriesbyID : any;
    firstname: any;
    lastname : any;
    pic : any;

    @ViewChild('matCarouselSlide', { static: true }) imgEl: ElementRef;
    /**
     * Constructor
     *
     * @param {MatDialogRef<EcommerceBikerProfileComponent>} matDialogRef
     * @param _data
     */
    constructor(
        private route: ActivatedRoute,
        private _bikerProfileService : EcommerceBikerProfileService,
        private router: Router
    ) {
        // Set the defaults
        this.addCouponForm = this.createComposeForm();
        this.showExtraToFields = false;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.UserID = params['id'];
            console.log(this.UserID);
         
       this._bikerProfileService.getStoryByUserID(this.UserID)
         .then(data => {
            // this.comments = res;
          
            this.getstoriesbyID = data.Stories;
          this.firstname = this.getstoriesbyID[0].FirstName;
           this.lastname = this.getstoriesbyID[0].LastName;
           this.pic = this.getstoriesbyID[0].ProfilePic;
           
            console.log(this.getstoriesbyID);
            console.log(name);
         });

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
            description: new FormControl(''),
           

        });
    }
    onImgError(event) {
        event.target.src = 'assets/images/profile/default-avatar.png';
    }
    sendUserId() {
        //console.log(this.UserID);
        let id =this.UserID;
        this.router.navigate(['/apps/e-commerce/biker-post', id]);
    
    }
    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

}
