import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOMER_CASH_ID } from 'src/app/shared/constants/base-constant';
import Swal from 'sweetalert2';
import { Lookup, LookupPageDto } from '../../lookup/lookup.model';
import { LookupService } from '../../lookup/lookup.service';
import { PaymentDetailService } from '../../payment/payment-detail.service';
import { PaymentOrderService } from '../../payment/payment-order.service';
import { Payment, PaymentDetail, PaymentDetailPageDto, PaymentOrder } from '../../payment/payment.model';
import { PaymentService } from '../../payment/payment.service';
import { SalesOrderDetailService } from '../../sales-order/sales-order-detail.service';
import { SalesOrder, SalesOrderDetail, SalesOrderDetailPageDto } from '../../sales-order/sales-order.model';
import { SalesOrderService } from '../../sales-order/sales-order.service';
import { DirectSalesPayment } from '../direct-sales-payment.model';
import { DirectSalesPaymentService } from '../direct-sales-payment.service';

@Component({
  selector: 'op-direct-sales-payment-modal',
  templateUrl: './direct-sales-payment-modal.component.html',
  styleUrls: ['./direct-sales-payment-modal.component.css']
})
export class DirectSalesPaymentModalComponent implements OnInit {
    @Input() statusRec;
    @Input() objEdit: DirectSalesPayment;

    directSalesPayment: DirectSalesPayment = new DirectSalesPayment();
    paymentTypes: Lookup[];
    paymentTypeSelected: number = 0;
    payment: Payment = new Payment();
    paymentDetails: PaymentDetail[];
    nominalInputBayar: number = 0;
    // totalPayment: number= 0;
    grandTotal: number= 0
    totalDetail: number =0;
    bayarRP: number ;

    // page so detail
    curPageSO: number = 1
    totalData =0;

    salesOrderDetails: SalesOrderDetail[];
    
    constructor(
        private lookupService: LookupService,
        private paymentService: PaymentService,
        private paymentDetailService: PaymentDetailService,
        private paymentOrderService: PaymentOrderService,
        private directSalesPaymentService: DirectSalesPaymentService,
        private modalService: NgbModal,
        private orderService: SalesOrderService,
        private orderDetailService: SalesOrderDetailService,
    ) { }

    ngOnInit() {
        this.directSalesPayment = this.objEdit;
        console.log('obj to edit -> ', this.directSalesPayment);
        this.loadPaymentType();
        this.loadPayment(this.directSalesPayment.salesOrderId);
        this.loadDetailSOById(this.objEdit.salesOrderId);
        // if (this.directSalesPayment.paymentId > 0 ) {
        //     this.reloadPaymentDetail(this.directSalesPayment.paymentId);
        // }
        // this.loadPayment(this.directSalesPayment.salesOrderNo);
        if (this.directSalesPayment.paymentStatus === 0) {
            this.nominalInputBayar = this.directSalesPayment.salesOrderGrandTotal;
        }
    }

    loadDetailSOById(orderId) {

        this.orderDetailService
        .findByOrderId({
            count: 10,
            page: this.curPageSO,
            filter : {
                orderId: orderId,
            }
        }).subscribe(
            (res: HttpResponse<SalesOrderDetailPageDto>) => {
                    this.fillDetail(res)
                },
            (res: HttpErrorResponse) =>{
                console.log(res.message)
                },
        );
    }

