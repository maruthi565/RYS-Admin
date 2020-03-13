import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { EcommerceProductsService } from 'app/main/apps/e-commerce/products/products.service';
import { takeUntil } from 'rxjs/internal/operators';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { EcommerceApproveRequestsService } from './approve-requests.service';

export interface PeriodicElement {
    id: number;
    name: string;
    city: string;
    bikes: string;
    ratings: number;
    rides: number;
    kms: number;
    subscripion: number;
    profile: string;

}

@Component({
    selector: 'e-commerce-approve-requests-coupons',
    templateUrl: './approve-requests.component.html',
    styleUrls: ['./approve-requests.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,


})
export class EcommerceApproveRequestsComponent implements OnInit {
    //dataSource: FilesDataSource | null;
    dataSource : MatTableDataSource<any>;
    displayedColumns = ['select', 'id', 'name', 'city', 'bikes', 'ratings', 'rides', 'kms', 'subscription', 'profile'];
    selection = new SelectionModel<PeriodicElement>(true, []);
    isChecked = true;
    approverequests :any;





    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
    @ViewChildren(MatSort) sort = new QueryList<MatSort>();
    

    // @ViewChild(MatPaginator, { static: true })
    // paginator: MatPaginator;

    // @ViewChild(MatSort, { static: true })
    // sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _ecommerceProductsService: EcommerceProductsService,
        private _approverequestsService: EcommerceApproveRequestsService,
        private dialog: MatDialog
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.dataSource = new  MatTableDataSource();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
  //   this.dataSource = new FilesDataSource(this._approverequestsService, this.paginator, this.sort);

        // fromEvent(this.filter.nativeElement, 'keyup')
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         debounceTime(150),
        //         distinctUntilChanged()
        //     )
        //     .subscribe(() => {
        //         if (!this.dataSource) {
        //             return;
        //         }

        //         this.dataSource.filter = this.filter.nativeElement.value;
        //     });

        this._approverequestsService.getApproveRequests()
        .then(data => {
            this.approverequests = data.Users;
            this.dataSource.data =  this.approverequests;
        })
    }
    ngAfterViewInit(): void {

        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort.toArray()[0];
   
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
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
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: PeriodicElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
}


// export class FilesDataSource extends DataSource<any>
// {
//     private _filterChange = new BehaviorSubject('');
//     private _filteredDataChange = new BehaviorSubject('');

//     /**
//      * Constructor
//      *
//      * @param {EcommerceApproveRequestsService} _approverequestsService
//      * @param {MatPaginator} _matPaginator
//      * @param {MatSort} _matSort
//      */
//     constructor(
//         private _approverequestsService: EcommerceApproveRequestsService,
//         private _matPaginator: MatPaginator,
//         private _matSort: MatSort
//     ) {
//         super();

//         this.filteredData = this._approverequestsService.usersData;
//     }

//     /**
//      * Connect function called by the table to retrieve one stream containing the data to render.
//      *
//      * @returns {Observable<any[]>}
//      */
//     connect(): Observable<any[]> {
//         const displayDataChanges = [
//             this._approverequestsService.onUsersChanged,
//             this._matPaginator.page,
//             this._filterChange,
//             this._matSort.sortChange
//         ];

//         return merge(...displayDataChanges)
//             .pipe(
//                 map(() => {
//                     let data = this._approverequestsService.usersData.slice();

//                     data = this.filterData(data);

//                     this.filteredData = [...data];

//                     data = this.sortData(data);

//                     // Grab the page's slice of data.
//                     const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
//                     return data.splice(startIndex, this._matPaginator.pageSize);
//                 }
//                 ));
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------

//     // Filtered data
//     get filteredData(): any {
//         return this._filteredDataChange.value;
//     }

//     set filteredData(value: any) {
//         this._filteredDataChange.next(value);
//     }

//     // Filter
//     get filter(): string {
//         return this._filterChange.value;
//     }

//     set filter(filter: string) {
//         this._filterChange.next(filter);
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Filter data
//      *
//      * @param data
//      * @returns {any}
//      */
//     filterData(data): any {
//         if (!this.filter) {
//             return data;
//         }
//         return FuseUtils.filterArrayByString(data, this.filter);
//     }

//     /**
//      * Sort data
//      *
//      * @param data
//      * @returns {any[]}
//      */
//     sortData(data): any[] {
//         if (!this._matSort.active || this._matSort.direction === '') {
//             return data;
//         }

//         return data.sort((a, b) => {
//             let propertyA: number | string = '';
//             let propertyB: number | string = '';

//             switch (this._matSort.active) {
//                 case 'id':
//                     [propertyA, propertyB] = [a.id, b.id];
//                     break;
//                 case 'name':
//                     [propertyA, propertyB] = [a.name, b.name];
//                     break;
//                 case 'categories':
//                     [propertyA, propertyB] = [a.categories[0], b.categories[0]];
//                     break;
//                 case 'price':
//                     [propertyA, propertyB] = [a.priceTaxIncl, b.priceTaxIncl];
//                     break;
//                 case 'quantity':
//                     [propertyA, propertyB] = [a.quantity, b.quantity];
//                     break;
//                 case 'active':
//                     [propertyA, propertyB] = [a.active, b.active];
//                     break;
//             }

//             const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//             const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//             return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
//         });
//     }

//     /**
//      * Disconnect
//      */
//     disconnect(): void {
//     }
// }
