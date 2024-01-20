import { Customer } from "../customer/customer.model"
import { Lookup } from "../lookup/lookup.model"
import { SalesOrderReturn } from "../sales-order-return/sales-order-return.model"
import { SalesOrder } from "../sales-order/sales-order.model"

export class Payment {
    constructor(
        public id?: number,
        public paymentNo?: string,
        public paymentDate?: string,
        public customerId?: number,
        public Customer?: Customer,
        public note?: string,
        public totalOrder?: number,
        public totalReturn?: number,
        public totalPayment?: number,
        public status?: number,
        public isCash?: boolean,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0,
        this.totalOrder = 0,
        this.totalPayment = 0,
        this.totalReturn = 0,
        this.status =1
    }
}

export class PaymentPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Payment[],
        public error?: string,
    ) {}
}
   
export class PaymentDetail {
    constructor(
        public id?: number,
        public paymentId?: number,
        public paymentTypeId?: number,
        public paymentType?: Lookup,
        public paymentReff?: string,
        public total?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0,
        this.total = 0
    }
}

export class PaymentDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: PaymentDetail[],
        public error?: string,
    ) {}
}

export class PaymentOrder {
    constructor(
        public id?: number,
        public paymentId?: number,
        public salesOrderId?: number,
        public salesOrder?: SalesOrder,
        public total?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0,
        this.total = 0
    }
}

export class PaymentOrderPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: PaymentOrder[],
        public error?: string,
    ) {}
}


export class PaymentReturn {
    constructor(
        public id?: number,
        public paymentId?: number,
        public salesOrderReturnId?: number,
        public salesOrderReturn?: SalesOrderReturn,
        public total?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0,
        this.total = 0
    }
}

export class PaymentReturnPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: PaymentReturn[],
        public error?: string,
    ) {}
}

