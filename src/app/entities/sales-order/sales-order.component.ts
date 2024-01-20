import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrderService } from './sales-order.service';
import { SalesOrder, SalesOrderPageDto } from './sales-order.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'op-sales-order',
    templateUrl: './sales-order.component.html',
    styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit {

    salesOrders: SalesOrder[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        code: '',
        name: '',
        description : '',
        isCash: false,
        startDate:'',
        endDate:'',
    };
    moduleTitle: string = "";
    isCash: boolean = false;
    closeResult: string;
    startDate: NgbDateStruct;
    endDate : NgbDateStruct;
    
    constructor(
        private route: Router,
        private router: ActivatedRoute,
        private salesOrderService: SalesOrderService,
        private location: Location,
        private spinner: NgxSpinnerService,
    ) { }

    setToday() {

        const today = new Date();
        
        let startdate = sessionStorage.getItem("sales-order:startDate")
        if (startdate == null) {
            this.startDate = {
                year: today.getFullYear(),
                day: today.getDate(),
                month: today.getMonth() + 1,
            };
        } else {
            this.startDate = {
                // 2022-09-06T00:00:00+07:00
                year: Number (startdate.substring(0,4)),
                month: Number (startdate.substring(5,7)),
                day: Number (startdate.substring(8,10)),
            };
        }

        let enddate = sessionStorage.getItem("sales-order:endDate")
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
        let page = sessionStorage.getItem("sales-order:page")
        console.log("get session page ===", page)
        // if (page!==null) {
        //     this.curPage = Number(page)
        // } 
    }

    ngOnInit() {

        this.setToday();
        this.router.data.subscribe(
            data => {
                console.log("data===>",data.cash);

                this.moduleTitle ="Sales Order";
                this.isCash = data.cash;
                if (this.isCash) {
                    this.moduleTitle ="Direct Sales";
                }
                this.loadAll(this.curPage);
            }
        );
    }

    onFilter() {
        this.loadAll(this.curPage);
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
    
    loadAll(page) {
        this.spinner.show();
        this.searchTerm.startDate = '';
        if (this.startDate !== null) {
            this.searchTerm.startDate = this.getStartDate();
        } 
        this.searchTerm.endDate = '';
        if (this.endDate !== null) {
            this.searchTerm.endDate = this.getEndDate();
        } 

        this.searchTerm.isCash = this.isCash;

        sessionStorage.setItem("sales-order:startDate",this.searchTerm.startDate )
        sessionStorage.setItem("sales-order:endDate",this.searchTerm.endDate)
        sessionStorage.setItem("sales-order:page",page)

        this.salesOrderService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<SalesOrderPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {
                this.spinner.hide();
             }
        );
        console.log(page);
    }

    addNew() {
        
        if (this.isCash) {
            this.route.navigate(['/main/direct-sales/', 0 ]);
            return
        } 
        this.route.navigate(['/main/sales-order/', 0 ]);
        
    }

    open(obj: SalesOrder) {
        console.log("nav ", obj);
        if (this.isCash) {
            this.route.navigate(['/main/direct-sales/' +  obj.id ]);
            return
        }
        this.route.navigate(['/main/sales-order/' +  obj.id ]);
    }

    // private getDismissReason(reason: any): string {
    //     if (reason === ModalDismissReasons.ESC) {
    //         return 'by pressing ESC';
    //     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //         return 'by clicking on a backdrop';
    //     } else {
    //         return `with: ${reason}`;
    //     }
    // }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.salesOrders = data.contents;
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
            isCash: false,
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
            case 40:
                statusName = 'Invoice';
                break;
            case 50:
                statusName = 'Paid';
                break;
            case 60:
                statusName = 'Payment Cancel';
                break;
        }
        return statusName;
    }

}
