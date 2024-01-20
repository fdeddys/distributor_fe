
export class SystemParameter {
    constructor(
        public id?: number,
        public name?: string,
        public dataType?: number,
        public description?: string,
        public forSecurity?: number,
        public isTextArea?: number,
        public value?: string,
        public status?: boolean,
        public approvalStatusDescription?: string,
        public latestSuggestion?: string,
        public latestSuggestor?: string,
        public latestApproval?: string,
        public latestApprover?: string,
        public errCode?: string,
        public errDesc?: string,
    ) { }
}
