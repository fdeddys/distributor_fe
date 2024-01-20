

export class SalesmanDto {
    constructor(
        public errCode?: string,
        public errDesc?: string,
        public contents?: Salesman[],
    ) {}
}


export class Salesman {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public description?: string,
        public status ?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}

export class SalesmanPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Salesman[],
        public error?: string,
    ) {}
}