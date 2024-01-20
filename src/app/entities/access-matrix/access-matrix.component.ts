import { Component, OnInit, Injectable } from '@angular/core';
import { TreeviewConfig, TreeviewItem, TreeviewEventParser, DownlineTreeviewItem,
OrderDownlineTreeviewEventParser } from 'ngx-treeview';
import { RoleService } from '../role/role.service';
import { AccessMatrixService } from './access-matrix.service';
import { Role, RoleMenuView } from '../role/role.model';
import { UserMenu } from './menu.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { createTree, levelAndSort } from '../../shared/treeBuilder';

@Injectable()
export class ProductTreeviewConfig extends TreeviewConfig {
    hasAllCheckBox = true;
    hasFilter = true;
    hasCollapseExpand = false;
    maxHeight = 400;
}

@Component({
    selector: 'op-access-matrix',
    templateUrl: './access-matrix.component.html',
    styleUrls: ['./access-matrix.component.css'],
    providers: [
        { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
        { provide: TreeviewConfig, useClass: ProductTreeviewConfig }
    ]
})
export class AccessMatrixComponent implements OnInit {
    items: TreeviewItem[];
    // config = TreeviewConfig.create({
    //     hasFilter: false,
    //     hasCollapseExpand: false,
    //     hasAllCheckBox: false,
    //     decoupleChildFromParent: false,
    //     maxHeight: 500
    // });
    filter = {
        roleId: null
    };
    roleList: Role[];
    // links: object[] = [];
    links: any[] = [];
    menuArr = [];

    constructor(
        private roleService: RoleService,
        private accessMatrixService: AccessMatrixService,
    ) { }

    ngOnInit() {
        console.log('ngOnInit');
        this.items = [];

        this.roleService.filter({
            filter: {name: ''},
            page: 1,
            count: 10000,
        })
        .subscribe(
            (res: HttpResponse<Role[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

        // this.accessMatrixService.getMenuMock()
        // .subscribe(data => {
        //     // console.log('data : ', data);
        //     if ( data.length < 0 ) {
        //         return ;
        //     }
        //     this.setUserMenu(data);
        // });

        this.accessMatrixService.query({})
        .subscribe(
            (res: HttpResponse<UserMenu[]>) => this.onSuccessListMenu(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    setUserMenu(arr) {
        // console.log('setUserMenu..');
        // remark below to previous version
        levelAndSort(arr, 1);
        const arrTree = [];
        arr.forEach(element => {
            arrTree.push({
                value: element.id,
                text: element.name,
                parentId: element.parentId,
                // checked: false,
            });
        });
        //
        console.log('arr after levelandsort : ', arr);
        // this.links = this.createTree(arr);
        this.links = createTree(arrTree, 'value');
        console.log(this.links);

        this.links.forEach(element => {
            this.items.push(new TreeviewItem({
                text: element.text,
                value: element.value,
                children: element.children,
                // checked: element.checked
            }));
        });
        this.setFalseChecked(this.items);

        this.searchByRole();
    }

    onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
        this.menuArr = [];
        console.log('downlineItems : ', downlineItems);
        downlineItems.forEach(downlineItem => {
            let arrTemp = [];
            this.recMenuArr(downlineItem, arrTemp);
            arrTemp = _.reverse(arrTemp);
            this.menuArr.push(arrTemp);
        });
        this.menuArr = _.flattenDeep(this.menuArr);
        console.log(this.menuArr);
    }

    onFilterChange(evt) {
        console.log('filter : ', evt);
    }

    searchByRole() {
        console.log('searchByRole..');
        if (this.filter.roleId !== null) {
            console.log('role id !== null');
            // this.accessMatrixService.findByRoleMock()
            //     .subscribe(data => {
            //         // console.log('data : ', data);
            //         if (data.length < 0) {
            //             return;
            //         }
            //         const header = null;
            //         this.onSuccessByRole(data, header);
            //     });

            this.accessMatrixService.findByRole(this.filter.roleId)
                .subscribe(
                    (res: HttpResponse<RoleMenuView[]>) => {
                        this.onSuccessByRole(res.body, res.headers);
                        // this.menuRegistered = res.body.content;
                    },
                    (res: HttpErrorResponse) => this.onError(res.message),
                    () => { console.log('finally'); }
                );
        }
    }

    saveMenuAccess() {
        // get all selected nodes
        console.log(this.menuArr);

        if (this.menuArr.length === 0) {
            return;
        }
        this.accessMatrixService.save({
            roleId: this.filter.roleId,
            menuIds: this.menuArr
        })
        .subscribe((result: HttpResponse<any>) => {
            console.log('save success..');

            if (result.body.errCode === '00') {
                console.log('Toast success');
                Swal.fire('Success', 'Success save to Data Approval', 'success');
            } else {
                Swal.fire('Failed', result.body.errDesc, 'error');
                // console.log('Toast err', result.body.errDesc);
            }
        },
        (result: HttpErrorResponse) => {
            Swal.fire('Failed', result.error.message, 'error');
            console.log('error msh ', result.error.message);
        });
    }

    setFalseChecked(items) {
        if (!items || items.length === 0) { return; }

        for (const item of items) {
            item.checked = false;

            // Test children recursively
            if (item.children && item.children.length > 0) {
                this.setFalseChecked(item.children);
            }
        }
    }

    findChecked(items, arr) {
        if (!items || items.length === 0) { return; }

        for (const item of items) {
            // Test current object
            if (_.indexOf(arr, item.value) > -1) {
                item.checked = true;
            }

            // Test children recursively
            if (item.children && item.children.length > 0) {
                this.findChecked(item.children, arr);
            }
        }
    }

    recMenuArr(downlineItem: DownlineTreeviewItem, arr) {
        if (_.indexOf(_.flattenDeep(this.menuArr), downlineItem.item.value) < 0) {
            arr.push(downlineItem.item.value);
        }
        if (_.isNil(downlineItem.parent)) {
            return;
        } else {
            this.recMenuArr(downlineItem.parent, arr);
        }
    }

    private onSuccessListMenu(data, headers) {
        console.log('onSuccessListMenu : ', data);
        if (data.length <= 0) {
            return;
        }
        this.setUserMenu(data);
    }

    private onSuccessByRole(data, headers) {
        console.log('onSuccessByRole...');
        console.log(data);

        if (data.length <= 0) {
            return;
        }
        const temp = [];
        data.forEach(element => {
            temp.push(element.menuId);
        });
        this.setFalseChecked(this.items);
        this.findChecked(this.items, temp);
    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.roleList = data.contents;
        this.filter.roleId = _.clone(this.roleList[0].id);
    }

    private onError(error) {
        console.log('error..');
    }
}
