import { Lookup } from '../lookup/lookup.model';
import { Brand } from '../brand/brand.model';
import { ProductGroup } from '../product-group/product-group.model';


export class Product {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public plu?: string,

        public productGroupId?: number,
        public ProductGroup?: ProductGroup,

        public brandId?: number,
        public Brand?: Brand,

        public smallUomId?: number,
        public smallUom?: Lookup,

        public bigUomId?: number,
        public BigUom?: Lookup,
        public bigUom?: Lookup,

        public status?: number,
        public qtyStock?: number,
        public qtyUom?: number,
        public hpp?: number,
        public sellPrice?: number,
        public sellPriceType?: number,
        public errCode?: string,
        public errDesc?: string,

        public qty?: number,
        public composition?: string,
    ) {
        this.name= '';
        this.qtyUom = 1;
        this.sellPriceType=1;
        this.status =1 ;
        this.sellPrice = 0;
    }
}

export class ProductPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Product[],
        public error?: string,
    ) {}
}

export class ProductDto {
    constructor(
        public errCode?: string,
        public errDesc?: string,
        public contents?: Product[],
    ) {}
}
