import { Role } from '../role/role.model';

export class User {
    constructor(
        public id?: number,
        public userName?: string,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public role?: Role,
        public roleId?: number,
        public errCode?: string,
        public errDesc?: string,
        public curPass?: string,
        public contents?: any,
    ) {}
}

export class Version {
    constructor (
        public date?: string,
        public version?: string,
    ) {}
}
