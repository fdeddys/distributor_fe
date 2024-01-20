import { Component, OnInit, Input } from '@angular/core';
import { Brand } from '../brand.model';
import { BrandService } from '../brand.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
    selector: 'op-brand-modal',
    templateUrl: './brand-modal.component.html',
    styleUrls: ['./brand-modal.component.css']
})
export class BrandModalComponent implements OnInit {

    @Input() statusRec;
    @Input() objEdit: Brand;
    @Input() viewMsg;

    statuses = ['Active', 'Inactive'];
    brand: Brand;
    statusSelected: string;
    brands: Brand[];
    isFormDirty: Boolean = false;

    constructor(
        public brandService: BrandService,
        public modalService: NgbModal) { }

    ngOnInit() {
        console.log('obj to edit -> ', this.objEdit);
        console.log(this.statusRec);
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
        } else {
            this.brand = this.objEdit;
            if (this.brand.status === 1) {
                this.statusSelected = this.statuses[0];
            } else {
                this.statusSelected = this.statuses[1];
            }
        }
    }

    setDefaultValue() {
        this.brand = {};
        this.statusSelected = this.statuses[0];
    }

    save(): void {
        // this.lookup.lookupGroup = this.lookupGroupSelected;
        this.brand.status = (this.statusSelected === 'Active' ? 1 : 0);
        this.brandService.save(this.brand).subscribe(result => {
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
