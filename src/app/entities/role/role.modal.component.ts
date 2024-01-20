import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Subject, Observable, merge } from 'rxjs';
import { Role, RoleMenuView } from './role.model';
import { RoleService } from './role.service';
import Swal from 'sweetalert2';
import { RoleMenuService } from './role-menu.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};
@Component({
    selector: 'op-role-modal-component',
    styles: ['./role.modal.component.css'],
    templateUrl: './role.modal.component.html',
})

export class RoleModalComponent implements OnInit {
    @Input() statusRec;
    @Input() objEdit: Role;
    @Input() listTypeIds: string[];

    @ViewChild('instance') instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();
    model: any;
    isSuper: Boolean = false;
    isType: Boolean = false;
    roleMenus: RoleMenuView[];

    isFormDirty: Boolean = false;
    role: Role;
    // statusRec: String = 'addnew';
    tglLahir: NgbDateStruct;

    constructor(public activeModal: NgbActiveModal,
        public roleService: RoleService,
        private roleMenuService: RoleMenuService,
        private calendar: NgbCalendar) { }

    ngOnInit(): void {
        this.tglLahir = this.calendar.getToday();
        console.log('name', this.objEdit);
        if (this.statusRec === 'addnew') {
            this.role = {};
            this.role.id = 0;
        } else {
            this.role = this.objEdit;
            if (this.role.isSuper === 1) {
                this.isSuper = true;
            } else {
                this.isSuper = false;
            }
            if (this.role.type === 1) {
                this.isType = true;
            } else {
                this.isType = false;
            }
            this.loadRoleMenu(this.role.id);
        }
        console.log('send dari depan---->', this.listTypeIds, '[status rec]', this.statusRec);
    }

    loadRoleMenu(roleID) {
        this.roleMenuService
            .findByRoleID(roleID)
            .subscribe(
                (res: HttpResponse<RoleMenuView[]>) => this.onSuccessRole(res.body),
                (err: HttpErrorResponse) => console.log(err),
            );
    }
        
    private onSuccessRole(data) {
        this.roleMenus = data;
    }

    save(): void {
        console.log('masuk saving');

        if (this.isSuper === true) {
            this.role.isSuper = 1;
        } else {
            this.role.isSuper = 0;
        }

        if (this.isType === true) {
            this.role.type = 1;
        } else {
            this.role.type = 0;
        }
        console.log('masokk');
        this.roleService.save(this.role).subscribe(result => {
            this.isFormDirty = true;
            console.log('Result==>' + result);
            // if (this.role.isSuper === 'true' ) {
            //   this.role.isSuper = 1;
            // }
            if (result.body.errCode === '00') {
                console.log('Toast success');
                this.role.id = result.body.id;
                this.statusRec = 'edit';
                Swal.fire('Success', 'User updated !', 'success');
                this.closeForm();

            } else {
                console.log('Toast err');
            }
        });

        console.log('keluar');
        // this.activeModal.close('tutup save');
    }

    closeForm(): void {
        if (this.isFormDirty === true) {
            this.activeModal.close('refresh');
        } else {
            this.activeModal.close('close');
        }
    }

    UpdateRoleMenu(roleMenu: RoleMenuView){

        let roleMenuUpdate = new RoleMenuView()
        roleMenuUpdate.menuId = roleMenu.menuId;
        roleMenuUpdate.roleId = this.role.id;
        roleMenuUpdate.status = roleMenu.status === 1 ? 0 : 1 ;

        this.roleMenuService
            .update(roleMenuUpdate)
            .subscribe(
                (response) => {
                    if (response.body.errCode === "00") {
                        Swal.fire('Success', 'Data updated !','success');
                        return roleMenu.status = roleMenu.status === 0 ? 1: 0;
                    }
                },
                (err) => {},
                ()=> {}
            )

         
    }


}
