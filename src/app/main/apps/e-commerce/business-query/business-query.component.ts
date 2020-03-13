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
import { MatTableDataSource, MatDialog } from '@angular/material';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { FormGroup } from '@angular/forms';
import { AddBusinessQueryComponent } from '../../mail/dialogs/add-business-query/add-business-query.component';
import { MailComposeDialogComponent } from '../../mail/dialogs/compose/compose.component';
import { EcommerceBusinessQueryService } from './business-query.service';
import { DatePipe } from '@angular/common';
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
    selector: 'e-commerce-business-query',
    templateUrl: './business-query.component.html',
    styleUrls: ['./business-query.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceBusinessQueryComponent implements OnInit {
    
  //  businessqueryData: FilesDataSource | null;
    //dataSource: FilesDataSource | null;
    dataSource : MatTableDataSource<any>;
    displayedColumns = ['select', 'id', 'date','username','company', 'email', 'phone', 'query', 'about'];
    selection = new SelectionModel<PeriodicElement>(true, []);
    selectedDate: string;
    businessqueryData: any;
    searchTerm: string;
   // url = "businessquery"; 

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
    dialogRef: any;
    refreshquery: Subject<any> = new Subject();
   
    constructor(
        private _ecommercebusinessqueryService: EcommerceBusinessQueryService,
        private dialog: MatDialog,
        private datePipe: DatePipe
    ) {
        // Set the private defaults
        this.dataSource =new MatTableDataSource();
 
        this._unsubscribeAll = new Subject();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._ecommercebusinessqueryService.getBusinessQueryList('businessquery')
        .then(data => {
            this.businessqueryData = data.BusinessQueries
              this.dataSource.data =this.businessqueryData;
        })

    }
    ngAfterViewInit(): void {

        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort.toArray()[0];
   
    }
    modalDialog(): void {
        this.dialogRef = this.dialog.open(AddBusinessQueryComponent, {
            panelClass: 'add-business-query',
            width:'450px'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Send
                     */
                    case 'send':
                        console.log('new Mail', formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        console.log('delete Mail');
                        break;
                }
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
    dateSelectionChange(){
        this.selectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
        var url = '' ; 
        if(this.selectedDate != undefined && this.selectedDate != '' ){

            if(url == undefined || url ==''){
                url = "businessqueryfilter?Date="+ this.selectedDate;

                this._ecommercebusinessqueryService.getBusinessQueryList(url)
                .then( data => {
                    this.dataSource.data = data.BusinessQuery;
                })
                

            }
        }
        
    }
    filterQueryByName(event): void {


        if(this.searchTerm == undefined || this.searchTerm.length < 3){
            //return;
            var url = 'businessqueryfilter?QueryString='+this.searchTerm ;   
            this._ecommercebusinessqueryService.getBusinessQueryList(url)
            .then(data => {
                this.dataSource.data = data.BusinessQuery;
            })
        }
       
        if(this.searchTerm == '' || this.searchTerm.length == 0) {
            this._ecommercebusinessqueryService.getBusinessQueryList('businessquery')
            .then(data => {
                this.businessqueryData = data.BusinessQueries
                this.dataSource.data =this.businessqueryData;
            })
        }

    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
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

