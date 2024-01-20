import { Lookup } from "../lookup/lookup.model"
import { Receive } from "../receiving/receiving.model"
import { Supplier } from "../supplier/supplier.model"

export class PaymentSupplier {
    constructor(
        public id?: number,
        public paymentNo?: string,
        public paymentDate?: string,
        public supplierId?: number,
        public supplier?: Supplier,

        public paymentTypeId?: number,
        public paymentType?: Lookup,

        public paymentReff?: string,
        public note?: string,
        public total?: number,
        public status?: number,

        public errCode?: string,
        public errDesc?: string,
    ) {
        this.status = 0,
        this.total = 0
    }
}

export class PaymentSupplierPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: PaymentSupplier[],
        public error?: string,
    ) {}
}



export class PaymentSupplierDetail {
    constructor(
        public id?: number,
        public paymentSupplierId?: number,
        public receiveId?: number,
        public receive?: Receive,
        public total?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.total = 0
    }
}

export class PaymentSupplierDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: PaymentSupplierDetail[],
        public error?: string,
    ) {}
}


