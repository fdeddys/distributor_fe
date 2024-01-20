import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import Swal from 'sweetalert2';
import { SalesOrderReturn, SalesOrderReturnPageDto } from '../../sales-order-return/sales-order-return.model';
import { SalesOrderReturnService } from '../../sales-order-return/sales-order-return.service';
import { PaymentReturnService } from '../payment-return.service';
import { Payment, PaymentReturn } from '../payment.model';

@Component({
  selector: 'op-payment-modal-return',
  templateUrl: './payment-modal-return.component.html',
  styleUrls: ['./payment-modal-return.component.css']
})
export class PaymentModalReturnComponent implements OnInit {

    objEdit : Payment;
    salesOrderReturns: SalesOrderReturn[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        code: '',
        name: '',
        customerId:0,
    };
    closeResult: string;
    constructor(
        private salesOrderReturnService: SalesOrderReturnService,
        private spinner: NgxSpinnerService,
        private paymentReturnService: PaymentReturnService,
    ) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        // this.spinner.show();
        this.searchTerm.customerId = this.objEdit.customerId;
        this.salesOrderReturnService.filterForSalesOrderReturn({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<SalesOrderReturnPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {
                // this.spinner.hide();
             }
        );
        console.log(page);
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
            code: '',
            name: '',
            customerId:0,
        };
        this.loadAll(1);
    }

    loadPage() {
        this.loadAll(this.curPage);
    }

    getStatus(id): string {
        let statusName = 'Unknown';
        switch (id) {
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
            case 40:
                statusName = 'Invoice';
                break;
            case 50:
                statusName = 'Paid';
                break;
        }
        return statusName;
    }

    prosesPaymentReturn(salesOrderReturn: SalesOrderReturn) {

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to process ' +  salesOrderReturn.returnNo + ' ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.proccess(salesOrderReturn);
                }
            });
    }

    proccess(salesOrderReturn: SalesOrderReturn) {
        var paymentReturn: PaymentReturn
       
        // this.spinner.show();
        paymentReturn = new PaymentReturn();
        paymentReturn.paymentId = this.objEdit.id;
        paymentReturn.salesOrderReturnId = salesOrderReturn.id;
        paymentReturn.total = salesOrderReturn.total;
        
        this.paymentReturnService.save(paymentReturn)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => { 
                    this.curPage= 1;
                    this.loadAll(this.curPage);
                 }
            );        
    }

}
