import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModalComponent } from './user.modal.component';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from './user.model';
import { Role } from '../role/role.model';
import { RoleService } from '../role/role.service';

@Component({
  selector: 'op-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  searchTerm = {
    name: '',
  };
  curPage = 1;
  totalData = 0;
  totalRecord = TOTAL_RECORD_PER_PAGE;
  userlist: User[];
  user: User;

  roleList: Role[];

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private roleService: RoleService) { }

  ngOnInit() {
    this.loadAll(this.curPage);
  }

  loadAll(page) {
    console.log('Start call function all header');
    this.userService.filter({
        filter: this.searchTerm,
        page: page,
        count: this.totalRecord,
    })
    .subscribe(
            (res: HttpResponse<User[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
    );

    this.roleService.filter({
      filter: { name: '' },
      page: 1,
      count: 10000,
    })
    .subscribe(
      (res: HttpResponse<Role[]>) => this.onSuccessRole(res.body, res.headers),
      (res: HttpErrorResponse) => this.onError(res.message),
      () => { console.log('finally'); }
    );
}

onFilter() {
  this.loadAll(this.curPage);
}

private onSuccess(data, headers) {
  if ( data.contents.length < 0 ) {
      return ;
  }
  this.userlist = data.contents;
  this.totalData = data.totalRow;
}

private onSuccessRole(data, headers) {
  if (data.contents.length < 0) {
    return;
  }
  this.roleList = data.contents;
}

private onError(error) {
  console.log('error..');
}

  open(status, pesan) {
    // const modalRef = this.modalService.open(TerorisModalComponent, { size: 'lg' });
    // modalRef.componentInstance.name = 'World';
    // console.log('pesannn->', pesan);
    // return;
    const modalRef = this.modalService.open(UserModalComponent, { size: 'lg' });
    modalRef.componentInstance.statusRec = status;
    modalRef.componentInstance.objEdit = pesan;
    modalRef.componentInstance.roleList = this.roleList;
    // modalRef.componentInstance.listTypeIds = this.listTypeIds;
    modalRef.result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
      // console.log(this.closeResult);
      // if (this.closeResult === 'refresh') {
      //   this.curPage = 1 ;
      //   this.loadAll(this.curPage);
      // }
      this.curPage = 1 ;
        this.loadAll(this.curPage);
    }, (reason) => {

      this.curPage = 1 ;
        this.loadAll(this.curPage);
    });

  }

  loadPage() {
    this.loadAll(this.curPage);
    console.log(this.curPage);
  }


}
