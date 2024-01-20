import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import Swal from 'sweetalert2';
import { PurchaseOrder, PurchaseOrderPageDto } from '../../purchase-order/purchase-order.model';
import { PurchaseOrderService } from '../../purchase-order/purchase-order.service';
import { Supplier } from '../../supplier/supplier.model';
import { Receive } from '../receiving.model';
import { ReceivingService } from '../receiving.service';

@Component({
  selector: 'op-receiving-search-po-modal',
  templateUrl: './receiving-search-po-modal.component.html',
  styleUrls: ['./receiving-search-po-modal.component.css']
})
export class ReceivingSearchPoModalComponent implements OnInit {
    @Input() receive: Receive;
    @Input() supplier: number;
    @Input() receiveDate: string;

    purchaseOrders: PurchaseOrder[];
    isFormDirty: Boolean = false;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        supplierId: 0,
        purchaseOrderNo: '',
        status: 20,
    };

    constructor(
        public modalService: NgbModal,
        public purchaseOrderService: PurchaseOrderService,
        public receivingService: ReceivingService,
        private spinner: NgxSpinnerService,
    ) { 

    }

    ngOnInit() {
        console.log("supplier selected 1 => ", this.supplier)
        this.loadPurchaseOrder(1);
    }

    loadPurchaseOrder(page):void {

        console.log("supplier selected 2 => ", this.supplier)
        this.searchTerm.supplierId = +this.supplier;
        // this.spinner.show();
        this.purchaseOrderService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<PurchaseOrderPageDto[]>) => this.onSuccess(res.body),
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
        this.purchaseOrders = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..', error);
    }

    save(purchaseOrder: PurchaseOrder): void {
        // var receive: Receive = new Receive();
        console.log('===>', purchaseOrder);
        this.receive.receiveDate = this.receiveDate;
        this.receive.receiveNo = '';
        this.receive.supplierId = +this.supplier;
        this.receive.poNo = purchaseOrder.purchaseOrderNo;
        // console.log('xx===>', receive);
        this.receivingService.saveByPO(this.receive)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        // this.router.navigate(['/main/receive']);
                        this.modalService.dismissAll('ok:'+res.body.id);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );

        console.log("nav ", purchaseOrder);
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
        this.loadPurchaseOrder(this.curPage);
    }

}
