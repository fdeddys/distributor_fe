import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccessMatrixService } from '../../entities/access-matrix/access-matrix.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { UserMenu } from '../../entities/access-matrix/menu.model';
import * as _ from 'lodash';
import { createTree, levelAndSort } from '../../shared/treeBuilder';
declare var $: any;

@Component({
    selector: 'op-sidebar',
    styleUrls: ['./sidebar.component.css'],
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    showMenu = '';
    showSubMenu = '';
    isCollapsedWM: any;
    isCollapsedMM: any;
    isCollapsedReport: any;
    isCollapsedTask: any;
    isCollapsed: any;
    isCollapsedSecMain: any;
    public sidebarnavItems: any[];
    collapseExample: any;
    isCollapsedRiksProfiler: any;
    links: object[] = [];

    // this is for the open close
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    addActiveClass(element: any) {
        if (element === this.showSubMenu) {
            this.showSubMenu = '0';
        } else {
            this.showSubMenu = element;
        }
    }

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private accessMatrixService: AccessMatrixService,
    ) {}

    // End open close
    ngOnInit() {
        this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);

        // this.accessMatrixService.getMenuMock()
        // .subscribe(data => {
        //     // console.log('data : ', data);
        //     if (data.length < 0) {
        //         return;
        //     }
        //     this.setUserMenu(data);
        // });

        // for trial using userrole, 123
        this.accessMatrixService.queryMenu()
            .subscribe(
            (res: HttpResponse<UserMenu[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );
    }

    private onSuccess(data, headers) {
        console.log('success get user menu..', data);
        this.setUserMenu(data);
    }

    private onError(error) {
        console.log('error..');
    }

    setUserMenu(arr) {
        // console.log('setUserMenu..');
        // remark below to previous version
        levelAndSort(arr, 1);
        const arrTree = [];
        arr.forEach(element => {
            arrTree.push({
                id: element.id,
                name: element.name,
                description: element.description,
                link: element.link,
                icon: element.icon,
                parentId: element.parentId,
                level: element.level,
                collapsed: false,
            });
        });
        //
        console.log('arr after levelandsort : ', arr);
        // this.links = this.createTree(arr);
        // this.links = createTree(arr, 'id');
        this.links = createTree(arrTree, 'id');
        console.log('this.links : ', this.links);
    }

}
