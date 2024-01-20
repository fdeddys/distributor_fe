import { Product } from '../product/product.model';
import { Lookup } from '../lookup/lookup.model';
import { Warehouse } from '../warehouse/warehouse.model';

export class Adjustment {
    constructor(
        public id?: number,
        public adjustmentNo?: string,
        public adjustmentDate ?: string,
        public warehouseId?: number,
        public warehouse?: Warehouse,
        public note?: string,
        public total?: number,
        public status?: number,
        public detail?: AdjustmentDetail[],
        public errCode?: string,
        public errDesc?: string,
        public totalRow?: number
    ) {
        this.id = 0;
        this.total = 0;
    }
}

export class AdjustmentPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Adjustment[],
        public error?: string,
    ) {}
}

export class AdjustmentDetail {
    constructor(
        public id?: number,
        public adjustmentId?: number,

        public productId?: number,
        public product?: Product,

        public qty?: number,
        public hpp?: number,

        public uomId?: number,
        public uom?: Lookup,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
    }
}


export class AdjustmentDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: AdjustmentDetail[],
        public error?: string,
    ) {}
}