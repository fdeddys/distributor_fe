import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SalesOrderDetailService } from '../sales-order-detail.service';
import { SalesOrderDetail } from '../sales-order.model';

@Component({
    selector: 'op-sales-order-modal',
    templateUrl: './sales-order-modal.component.html',
    styleUrls: ['./sales-order-modal.component.css']
})
export class SalesOrderModalComponent implements OnInit {

    @Input() salesOrderDetail: SalesOrderDetail;
    isFormDirty: Boolean = false;

    constructor(
        public modalService: NgbModal,
        public salesOrderDetailService: SalesOrderDetailService
    ) {}

    ngOnInit() {
    }

    closeForm(): void {
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');
        } else {
            this.modalService.dismissAll('close');
        }
    }

    save() {

        this.salesOrderDetailService
            .updateQtyDetailByID(this.salesOrderDetail.id, this.salesOrderDetail.qtyOrder)
            .subscribe(
                res => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.modalService.dismissAll('ok:'+res.body.id);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            )
    }



}
