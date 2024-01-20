import { Warehouse } from "../warehouse/warehouse.model"

export class Stock {
    constructor(
        public id?: number,
        public productId?: number,
        public warehouse ?: Warehouse,
        public qty?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}

export class StockPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Stock[],
        public error?: string,
    ) {}
}
