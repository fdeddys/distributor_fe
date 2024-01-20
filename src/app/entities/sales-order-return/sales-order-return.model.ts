import { Customer } from "../customer/customer.model";
import { Lookup } from "../lookup/lookup.model";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";
import { Warehouse } from "../warehouse/warehouse.model";

export class SalesOrderReturn {
    constructor(
        public id?: number,
        public returnNo?: string,
        public returnDate ?: string,

        public customerId?: number,
        public customer?: Customer,

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

        public salesmanId?: number,
        public salesman?: User,

        public detail?: SalesOrderReturnDetail[],

        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
        this.tax = 0;
        this.total = 0;
        this.grandTotal = 0;
    }
}

export class SalesOrderReturnPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: SalesOrderReturn[],
        public error?: string,
    ) {}
}

export class SalesOrderReturnDetail {
    constructor(
        public id?: number,
        public returnSalesOrderId?: number,

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


export class SalesOrderReturnDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: SalesOrderReturnDetail[],
        public error?: string,
    ) {}
}