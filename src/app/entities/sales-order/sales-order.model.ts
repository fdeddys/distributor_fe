import { Customer} from '../customer/customer.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Lookup } from '../lookup/lookup.model';
import { Warehouse } from '../warehouse/warehouse.model';

export class SalesOrder {
    constructor(
        public id?: number,
        public salesOrderNo?: string,
        public orderDate ?: string,

        public deliveryDate?: string,
        public customerId?: number,
        public customer?: Customer,

        public warehouseId?: number,
        public warehouse?: Warehouse,

        public note?: string,
        public tax?: number,
        public total?: number,
        public grandTotal?: number,

        public salesmanId?: number,
        public salesman?: User,

        // public user?: User,

        public status?: number,
        public top?: number,
        public isCash?: boolean,
        public detail?: SalesOrderDetail[],

        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
        this.top = 0;
        this.tax = 0;
        this.total = 0;
        this.grandTotal = 0;
    }
}

export class SalesOrderPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: SalesOrder[],
        public error?: string,
    ) {}
}

export class SalesOrderDetail {
    constructor(
        public id?: number,
        public salesOrderId?: number,

        public productId?: number,
        public product?: Product,

        public qtyOrder?: number,
        public qtyPicking?: number,
        public qtyReceive?: number,
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


export class SalesOrderDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: SalesOrderDetail[],
        public error?: string,
    ) {}
}