import { Component, OnInit } from '@angular/core';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { ReturnReceive, ReturnReceivePageDto } from './return-receiving.model';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReturnReceivingService } from './return-receiving.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'op-return-receiving',
  templateUrl: './return-receiving.component.html',
  styleUrls: ['./return-receiving.component.css']
})
export class ReturnReceivingComponent implements OnInit {

    returnReceives: ReturnReceive[];
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
        private returnReceiveService: ReturnReceivingService,
        private location: Location,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit() {
        let name = sessionStorage.getItem("return-receive:name")
        if (name!==null) {
            this.searchTerm.name = name
        }

        let no = sessionStorage.getItem("return-receive:no")
        if (no!==null) {
            this.searchTerm.no = no
        }


        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.spinner.show();
        sessionStorage.setItem("return-receive:name",this.searchTerm.name)
        sessionStorage.setItem("return-receive:no",this.searchTerm.no)
        this.returnReceiveService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<ReturnReceivePageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {
                this.spinner.hide();
             }
        );
        console.log(page);
    }

    addNew() {
        this.route.navigate(['/main/return-receive/', 0 ]);
    }

    open(obj: ReturnReceive) {
        console.log("nav ", obj);
        this.route.navigate(['/main/return-receive/' +  obj.id ]);
    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.returnReceives = data.contents;
        this.totalData = data.totalRow;
        console.log("total row " + data.totalRow);
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
