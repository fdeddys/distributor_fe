import { Product } from '../product/product.model';
import { Lookup } from '../lookup/lookup.model';

export class StockOpname {
    constructor(
        public id?: number,
        public stockOpnameNo?: string,
        public stockOpnameDate ?: string,
        public note?: string,
        public total?: number,
        public status?: number,
        public warehouseId?: number,
        public detail?: StockOpnameDetail[],
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
        this.total = 0;
    }
}

export class StockOpnamePageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: StockOpname[],
        public error?: string,
    ) {}
}

export class StockOpnameDetail {
    constructor(
        public id?: number,
        public stockOpnameId?: number,

        public productId?: number,
        public product?: Product,

        public qty?: number,
        public qtyOnSystem?: number,
        public hpp?: number,

        public uomId?: number,
        public uom?: Lookup,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
    }
}


export class StockOpnameDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: StockOpnameDetail[],
        public error?: string,
    ) {}
}