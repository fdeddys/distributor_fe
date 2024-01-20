import { Component, OnInit } from '@angular/core';
import { ApotikParam } from './apotik-param.model';
import { ApotikParamService } from './apotik-param.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'op-apotik-param',
  templateUrl: './apotik-param.component.html',
  styleUrls: ['./apotik-param.component.css']
})
export class ApotikParamComponent implements OnInit {

  apotikParams: ApotikParam[]
  constructor(
    private route: ActivatedRoute,
        // private modalService: NgbModal,
        private apotikParamService: ApotikParamService,
        // private location: Location,
  ) { }

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.apotikParamService.getAll().subscribe(
        (res: HttpResponse<ApotikParam[]>) => this.onSuccess(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message),
        () => { }
    );
   
  }

  private onSuccess(data, headers) {
    // if (data.contents.length < 0) {
    //     return;
    // }
    this.apotikParams = data;
}

  private onError(error) {
      Swal.fire('Error', error, 'error');
      console.log('error..');
  }

  update(param: ApotikParam) {
    this.apotikParamService
        .update(param)
        .subscribe
            (res => {
                if (res.body.errCode === '00') {
                    Swal.fire('Success', "Success", 'info');
                    this.loadAll
                } else {
                    Swal.fire('Error', res.body.errDesc, 'error');
                }
            },
            (err =>{
              Swal.fire('Error', err, 'error');
            })
        ); 
  }



}
