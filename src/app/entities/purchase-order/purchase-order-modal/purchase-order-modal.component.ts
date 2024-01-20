import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Lookup } from '../../lookup/lookup.model';
import { PurchaseOrderDetailService } from '../purchase-order-detail.service';
import { PurchaseOrder, PurchaseOrderDetail } from '../purchase-order.model';

@Component({
  selector: 'op-purchase-order-modal',
  templateUrl: './purchase-order-modal.component.html',
  styleUrls: ['./purchase-order-modal.component.css']
})
export class PurchaseOrderModalComponent implements OnInit {

    @Input() purchaseOrderDetail: PurchaseOrderDetail;

    uoms: Lookup[];
    uomSelected: Lookup;
    isFormDirty: Boolean = false;
    smallUom;
    bigUom:Lookup;
    currentPrice: number =0;

    constructor(
        public modalService: NgbModal,
        public purchaseOrderDetailService: PurchaseOrderDetailService,
    ) { }

    ngOnInit() {

        this.uoms = [];
        if (this.purchaseOrderDetail.product.bigUom !== null ) {
            this.uoms.push(this.purchaseOrderDetail.product.bigUom);
            this.bigUom = this.purchaseOrderDetail.product.bigUom;
        }
        if (this.purchaseOrderDetail.product.smallUom !== null) {
            this.uoms.push(this.purchaseOrderDetail.product.smallUom);
            this.smallUom = this.purchaseOrderDetail.product.smallUom;
        }

        if (this.purchaseOrderDetail.poUomId == this.purchaseOrderDetail.product.bigUomId) {
            this.uomSelected = this.purchaseOrderDetail.product.bigUom;
        } else {
            this.uomSelected = this.purchaseOrderDetail.product.smallUom;
        }
        this.currentPrice = this.purchaseOrderDetail.poPrice;
    }


    closeForm(): void {
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');
        } else {
            this.modalService.dismissAll('close');
        }
    }

    composePurchaseOrderDetail(): PurchaseOrderDetail {
        let poDetail = new PurchaseOrderDetail();
        poDetail.id = this.purchaseOrderDetail.id;
        console.log("compose => ",this.uomSelected.id)
        poDetail.poUomId = +this.uomSelected.id;
        poDetail.poQty = this.purchaseOrderDetail.poQty;
        // poDetail.poPrice = this.purchaseOrderDetail.poPrice;
        poDetail.poPrice = this.currentPrice;

        console.log('PO Price', this.purchaseOrderDetail.poPrice);    
        // satuan kecil dipilih, maka po detail convert ke satuan kecil
        console.log("uom selected [" ,this.uomSelected , "] small uom id[" , this.smallUom.id,"]")
        if (this.uomSelected.id == this.smallUom.id) {
            console.log('small uom selected ')
            poDetail.poUomQty = 1;
            poDetail.qty = this.purchaseOrderDetail.poQty;
            poDetail.price = this.currentPrice ;
            poDetail.uomId = +this.uomSelected.id;
            // this.purchaseOrderDetail.product.smallUom.id;
        } else {
            // convert jadi satuan besar
            console.log('big uom selected ')
            // poDetail.poPrice = this.purchaseOrderDetail.poPrice * this.purchaseOrderDetail.product.qtyUom;
            poDetail.poUomQty = this.purchaseOrderDetail.product.qtyUom;
            poDetail.qty = this.purchaseOrderDetail.poQty * this.purchaseOrderDetail.product.qtyUom;
            poDetail.price = this.currentPrice   / this.purchaseOrderDetail.product.qtyUom;
            poDetail.uomId = +this.uomSelected.id; 
            // this.purchaseOrderDetail.product.bigUom.id;
        }

        // poDetail.poPrice = this.priceAdded * this.poUomQty;
        return poDetail;
    }

    save() {
        if (!this.validateInput()){
            return
        }
        let poDetail = this.composePurchaseOrderDetail();

        this.purchaseOrderDetailService
            .updateDetailByID(poDetail)
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
    
    validateInput():boolean {
        
        console.log('validate='+ this.purchaseOrderDetail.poQty+ '.');
        if (this.purchaseOrderDetail.poQty == null) {
            Swal.fire('Error','Invalid Qty', 'error');
            return false
        }    
        
        if (this.purchaseOrderDetail.poPrice == null) {
            Swal.fire('Error','Invalid Price', 'error');
            return false
        }

        return true;

    }

    onChangeSatuan($event) {
        // console.log($event.target.value)
        // harga sama
        if (this.purchaseOrderDetail.poUomId == this.uomSelected.id) {
            this.currentPrice = this.purchaseOrderDetail.poPrice
            return
        }
        
        // harga beda, cek uom big atau uom small
        if (this.uomSelected.id == this.purchaseOrderDetail.product.bigUomId) {
            this.currentPrice = this.purchaseOrderDetail.poPrice * this.purchaseOrderDetail.product.qtyUom;
        } else {
            this.currentPrice = Math.floor (this.purchaseOrderDetail.poPrice / this.purchaseOrderDetail.product.qtyUom);
        }



    }
}
