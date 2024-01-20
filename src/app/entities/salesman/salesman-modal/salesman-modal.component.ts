import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Salesman } from '../salesman.model';
import { SalesmanService } from '../salesman.service';

@Component({
  selector: 'op-salesman-modal',
  templateUrl: './salesman-modal.component.html',
  styleUrls: ['./salesman-modal.component.css']
})
export class SalesmanModalComponent implements OnInit {

    @Input() statusRec: string;
    @Input() objEdit: Salesman;
    @Input() viewMsg: string;

    statuses = ['Active', 'Inactive'];
    salesman: Salesman;
    statusSelected: string;
    salesmans: Salesman[];
    isFormDirty: Boolean = false;

    constructor(
        public salesmanService: SalesmanService,
        public modalService: NgbModal) { }

    ngOnInit() {
        console.log('obj to edit -> ', this.objEdit);
        console.log(this.statusRec);
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
        } else {
            this.salesman = this.objEdit;
            if (this.salesman.status === 1) {
                this.statusSelected = this.statuses[0];
            } else {
                this.statusSelected = this.statuses[1];
            }
        }
    }

    setDefaultValue() {
        this.salesman = {};
        this.statusSelected = this.statuses[0];
    }

    save(): void {
        this.salesman.status = (this.statusSelected === 'Active' ? 1 : 0);
        this.salesmanService.save(this.salesman).subscribe(result => {
            this.isFormDirty = true;
            if (result.body.errCode === '00') {
                console.log('success');
                Swal.fire('Success', 'Save success ', 'info');
                this.modalService.dismissAll('refresh');
            } else {
                console.log('Toast err');
            }
        });
    }

    closeForm(): void {
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');
        } else {
            this.modalService.dismissAll('close');
        }
    }

}
