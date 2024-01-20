import { Component, OnInit } from '@angular/core';
import { Adjustment, AdjustmentPageDto } from './adjustment.model';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { Router } from '@angular/router';
import { AdjustmentService } from './adjustment.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'op-adjustment',
    templateUrl: './adjustment.component.html',
    styleUrls: ['./adjustment.component.css']
})
export class AdjustmentComponent implements OnInit {

    adjustments: Adjustment[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        code: '',
        adjustmentNumber: '',
        description : '',
        startDate:'',
        endDate:'',
    };
    closeResult: string;
    startDate: NgbDateStruct;
    endDate : NgbDateStruct;
    
    constructor(
        private route: Router,
        private adjustmentService: AdjustmentService,
        private location: Location,
    ) { }

    setToday() {
        const today = new Date();
       
        let startdate = sessionStorage.getItem("adjustment:startDate")
        if (startdate == null) {
            this.startDate = {
                year: today.getFullYear(),
                day: today.getDate(),
                month: today.getMonth() + 1,
            };
        } else {
            this.startDate = {
                year: Number (startdate.substring(0,4)),
                month: Number (startdate.substring(5,7)),
                day: Number (startdate.substring(8,10)),
            };
        }

        let enddate = sessionStorage.getItem("adjustment:endDate")
        if (enddate == null) {
            this.endDate = {
                year: today.getFullYear(),
                day: today.getDate(),
                month: today.getMonth() + 1,
            };
        } else {
            this.endDate = {
                year: Number (enddate.substring(0,4)),
                month: Number (enddate.substring(5,7)),
                day: Number (enddate.substring(8,10)), 
            }
        }
        
    }

    getStartDate(): string{

        const month = ('0' + this.startDate.month).slice(-2);
        const day = ('0' + this.startDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';

        return this.startDate.year + '-' + month + '-' + day + tz;
    }

    getEndDate(): string{

        const month = ('0' + this.endDate.month).slice(-2);
        const day = ('0' + this.endDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';

        return this.endDate.year + '-' + month + '-' + day + tz;
    }


    ngOnInit() {
        this.setToday();
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.searchTerm.startDate = '';
        if (this.startDate !== null) {
            this.searchTerm.startDate = this.getStartDate();
        } 
        this.searchTerm.endDate = '';
        if (this.endDate !== null) {
            this.searchTerm.endDate = this.getEndDate();
        } 
        sessionStorage.setItem("adjustment:startDate",this.searchTerm.startDate )
        sessionStorage.setItem("adjustment:endDate",this.searchTerm.endDate)

        this.adjustmentService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<AdjustmentPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );
        console.log(page);
        // console.log(this.brand);
    }

    addNew() {
        this.route.navigate(['/main/adjustment/', 0 ]);
    }

    open(obj: Adjustment) {
        console.log("nav ", obj);
        this.route.navigate(['/main/adjustment/' +  obj.id ]);

    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.adjustments = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..');
    }

    resetFilter() {
        this.searchTerm = {
            code: '',
            adjustmentNumber: '',
            description : '',
            startDate:'',
            endDate:'',
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
            case 1:
            case 10:
                statusName = 'Outstanding';
                break;
            case 20:
                statusName = 'Approved';
                break;
            case 30:
                statusName = 'Rejected';
                break;
        }
        return statusName;
    }

}
