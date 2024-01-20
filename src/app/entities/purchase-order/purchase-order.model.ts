import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Lookup } from '../lookup/lookup.model';
import { Supplier } from '../supplier/supplier.model';

export class PurchaseOrder {
    constructor(
        public id?: number,
        public purchaseOrderNo?: string,
        public purchaseOrderDate ?: string,

        public supplierId?: number,
        public supplier?: Supplier,

        public note?: string,
        public tax?: number,
        public isTax?: Boolean,
        public total?: number,
        public grandTotal?: number,

        // public salesmanId?: number,
        // public salesman?: User,
        public status?: number,
        public detail?: PurchaseOrderDetail[],

        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
        this.tax = 0;
        this.total = 0;
        this.grandTotal = 0;
        this.isTax = false;
    }
}

export class PurchaseOrderPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: PurchaseOrder[],
        public error?: string,
    ) {}
}

export class PurchaseOrderDetail {
    constructor(
        public id?: number,
        public purchaseOrderId?: number,

        public productId?: number,
        public product?: Product,

        public qty?: number,
        public price?: number,
        public disc1?: number,
        public disc2?: number,
        
        public poUomId?: number,
        public poUomQty?: number,
        public poQty?: number,
        public poPrice?: number, 

        public uomId?: number,
        public uom?: Lookup,
        public errCode?: string,
        public errDesc?: string,

    ) {
        this.id = 0;
    }
}


export class PurchaseOrderDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: PurchaseOrderDetail[],
        public error?: string,
    ) {}
}