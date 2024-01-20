import { Lookup } from "../lookup/lookup.model";
import { Product } from "../product/product.model";
import { Warehouse } from "../warehouse/warehouse.model"

export class StockMutation {
    constructor(
        public id?: number,
        public stockMutationNo?: string,
        public mutationDate ?: string,
        public warehouseSourceId?: number,
        public warehouseSource?: Warehouse[],
        public warehouseDestId?: number,
        public warehouseDest?: Warehouse[],
        public note?: string,
        public total?: number,
        public requestor?: string,
        public approver?: string,
        public status?: number,
        public detail?: StockMutationDetail[],

        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
        this.total = 0;
    }
}

export class StockMutationPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: StockMutation[],
        public error?: string,
    ) {}
}

export class StockMutationDetail {
    constructor(
        public id?: number,
        public mutationId?: number,
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

export class StockMutationDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: StockMutationDetail[],
        public error?: string,
    ) {}
}