
export class LookupGroup {
    constructor(
        public id?: number,
        public name?: string,
    ) {}
}

export class LookupGroupDto {
    constructor(
        public errCode?: string,
        public errDesc?: string,
        public contents?: LookupGroup[],
    ) {}
}