    fillDetail(res: HttpResponse<SalesOrderDetailPageDto>) {
        this.salesOrderDetails = [];
        if (res.body.contents === null) {
            return
        }
        if (res.body.contents.length > 0) {
            this.salesOrderDetails = res.body.contents;
            this.totalData  = res.body.totalRow;
        }
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


    loadPayment(salesOrderID: number):void {

        this.paymentService
            .findBySalesOrderID(salesOrderID)
            .subscribe(
                (response: HttpResponse<Payment>) => {
                    this.payment = response.body;
                    if (this.payment.id > 0 ) {
                        this.reloadPaymentDetail(this.payment.id);
                    } 
                }); 

    }

    loadPaymentType() {
        this.lookupService.findByName({
            groupName: 'Payment type',
        }).subscribe(
            (response: HttpResponse<LookupPageDto>) => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', "failed get Payment type data !", 'error');
                    return;
                }
                this.paymentTypes = response.body.contents;
                if (this.paymentTypes.length>0) {
                    this.paymentTypeSelected = this.paymentTypes[0].id;
                }
            });
    }

    saveHdr() {
        if (this.payment.id ==0) {
            this.composePayment();
            this.paymentService
                .save(this.payment)
                .subscribe(
                    (res => {
                        if (res.body.errCode === '00') {
                            this.payment.id = res.body.id;
                            this.payment.paymentNo = res.body.paymentNo;
                            this.payment.status = res.body.status;
                        } else {
                            Swal.fire('Error', res.body.errDesc, 'error');
                        }
                    }),
                    () => {},
                    () => {
                    }
                );

        }
    }


    composePayment() {
        this.payment.customerId = CUSTOMER_CASH_ID;
        this.payment.status == 1;
        this.payment.totalOrder = 0;
        this.payment.totalReturn = 0;
        this.payment.totalPayment = 0;
        this.payment.isCash = true;
    }

    addNewItem(): void {

        if (isNaN(this.nominalInputBayar)) {
            Swal.fire('Error', "Payment number invalid !", 'error');
            return
        }

        if (this.nominalInputBayar <1 ) {
            Swal.fire('Error', "Payment number invalid !", 'error');
            return
        }

        if (this.payment.id ==0) {
            // Swal.fire("Empty", "Kosong","info")
            this.composePayment();
            
            this.paymentService
                .save(this.payment)
                .subscribe(
                    (res => {
                        if (res.body.errCode === '00') {
                            this.payment.id = res.body.id;
                            this.payment.paymentNo = res.body.paymentNo;
                            this.payment.status = res.body.status;
                            this.directSalesPayment.paymentId = res.body.id;
                            this.directSalesPayment.paymentNo =res.body.paymentNo;
                            this.directSalesPayment.paymentStatus =res.body.status;
                            this.savePaymentOrder();
                            this.savePaymentDetail();
                        } else {
                            Swal.fire('Error', res.body.errDesc, 'error');
                        }
                    }),
                    () => {},
                    () => {
                    }
                );

            return
        }

        this.savePaymentDetail();

    }

    savePaymentDetail() {
        let paymentDetail = this.composePaymentDetail();
        this.paymentDetailService
            .save(paymentDetail)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.nominalInputBayar =0;
                        this.reloadPaymentDetail(this.payment.id);
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }),
                () => {
                },
            );
    }

    composePaymentDetail(): PaymentDetail {
        let paymentDetail = new PaymentDetail();
        paymentDetail.paymentReff = "CASH TRANSACTION";
        paymentDetail.total = this.nominalInputBayar;
        paymentDetail.paymentId = this.payment.id;
        paymentDetail.paymentTypeId = +this.paymentTypeSelected; 
        return paymentDetail;
    }

    savePaymentOrder() {
        let paymentOrder = this.composePaymentOrder();
        this.paymentOrderService
            .save(paymentOrder)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        // this.payment.id = res.body.paymentId; 
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }),
                () => {
                },
            );
    }

    composePaymentOrder(): PaymentOrder {
        let paymentOrder = new PaymentOrder();
        paymentOrder.paymentId= this.payment.id;
        paymentOrder.salesOrderId = this.directSalesPayment.salesOrderId;
        paymentOrder.total = this.directSalesPayment.salesOrderGrandTotal;
        return paymentOrder;
    }

    reloadPaymentDetail(paymentId: number) {
        this.paymentDetailService
            .findByPaymentId({
                filter : {
                    paymentId: paymentId,
                }
            }).subscribe(
                (res: HttpResponse<PaymentDetailPageDto>) => 
                    {
                        this.fillPaymentDetail(res)
                    },
                (res: HttpErrorResponse) =>{
                    console.log(res.message)
                    },
            );
    }

    fillPaymentDetail(res: HttpResponse<PaymentDetailPageDto>) {
        this.paymentDetails = [];
        console.log("Load detail payment ==>", res.body.contents);
        if (res.body.contents.length > 0) {
            this.paymentDetails = res.body.contents;
            this.calculateTotal();
        }
    }

    calculateTotal() {
        let total =0
        if (this.paymentDetails) {
            this.paymentDetails.forEach(paymentDetail => {
                total += paymentDetail.total;
            });
        }
        this.payment.totalPayment = total 
    }

    approve(): void {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Approve ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.approveProccess();
                }
            }
        );
    }

    approveProccess(): void{ 
        if (this.directSalesPayment.salesOrderGrandTotal > this.payment.totalPayment) {
            Swal.fire("Info ", "Total Belanja : " + this.directSalesPayment.salesOrderGrandTotal + " lebih besar dari pembayaran " + this.payment.totalPayment + " ! ", "error")
            return
        }
        if (this.directSalesPayment.salesOrderGrandTotal < this.payment.totalPayment) {
            Swal.fire("Info ", "Total pembayaran " + this.payment.totalPayment + " lebih besar dari belanja : " + this.directSalesPayment.salesOrderGrandTotal + " ! ", "error")
            return
        }

        this.directSalesPayment.paymentId = this.payment.id;
        this.directSalesPayment.paymentNo =this.payment.paymentNo;
        this.directSalesPayment.paymentStatus = this.payment.status;
        this.directSalesPaymentService.approve(this.directSalesPayment)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.createInvoice('a');
                        this.modalService.dismissAll('refresh');
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );
    }

    confirmDelPaymentDetail(paymentDetail : PaymentDetail): void {

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Delete ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.deleteItemProccess(paymentDetail);
                }
            }
        );
    }

    deleteItemProccess(paymentDetail : PaymentDetail): void {
        this.paymentDetailService.deleteById(paymentDetail.id)
            .subscribe(
                (res) => {
                    if (res.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                    } else {
                        Swal.fire('Failed', res.errDesc, 'warning');
                    }
                },
                () => { },
                () => { 
                    this.reloadPaymentDetail(this.payment.id);
                }
        );
    }

    createInvoice(tipeReport) {
        this.orderService
            .preview(this.directSalesPayment.salesOrderId, "invoice")
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);
                window.open(objBlob);
            });
    }

    cancelSO() {
        Swal.fire({
            title : 'CANCEL SALES-ORDER',
            text : 'Are you sure to Cancel this Sales Order ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.prosesCancelSO();
                }
            }
        );
    }

    prosesCancelSO() {
        var salesOrder : SalesOrder = new SalesOrder();
        salesOrder.salesOrderNo = this.directSalesPayment.salesOrderNo;
        salesOrder.id = this.directSalesPayment.salesOrderId;

        this.orderService.reject(salesOrder)
            .subscribe(
                (res) => { 
                    this.modalService.dismissAll('refresh');
                }
            )

        Swal.fire('OK', 'Cancel success', 'success');
    }


    rejectPayment() {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to CANCEL Payment ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.rejectPaymentProccess();
                }
            }
        );
    }

    rejectPaymentProccess() {

        this.directSalesPayment.paymentId = this.payment.id;
        this.directSalesPayment.paymentNo =this.payment.paymentNo;
        this.directSalesPayment.paymentStatus = this.payment.status;
        this.directSalesPaymentService.reject(this.directSalesPayment)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.createInvoice('a');
                        this.modalService.dismissAll('refresh');
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );

        
        Swal.fire('OK', 'Cancel success', 'success');
    }

    closeForm() {
        this.modalService.dismissAll('refresh');
    }

    loadPageDetailSO() {
        this.loadDetailSOById(this.objEdit.salesOrderId);
    }

    getDisc(salesOrderDetail :SalesOrderDetail):number {
        var total : number
        total = salesOrderDetail.price *  salesOrderDetail.disc1/100
        return total
    }

    getTotal(salesOrderDetail :SalesOrderDetail):number {
        var total : number
        var disc : number
        disc = salesOrderDetail.qtyOrder *  salesOrderDetail.price *  salesOrderDetail.disc1/100
        total = salesOrderDetail.qtyOrder *  salesOrderDetail.price - disc
        return total
    }

}
