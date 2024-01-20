import { Component, OnInit } from '@angular/core';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { SystemParameterService } from './system-parameter.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { SystemParameter } from './system-parameter.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemParameterModalComponent } from './system-parameter.modal.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'op-system-parameter',
  templateUrl: './system-parameter.component.html',
  styleUrls: ['./system-parameter.component.css']
})
export class SystemParameterComponent implements OnInit {

    systemParameterList: SystemParameter[];
    curPage = 1;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    totalData = 0;

    // init variable search
    searchTerm = {
        name: '',
        value: '',
        description: ''
    };

    closeResult: string;

    constructor(private systemParameterService: SystemParameterService,
                private modalService: NgbModal,
                private ngxService: NgxUiLoaderService) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    // load data with filter paging
    loadAll(page) {
        // start loader
        this.ngxService.start();

        this.systemParameterService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord
        })
            .subscribe(
                (res: HttpResponse<SystemParameter[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    // on success from loadAll
    private onSuccess(data, headers) {
        // stop loader
        this.ngxService.stop();

        if (data.content.length < 0) {
            return;
        }
        console.log(data);
        this.systemParameterList = data.content;
        this.totalData = data.totalElements;
    }

    // on error from loadAll
    private onError(error) {
        this.ngxService.stop(); // stop loader

        console.log('error..', error);
    }

    // pagination
    loadPage() {
        this.loadAll(this.curPage);
    }

    // search by filter
    onFilter() {
        this.loadAll(this.curPage);
    }

    // reset filter
    resetFilter() {
        this.searchTerm = {
            name: '',
            description: '',
            value: ''
        };
        this.loadAll(1);
    }

    // open modal (edit / add new)
    open(status, message) {
        const modalRef = this.modalService.open(SystemParameterModalComponent, { size: 'lg' });
        modalRef.componentInstance.statusRec = status;
        modalRef.componentInstance.objEdit = message;
        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            this.curPage = 1;
            this.loadAll(this.curPage);
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.curPage = 1;
            this.loadAll(this.curPage);
        });
    }

    private getDismissReason(reason: any): string {
        console.log(reason);
        return reason;
    }
}
