import { LookupGroup } from "../lookup-group/lookup-group.model";

export class Lookup {
    constructor(
        public id?: number,
        public code?: string,
        public lookupGroupId?: number,
        public lookupGroup?: LookupGroup,
        public status ?: number,
        public name?: string,
        public isViewable?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.isViewable = 0;
    }
}

export class LookupPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Lookup[],
        public error?: string,
        public errCode?: string,
        public errDesc?: string,
    ) {}
}


export class LookupDto {
    constructor(
        public id?: string,
        public lookupGroupString?: string,
        public name?: string,
        public code?: string,
    ) {}
}

export class LookupTemplate {
    constructor (
        public id?: number,
        public code?: string,
        public name?: string,
        public qty?: number,
    ) {}
}