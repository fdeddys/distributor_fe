import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { SourceListMap } from 'source-list-map';
import { User } from './user.model';
import { UserService } from './user.service';
import { Role } from '../role/role.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Subject, Observable, merge } from 'rxjs';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { flatMap } from 'lodash';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};
@Component({
  selector: 'op-user-modal-component',
  styles: [],
  templateUrl: './user.modal.component.html' ,
})

export class UserModalComponent implements OnInit {
  @Input() statusRec;
  @Input() objEdit: User;
  @Input() roleList: Role[];
  // @Input() listTypeIds: string[];

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  model: any;
  newResetRassword: string;

  isFormDirty: Boolean = false;
  user: User;
  // statusRec: String = 'addnew';
  tglLahir: NgbDateStruct;

  submitted = false;

  constructor(public activeModal: NgbActiveModal,
              public userService: UserService,
              private http: HttpClient,
              private calendar: NgbCalendar) {}

  ngOnInit(): void {
    this.tglLahir = this.calendar.getToday();
    console.log('name', this.objEdit);
    if ( this.statusRec === 'addnew' ) {
      this.user = {};
      this.user.id = 0;
      this.user.roleId = _.clone(this.roleList[0].id);
      // this.model = this.listTypeIds[0];
    } else {
      this.user = this.objEdit;
      this.user.roleId = this.objEdit.role.id;
      }
  }

  validate(): void {
    console.log('validate..');
    this.submitted = true;

    let iter = 0;
    if (this.user.userName === '' || this.user.userName === null || this.user.userName === undefined) {
      iter++;
    }
    if (this.user.roleId === null || this.user.roleId === undefined) {
      iter++;
    }

    console.log(iter);
    if (iter > 0) {
      return;
    }

    this.save();
  }

  save(): void {
    console.log('masuk saving');
    console.log('masokk');

    // this.userService.save(this.user).subscribe(result => {
    //   this.isFormDirty = true;
    //   console.log('Result==>' + result);
    //   if (result.body.errCode === '00') {
    //     console.log('Toast success');
    //     this.user.id = result.body.id;
    //   } else {
    //     console.log('Toast err');
    //   }
    // });

    this.user.roleId = +this.user.roleId;
    this.user.role = null;
    this.userService.save(this.user).subscribe(result => {
      this.isFormDirty = true;
      console.log('Result==>' + result);
      if (result.body.errCode === '00') {
        if (this.statusRec === 'addnew') {
            Swal.fire('Success', 'User created with password ' + result.body.contents.email, 'success');
            // this.user.curPass = result.body.curPass;
        } else {
            Swal.fire('Success', 'User updated !', 'success');
        }
        console.log('Toast success');
        this.user.id = result.body.id;
        this.statusRec = 'edit';
        this.closeForm();
        // this.user.curPass = result.body.curPass;

      } else {
        console.log('Toast err');
      }
    });

    console.log('keluar');

  }

  closeForm(): void {
    if (this.isFormDirty === true) {
      this.activeModal.close('refresh');
    } else {
      this.activeModal.close('close');
    }
  }

  resetP(): void {

    this.userService.resetP(this.user.id).subscribe(result => {
      console.log('result reset pass==>',result);
      if (result.errCode == '00') {
        console.log('Toast success');
        this.newResetRassword = result.contents;
        // this.user.curPass = result.body.curPass;

      } else {
        console.log('Toast err');
      }
    });
  }


}
