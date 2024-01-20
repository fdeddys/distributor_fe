import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { SalesOrderReturn, SalesOrderReturnPageDto } from './sales-order-return.model';
import { SalesOrderReturnService } from './sales-order-return.service';
import { Location } from '@angular/common';

@Component({
  selector: 'op-sales-order-return',
  templateUrl: './sales-order-return.component.html',
  styleUrls: ['./sales-order-return.component.css']
})
export class SalesOrderReturnComponent implements OnInit {

    salesOrderReturns: SalesOrderReturn[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        no: '',
        name: '',
    };
    closeResult: string;
    constructor(
        private route: Router,
        private salesOrderReturnService: SalesOrderReturnService,
        private location: Location,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit() {
        let name = sessionStorage.getItem("return-so:name")
        if (name!==null) {
            this.searchTerm.name = name
        }
        let no = sessionStorage.getItem("return-so:no")
        if (no!==null) {
            this.searchTerm.no = no
        }
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        sessionStorage.setItem("return-so:name",this.searchTerm.name)
        sessionStorage.setItem("return-so:no",this.searchTerm.no)
        this.spinner.show();
        this.salesOrderReturnService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<SalesOrderReturnPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {
                this.spinner.hide();
             }
        );
        console.log(page);
    }

    addNew() {
        this.route.navigate(['/main/sales-order-return/', 0 ]);
    }

    open(obj: SalesOrderReturn) {
        console.log("nav ", obj);
        this.route.navigate(['/main/sales-order-return/' +  obj.id ]);
    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.salesOrderReturns = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..');
    }

    resetFilter() {
        this.searchTerm = {
            no: '',
            name: '',
        };
        this.loadAll(1);
    }

    loadPage() {
        this.loadAll(this.curPage);
    }

    goBack() {
        this.location.back();
    }

    getStatus(id): string {
        let statusName = "Unknown [" + id + "]"
        switch (id) {
            case 0:
            case 1:
            case 10:
                statusName = 'Outstanding';
                break;
            case 20:
                statusName = 'Submit';
                break;
            case 30:
                statusName = 'Cancel';
                break;
        }
        return statusName;
    }
}
