import { Component, OnInit, Input } from '@angular/core';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
    selector: 'op-customer-modal',
    templateUrl: './customer-modal.component.html',
    styleUrls: ['./customer-modal.component.css']
})
export class CustomerModalComponent implements OnInit {

    @Input() statusRec;
    @Input() objEdit: Customer;
    @Input() viewMsg;

    statuses = ['Active', 'Inactive'];
    customer: Customer;
    statusSelected: string;
    customers: Customer[];
    isFormDirty: Boolean = false;

    constructor(
        public customerService: CustomerService,
        public modalService: NgbModal
    ) { }

    ngOnInit() {
        console.log('obj to edit -> ', this.objEdit);
        console.log(this.statusRec);
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
        } else {
            this.customer = this.objEdit;
            if (this.customer.status === 1) {
                this.statusSelected = this.statuses[0];
            } else {
                this.statusSelected = this.statuses[1];
            }
        }
    }

    setDefaultValue() {
        this.customer = {};
        this.statusSelected = this.statuses[0];
    }

    save(): void {
        // this.lookup.lookupGroup = this.lookupGroupSelected;
        this.customer.status = (this.statusSelected === 'Active' ? 1 : 0);
        this.customerService.save(this.customer).subscribe(result => {
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
