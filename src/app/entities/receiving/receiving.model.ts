import { Customer} from '../customer/customer.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Lookup } from '../lookup/lookup.model';
import { Supplier } from '../supplier/supplier.model';
import { Warehouse } from '../warehouse/warehouse.model';

export class Receive {
    constructor(
        public id?: number,
        public receiveNo?: string,
        public receiveDate?: string,

        public supplierId?: number,
        public supplier?: Supplier,

        public warehouseId?: number,
        public warehouse?: Warehouse,

        public note?: string,
        public tax?: number,
        public total?: number,
        public grandTotal?: number,
        public poNo?: string,

        public status?: number,
        public detail?: ReceivingDetail[],

        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
        this.tax = 0;
        this.total = 0;
        this.grandTotal = 0;
        this.poNo = '';
    }
}

export class ReceivingPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Receive[],
        public error?: string,
    ) {}
}

export class ReceivingDetail {
    constructor(
        public id?: number,
        public receiveId?: number,

        public productId?: number,
        public product?: Product,

        public qty?: number,
        public price?: number,
        public disc1?: number,
        public disc2?: number,
        public ed?: string,
        public batchNo?: string,

        public uomId?: number,
        public uom?: Lookup,

        public bigUom?: Lookup,
        public qtyUomBig?: number,
        
        public smallUom?: Lookup,
        public qtyUomSmall?: number,
        public qtyWh?: number,

        public errCode?: string,
        public errDesc?: string,

    ) {
        this.id = 0;
    }
}


export class ReceivingDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: ReceivingDetail[],
        public error?: string,
    ) {}
}