export class Customer {
    constructor(
        public id?: number,
        public code?: string,
        public status ?: number,
        public name?: string,
        public top ?: number,
        public address1 ?: string,
        public address2 ?: string,
        public address3 ?: string,
        public address4 ?: string,
        public contactPerson?: string,
        public phoneNumber?: string,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0,
        this.status = 10
    }
}

export class CustomerPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Customer[],
        public error?: string,
    ) {}
}
