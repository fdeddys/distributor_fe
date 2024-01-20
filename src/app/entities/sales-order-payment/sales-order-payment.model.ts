
export class SalesOrderPayment {
    constructor(
        public id?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
    }
}

export class SalesOrderPaymentPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: SalesOrderPayment[],
        public error?: string,
    ) {}
}

export class SalesOrderPaymentDetail {
    constructor(
        public id?: number,
        public paymentId?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
    }
}

export class SalesOrderPaymentOrder {
    constructor(
        public id?: number,
        public paymentId?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
    }
}

export class SalesOrderPaymentOrderReturn {
    constructor(
        public id?: number,
        public paymentId?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
    }
}
