

export class WarehouseDto {
    constructor(
        public errCode?: string,
        public errDesc?: string,
        public contents?: Warehouse[],
    ) {} 
}

export class Warehouse {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public whIn?: number,
        public whOut ?: number,
        public status ?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}

export class WarehousePageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Warehouse[],
        public error?: string,
    ) {}
}