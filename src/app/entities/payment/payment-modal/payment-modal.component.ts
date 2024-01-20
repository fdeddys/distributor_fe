import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Customer, CustomerPageDto } from '../../customer/customer.model';
import { CustomerService } from '../../customer/customer.service';
import { Lookup, LookupPageDto } from '../../lookup/lookup.model';
import { LookupService } from '../../lookup/lookup.service';
import { PaymentDetailService } from '../payment-detail.service';
import { PaymentModalOrderComponent } from '../payment-modal-order/payment-modal-order.component';
import { PaymentModalReturnComponent } from '../payment-modal-return/payment-modal-return.component';
import { PaymentOrderService } from '../payment-order.service';
import { PaymentReturnService } from '../payment-return.service';
import { Payment, PaymentDetail, PaymentDetailPageDto, PaymentOrder, PaymentOrderPageDto, PaymentReturn, PaymentReturnPageDto } from '../payment.model';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'op-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})

export class PaymentModalComponent implements OnInit {
    
    selectedDate: NgbDateStruct;
    payment: Payment;
    paymentDetails: PaymentDetail[];
    paymentOrders: PaymentOrder[];
    paymentReturns: PaymentReturn[];

    totalOrder: number= 0;
    totalReturn: number= 0
    totalPayment: number= 0;
    grandTotal: number= 0
    totalDetail: number =0;

    /* Untuk search customer
     * local search
     */
    customers: Customer[];
    customerSelected : Customer;

    paymentTypes: Lookup[];
    paymentTypeSelected: number = 0;

    paymentReff: string = '';
    paymentTotal: number = 0;

