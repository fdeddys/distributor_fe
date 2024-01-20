
export class DirectSalesPayment {
    constructor(
        public paymentStatus?: number,
        public paymentNo?: string,
        public salesOrderNo?: string,
        public orderDate?: string,
        public soStatus?: number,
        public salesOrderGrandTotal?: number,
        public paymentId?: number,
        public salesOrderId?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.paymentStatus = 1,
        this.soStatus = 0,
        this.salesOrderGrandTotal = 0
    }
}

export class DirectSalesPaymentPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: DirectSalesPayment[],
        public error?: string,
    ) {}
}