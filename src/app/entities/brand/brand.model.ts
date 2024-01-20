export class Brand {
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

export class BrandPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Brand[],
        public error?: string,
    ) {}
}