    // TAB
    active = 1;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private customerService: CustomerService,
        private paymentService: PaymentService,
        private paymentDetailService: PaymentDetailService,
        private paymentOrderService: PaymentOrderService,
        private paymentReturnService: PaymentReturnService,
        private lookupService: LookupService,
        private spinner: NgxSpinnerService,
        private modalService: NgbModal,
    ) {
        this.totalOrder = 0;
        this.totalReturn = 0
        this.totalPayment = 0;
        this.grandTotal = 0;
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        const isValidParam = isNaN(+id);
        console.log('Param ==>', id, ' nan=>', isValidParam);
        if (isValidParam) {
            console.log('Invalid parameter ');
            this.backToLIst();
            return;
        }
        this.loadData(+id);
        this.setToday();
    }

    backToLIst() {
        this.router.navigate(['/main/payment']);
    }

    setToday() {
        const today = new Date();
        this.selectedDate = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
    }

    loadData(paymentId: number) {
        // formatter
        console.log('id ==>?', paymentId);

        this.loadCustomer();
        this.loadPaymentType();
        if (paymentId === 0) {
            this.loadNewData();
            return;
        }
        this.loadDataById(paymentId);
    }

    loadNewData() {
        this.addNew();
    }

    loadDataById(paymentId: number) {

        this.spinner.show();
        let paymentReq = this.paymentService.findById(paymentId);
        let orderPaymentReq = this.paymentOrderService.findByPaymentId({
            filter : {
                paymentId: paymentId,
            }
        });
        // let detailPaymentReq = this.paymentDetailService.findByPaymentId({
        //     filter : {
        //         paymentId: paymentId,
        //     }
        // });
        let returnPaymentReq = this.paymentReturnService.findByPaymentId({
            filter : {
                paymentId: paymentId,
            }
        });
        
        this.reloadPaymentDetail(paymentId);
        this.reloadPaymentOrder(paymentId);
        this.reloadPaymentReturn(paymentId);
        const requestArray = [];
        requestArray.push(paymentReq);
        // requestArray.push(detailPaymentReq);
        // requestArray.push(customerReq);
        requestArray.push(orderPaymentReq);
        requestArray.push(returnPaymentReq);

        forkJoin(requestArray).subscribe(results => {
            this.processPayment(results[0]);
            // this.processCustomer(results[1]);
            this.setCustomerDefault();
            this.spinner.hide();
        });

    }

    processPayment(result: Payment) {
        console.log('isi payment result', result);
        this.payment = result;
        this.calculateTotal();
    }

    calculateTotal() {
        this.totalOrder = 0;
        this.totalReturn = 0;
        this.totalPayment = 0;

        if (this.paymentOrders) {
            this.paymentOrders.forEach(PaymentOrder => {
                this.totalOrder += PaymentOrder.total;
            });
        }

        if (this.paymentReturns) {
            this.paymentReturns.forEach(paymentReturn => {
                this.totalReturn += paymentReturn.total;
            });
        }
      
        if (this.paymentDetails) {
            this.paymentDetails.forEach(paymentDetail => {
                this.totalPayment += paymentDetail.total;
            });
        }

    }

    processCustomer(result: HttpResponse<CustomerPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.customers = result.body.contents;
    }

    setCustomerDefault() {
        this.customerSelected = this.payment.Customer;
        console.log('set selected customer =>', this.customerSelected );
    }

    loadCustomer() {
        this.customerService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            },
        }).subscribe(
            (response: HttpResponse<CustomerPageDto>) => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', "failed get Customer data !", 'error');
                    return;
                }
                this.customers = response.body.contents;
                this.customerSelected = this.customers[0];
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
            });
    }


    formatter = (result: Customer) => result.name.toUpperCase();

    searchCustomer = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term === '' ? []
                : this.customers.filter
                    (v =>
                        v.name
                            .toLowerCase()
                            .indexOf(term.toLowerCase()) > -1
                    )
                    .slice(0, 10))
    )

    reloadPaymentDetail(paymentId: number) {
        this.spinner.show();
        this.paymentDetailService
            .findByPaymentId({
                filter : {
                    paymentId: paymentId,
                }
            }).subscribe(
                (res: HttpResponse<PaymentDetailPageDto>) => 
                    {
                        this.fillPaymentDetail(res),
                        this.spinner.hide();
                    },
                (res: HttpErrorResponse) =>{
                    console.log(res.message),
                    this.spinner.hide();
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

    reloadPaymentOrder(paymentId: number) {
        this.spinner.show();
        this.paymentOrderService
            .findByPaymentId({
                filter : {
                    paymentId: paymentId,
                }
            }).subscribe(
                (res: HttpResponse<PaymentDetailPageDto>) => 
                    {
                        this.fillDetailPaymentOrder(res),
                        this.spinner.hide();
                    },
                (res: HttpErrorResponse) =>{
                    console.log(res.message),
                    this.spinner.hide();
                    },
            );
    }

    fillDetailPaymentOrder(res: HttpResponse<PaymentOrderPageDto>) {
        this.paymentOrders = [];
        console.log("Load detail payment Order ==>", res.body.contents);
        if (res.body.contents.length > 0) {
           
            this.paymentOrders = res.body.contents;
            this.calculateTotal();
        }
    }

    reloadPaymentReturn(paymentId: number) {
        this.spinner.show();
        this.paymentReturnService
            .findByPaymentId({
                filter : {
                    paymentId: paymentId,
                }
            }).subscribe(
                (res: HttpResponse<PaymentReturnPageDto>) => 
                    {
                        this.fillDetailPaymentReturn(res),
                        this.spinner.hide();
                    },
                (res: HttpErrorResponse) =>{
                    console.log(res.message),
                    this.spinner.hide();
                    },
            );
    }

    fillDetailPaymentReturn(res: HttpResponse<PaymentOrderPageDto>) {
        this.paymentReturns = [];
        console.log("Load detail payment Return ==>", res.body.contents);
        if (res.body.contents.length > 0) {
           
            this.paymentReturns = res.body.contents;
            this.calculateTotal();
        }
    }


    confirmDelPaymentDetail (paymentDetail: PaymentDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel this total [ ' + paymentDetail.total + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delPaymenDetail(paymentDetail.id);
                }
            });
    }

    delPaymenDetail(idDetail: number) {
        this.spinner.show();
        this.paymentDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: PaymentDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadPaymentDetail(this.payment.id);
                    } else {
                        Swal.fire('Failed', 'Data failed cancelled', 'info');
                    }
                },
                () => {},
                () => {
                    this.spinner.hide();
                }
            );
    }

    addNewItem() {
    
        let paymentDetail = this.composePaymentDetail();

        this.spinner.show();
        this.paymentDetailService
            .save(paymentDetail)
            .subscribe(
                (res => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        this.reloadPaymentDetail(this.payment.id);
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }),
                () => {
                    this.spinner.hide();
                },
            );
    }

    composePaymentDetail(): PaymentDetail {
        let paymentDetail = new PaymentDetail();
        paymentDetail.paymentReff = this.paymentReff;
        paymentDetail.total = this.paymentTotal;
        paymentDetail.paymentId = this.payment.id;
        paymentDetail.paymentTypeId = +this.paymentTypeSelected; 
        return paymentDetail;
    }

    addNew() {
        this.grandTotal = 0;
        this.totalOrder = 0;
        this.totalPayment=0;
        this.totalReturn = 0;
        this.payment = new Payment();
        this.payment.id = 0;
        this.payment.status = 10;
        this.paymentDetails = [];
        if ( this.customers != undefined ) {
            if (this.customers.length > 0) {
                this.payment.Customer = this.customers[0];
                this.setCustomerDefault();
            }

        } 
        this.setToday() ;
    }

    saveHdr() {
        this.spinner.show();
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
                    this.spinner.hide();
                }
            );
    }

    composePayment() {
        this.payment.Customer = null;
        this.payment.customerId = this.customerSelected.id;
        // this.payment.paymentDate = this.getSelectedDate();
        this.payment.isCash = false;
    }


    getSelectedDate(): string{

        const month = ('0' + this.selectedDate.month).slice(-2);
        const day = ('0' + this.selectedDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';

        return this.selectedDate.year + '-' + month + '-' + day + tz;
    }

    approve() {
        if (!this.isValidDataApprove()){
            return;
        }

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to approve ?',
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
            });
    }

    approveProccess() {
        this.spinner.show();
        this.composePayment();
        this.payment.totalOrder = this.totalOrder;
        this.payment.totalReturn = this.totalReturn;
        this.payment.totalPayment = this.totalPayment;
        
        this.paymentService.approve(this.payment)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/payment']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => {  }
            );
    }

    isValidDataApprove(): boolean {
        if (this.payment.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.paymentDetails.length <= 0) {
            Swal.fire('Error', 'Data Payment belum ada', 'error');
            return false;
        }
        if ( (this.totalOrder - this.totalReturn) != this.totalPayment){
            Swal.fire('Error', 'Total payment dan total bayar belum sama !', 'error');
            return false;
        }
        return true;
    }

    preview(tipeReport) {
        this.spinner.show();
        this.paymentService
            .preview(this.payment.id, tipeReport)
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);
                this.spinner.hide();

                window.open(objBlob);
            });

    }

    addNewSalesOrder(){
        const modalRef = this.modalService.open(PaymentModalOrderComponent, { size: 'lg' });
        modalRef.componentInstance.objEdit = this.payment;

        modalRef.result.then((result) => {
            console.log(`Closed with: ${result}`);
            this.reloadPaymentOrder(this.payment.id);
        }, (reason) => {
            console.log(reason);
            console.log('close w/o refresh');
        });
    }

    refreshSalesOrder(){
        this.reloadPaymentOrder(this.payment.id);
    }

    confirmDelPaymentOrder(paymentOrder: PaymentOrder){
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to process ' +  paymentOrder.salesOrder.salesOrderNo + ' ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.proccessDeletePaymentOrder(paymentOrder);
                }
            });
    }
        
    proccessDeletePaymentOrder(paymentOrder: PaymentOrder) {
        this.paymentOrderService.deleteById(paymentOrder.id)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                    } else {
                        Swal.fire('Failed', res.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => { 
                    this.reloadPaymentOrder(this.payment.id);
                }
            );
    }

    confirmDelPaymentReturn(paymentReturn: PaymentReturn){
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to process ' +  paymentReturn.salesOrderReturn.returnNo + ' ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.proccessDeletePaymentReturn(paymentReturn);
                }
            });
    }

    proccessDeletePaymentReturn(paymentReturn: PaymentReturn) {
        this.paymentReturnService.deleteById(paymentReturn.id)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                    } else {
                        Swal.fire('Failed', res.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => { 
                    this.reloadPaymentReturn(this.payment.id);
                }
            );
    }

    refreshReturn(){
        this.reloadPaymentReturn(this.payment.id);
    }

    addNewReturn(){
        const modalRef = this.modalService.open(PaymentModalReturnComponent, { size: 'lg' });
        modalRef.componentInstance.objEdit = this.payment;

        modalRef.result.then((result) => {
            console.log(`Closed with: ${result}`);
            this.reloadPaymentOrder(this.payment.id);
        }, (reason) => {
            console.log(reason);
            console.log('close w/o refresh');
        });
    }

    refreshPaymentDetail() {
        this.reloadPaymentDetail(this.payment.id)
    }
}
