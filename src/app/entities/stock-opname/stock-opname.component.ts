import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { StockOpname, StockOpnamePageDto } from './stock-opname.model';
import { StockOpnameService } from './stock-opname.service';
import { Location } from '@angular/common';

@Component({
  selector: 'op-stock-opname',
  templateUrl: './stock-opname.component.html',
  styleUrls: ['./stock-opname.component.css']
})
export class StockOpnameComponent implements OnInit {

    stockOpnames: StockOpname[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        code: '',
        name: '',
        description : '',
    };
    closeResult: string;
    constructor(
        private route: Router,
        private stockOpnameService: StockOpnameService,
        private location: Location,
    ) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.stockOpnameService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<StockOpnamePageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );
        console.log(page);
        // console.log(this.brand);
    }

    addNew() {
        this.route.navigate(['/main/stock-opname/', 0 ]);
    }

    open(obj: StockOpname) {
        console.log("nav ", obj);
        this.route.navigate(['/main/stock-opname/' +  obj.id ]);

    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.stockOpnames = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..');
    }

    resetFilter() {
        this.searchTerm = {
            code: '',
            name: '',
            description : '',
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
        let statusName = 'Unknown';
        switch (id) {
            case 0:
                statusName = 'Outstanding';
                break;
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
