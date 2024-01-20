export class Role {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public type?: number,
        public isSuper?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {}
}

export class RoleMenuView {
    constructor(
        public menuId?: number,
        public roleId?: number,
        public status?: number,
        public menuDescription?: string,
        public parentId?: number,
        public nourut?: number,
        public errCode?: string,
        public errDesc?: string,
        public data?: any,
    ) {
    }
}
