import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { EcommerceProductsService } from 'app/main/apps/e-commerce/products/products.service';
import { takeUntil } from 'rxjs/internal/operators';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EcommerceBikerProfileService } from '../biker-profile/biker-profile.service';
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
    selector: 'e-commerce-biker-post',
    templateUrl: './biker-post.component.html',
    styleUrls: ['./biker-post.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceBikerPostComponent implements OnInit {
    UserID : number;
    getstoriesbyUserID :any;



    @ViewChild('postmatCarouselSlide', { static: true }) imgEl: ElementRef;
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _bikerProfileService: EcommerceBikerProfileService,
        private dialog: MatDialog,
        private route: ActivatedRoute,private router: Router
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
        this.route.params.subscribe(params => {
            this.UserID = params['id'];
            console.log(this.UserID);
            this._bikerProfileService.getStoryByUserID(this.UserID)
         .then(data => {
            // this.comments = res;
          
            this.getstoriesbyUserID = data.Stories;
          //this.firstname = this.getstoriesbyID[0].FirstName;
          // this.lastname = this.getstoriesbyID[0].LastName;
          // this.pic = this.getstoriesbyID[0].ProfilePic;
           
            console.log(this.getstoriesbyUserID);
           // console.log(name);
         });

        });
       
    }
    openAlertDialog(): void {
        const dialogRef = this.dialog.open(RequestDialogComponent, {
            data: {
                message: 'Your Request has been Successfully Sent !',
                buttonText: {
                    cancel: 'Done'
                }
            },
        });
    }
    setStoryId(story) {
        let id = story.StoryID;
        console.log(story.StoryID);
        this.router.navigate(['/apps/e-commerce/biker-comments', id]);
    }
    onImgError(event) {
        event.target.src = 'assets/images/profile/default-avatar.png';
    }
}


