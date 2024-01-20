import { Component, OnInit } from '@angular/core';
import { Role } from './role.model';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from './role.service';
import { RoleModalComponent } from './role.modal.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RoleMenuService } from './role-menu.service';

@Component({
  selector: 'op-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  listTypeIds: string[];
  roleList: Role[];
  role: Role;
  curPage = 1;
  totalData = 0;
  totalRecord = TOTAL_RECORD_PER_PAGE;
  searchTerm = {
    name: '',
  };

  closeResult: string;
  constructor(private modalService: NgbModal,
              private roleService: RoleService,
              ) { }

  ngOnInit() {
    this.loadAll(this.curPage);
  }

  onFilter() {
    this.loadAll(this.curPage);
  }

  open(status, pesan) {
    // const modalRef = this.modalService.open(TerorisModalComponent, { size: 'lg' });
    // modalRef.componentInstance.name = 'World';
    // console.log('pesannn->', pesan);
    // return;
    const modalRef = this.modalService.open(RoleModalComponent, { size: 'lg' });
    modalRef.componentInstance.statusRec = status;
    modalRef.componentInstance.objEdit = pesan;
    modalRef.componentInstance.listTypeIds = this.listTypeIds;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
      // if (this.closeResult === 'refresh') {
      //   this.curPage = 1 ;
      //   this.loadAll(this.curPage);
      // }
      this.curPage = 1 ;
        this.loadAll(this.curPage);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
      this.curPage = 1 ;
        this.loadAll(this.curPage);
    });

  }

  loadAll(page) {
    console.log('Start call function all header');
    this.roleService.filter({
        filter: this.searchTerm,
        page: page,
        count: this.totalRecord,
    })
    .subscribe(
            (res: HttpResponse<Role[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
    );
}

private onSuccess(data, headers) {
  if ( data.contents.length < 0 ) {
      return ;
  }
  this.roleList = data.contents;
  this.totalData = data.totalRow;
  // Swal.fire('Success', 'Data save', 'info');
}

private onError(error) {
  // Swal.fire('Error', error, 'error');
  console.log('error..');
}

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  loadPage() {
    this.loadAll(this.curPage);
    console.log(this.curPage);
  }

}
