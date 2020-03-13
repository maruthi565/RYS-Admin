import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { EcommerceBikerCommentsService } from './biker-comments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
    selector: 'e-commerce-biker-comments',
    templateUrl: './biker-comments.component.html',
    styleUrls: ['./biker-comments.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceBikerCommentsComponent {
    showExtraToFields: boolean;
    addCommentForm: FormGroup;
    check1 = true;
    check2 = false;
    check3 = true;
    StoryID: number;
    comments : any;
    getcomments: any;
    refresh: Subject<any> = new Subject();


    /**
     * Constructor
     *
     * @param {MatDialogRef<EcommerceBikerCommentsComponent>} matDialogRef
     * @param _data
     */
    constructor(
        private _bikercommentsService :EcommerceBikerCommentsService,
        private route: ActivatedRoute,
        private _router:Router

    ) {
        // Set the defaults
        this.addCommentForm = this.createComposeForm();
        this.showExtraToFields = false;
    }

    ngOnInit() {

        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._bikercommentsService.getStoryComments(this.StoryID);
            }
        });

        this.route.params.subscribe(params => {
            this.StoryID = params['id'];
            console.log(this.StoryID);
         
       this._bikercommentsService.getStoryComments(this.StoryID)
         .then((res: Response) => {
             this.comments = res;
          
            this.getcomments = this.comments.Comments;
            console.log(this.getcomments);
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
            Comment: new FormControl(''),
           

        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    onAddComment() {
         this.addCommentForm.value.StoryID = this.StoryID;
        this.addCommentForm.value.UserID = Number(localStorage.getItem('AdminUserID'));;
        // this.addStoreForm.value.StoreImages = "images";
        // this.addStoreForm.value.StoreLogo = "mtouch";
        // this.addStoreForm.value.VoucherValue = Number(this.addStoreForm.value.VoucherValue);
        // this.addStoreForm.value.Price = Number(this.addStoreForm.value.Price);
        this._bikercommentsService.addComments(this.addCommentForm.value).then((data) => {

            // Show the success message
            if (data.Status == 1) {
                
                alert("Comment added successfully");
                this.refresh.next(true);
                //this._router.navigate(['apps/e-commerce/biker-comments']);
            }
            else
                alert(data.Message);
        });
    }

}
