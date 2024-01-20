export class ProductGroup {
    constructor(
        public id?: number,
        public code?: string,
        public status ?: number,
        public name?: string,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}

export class ProductGroupPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: ProductGroup[],
        public error?: string,
    ) {}
}
