import { Warehouse } from "../warehouse/warehouse.model";

export class HistoryStock {
    constructor(
        public id?: number,
        public warehouseId?: number,
        public warehouse ?: Warehouse,
        public code?: string,
        public name?: string,
        public debet?: number,
        public kredit?: number,
        public saldo?: number,
        public transDate?: string,
        public description?: string,
        public reffNo?: string,
        public price?: number,
        public hpp?: number,
        public disc1?: number,
        public total?: number,      
        public errCode?: string,
        public errDesc?: string,
        public satuan?: string,
    ) {
    }
}

export class HistoryStockPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: HistoryStock[],
        public error?: string,
    ) {}
}
