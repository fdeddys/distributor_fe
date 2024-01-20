import { Lookup } from "../lookup/lookup.model";
import { Product } from "../product/product.model";
import { Supplier } from "../supplier/supplier.model";
import { Warehouse } from "../warehouse/warehouse.model";

export class ReturnReceive {
    constructor(
        public id?: number,
        public returnNo?: string,
        public returnDate ?: string,

        public supplierId?: number,
        public supplier?: Supplier,

        public reasonId?: number,
        public reason?: Lookup,

        public warehouseId?: number,
        public warehouse?: Warehouse,

        public invoiceNo?: string,
        public note?: string,
        public tax?: number,
        public total?: number,
        public grandTotal?: number,
        public status?: number,

        public detail?: ReturnReceiveDetail[],

        public errCode?: string,
        public errDesc?: string,
        public totalRow?: number,
    ) {
        this.id = 0;
        this.tax = 0;
        this.total = 0;
        this.grandTotal = 0;
    }
}

export class ReturnReceivePageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: ReturnReceive[],
        public error?: string,
    ) {}
}

export class ReturnReceiveDetail {
    constructor(
        public id?: number,
        public returnReceiveId?: number,

        public productId?: number,
        public product?: Product,

        public qty?: number,
        public price?: number,
        public disc1?: number,
        public disc2?: number,

        public uomId?: number,
        public uom?: Lookup,
        public errCode?: string,
        public errDesc?: string,

    ) {
        this.id = 0;
    }
}


export class ReturnReceiveDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: ReturnReceiveDetail[],
        public error?: string,
    ) {}
}


export class LastPriceDto {
    constructor(
        public price?: number,

    ) {
        this.price = 0;
    }
}