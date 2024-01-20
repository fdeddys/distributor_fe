export class AppParameter {
    constructor(
        public id?: number,
        public description?: string,
        public status?: number,
        public approvalStatusDescription?: string,
        public latestSuggestion?: string,
        public latestSuggestor?: string,
        public latestApproval?: string,
        public latestApprover?: string,
        public name?: string,
        public value?: string,
        public errCode?: string,
        public errDesc?: string,
    ) {}
}
