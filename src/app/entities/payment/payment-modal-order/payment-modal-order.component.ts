import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import Swal from 'sweetalert2';
import { SalesOrder, SalesOrderPageDto } from '../../sales-order/sales-order.model';
import { SalesOrderService } from '../../sales-order/sales-order.service';
import { PaymentOrderService } from '../payment-order.service';
import { Payment, PaymentOrder } from '../payment.model';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'op-payment-modal-order',
  templateUrl: './payment-modal-order.component.html',
  styleUrls: ['./payment-modal-order.component.css']
})
export class PaymentModalOrderComponent implements OnInit {

    objEdit : Payment;
    salesOrders: SalesOrder[];
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
        private salesOrderService: SalesOrderService,
        private spinner: NgxSpinnerService,
        private paymentOrderService: PaymentOrderService,
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
        this.salesOrderService.filterForSalesOrder({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<SalesOrderPageDto[]>) => this.onSuccess(res.body, res.headers),
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

    prosesPayment(salesOrder: SalesOrder) {

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to process ' +  salesOrder.salesOrderNo + ' ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.proccess(salesOrder);
                }
            });
    }

    proccess(salesOrder: SalesOrder) {
        var paymenOrder: PaymentOrder
       
        // this.spinner.show();
        paymenOrder = new PaymentOrder();
        paymenOrder.paymentId = this.objEdit.id;
        paymenOrder.salesOrderId=salesOrder.id;
        paymenOrder.total = salesOrder.grandTotal;
        
        this.paymentOrderService.save(paymenOrder)
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
