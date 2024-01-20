import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import Swal from 'sweetalert2';
import { Receive, ReceivingPageDto } from '../../receiving/receiving.model';
import { ReceivingService } from '../../receiving/receiving.service';
import { Supplier } from '../../supplier/supplier.model';
import { PaymentSupplierDetailService } from '../payment-supplier-detail.service';
import { PaymentSupplier, PaymentSupplierDetail } from '../payment-supplier.model';

@Component({
  selector: 'op-payment-supplier-search-receive-modal',
  templateUrl: './payment-supplier-search-receive-modal.component.html',
  styleUrls: ['./payment-supplier-search-receive-modal.component.css']
})
export class PaymentSupplierSearchReceiveModalComponent implements OnInit {


    @Input() paymentSupplier: PaymentSupplier;
    @Input() supplier: Supplier;

    receives: Receive[];
    isFormDirty: Boolean = false;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        supplierId: 0,
        status: 20,
        supplierName: ""
    };

    constructor(
        public modalService: NgbModal,
        public paymentSupplierDetailService: PaymentSupplierDetailService,
        public receiveService: ReceivingService,
        private spinner: NgxSpinnerService,
    ) { 

    }

    ngOnInit() {
        this.loadReceive(this.curPage);
    }

    loadReceive(page):void {

        this.searchTerm.supplierId = this.supplier.id;
        this.searchTerm.supplierName = this.supplier.name
        // this.spinner.show();
        this.receiveService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<ReceivingPageDto[]>) => this.onSuccess(res.body),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {
                // this.spinner.hide();
            }
        );
    }

    private onSuccess(data) {
        if (data.contents.length < 0) {
            return;
        }
        this.receives = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..', error);
    }

    save(receive: Receive): void {
        var paymentSupplierDetail: PaymentSupplierDetail = new PaymentSupplierDetail();
        paymentSupplierDetail.receiveId = receive.id;
        paymentSupplierDetail.total = receive.grandTotal;
        paymentSupplierDetail.paymentSupplierId = this.paymentSupplier.id;
        this.paymentSupplierDetailService.save(paymentSupplierDetail)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.loadReceive(this.curPage);
                        // this.router.navigate(['/main/receive']);
                        // this.modalService.dismissAll('ok:'+res.body.id);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );

        Swal.fire('Success', 'Save success ', 'info');
    }

    closeForm(): void {
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');
        } else {
            this.modalService.dismissAll('close');
        }
    }

    loadPage() {
        this.loadReceive(this.curPage);
    }
}
