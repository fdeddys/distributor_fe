import { Component, OnInit, Input } from '@angular/core';
import { ProductGroup } from '../product-group.model';
import { ProductGroupService } from '../product-group.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
    selector: 'op-product-group-modal',
    templateUrl: './product-group-modal.component.html',
    styleUrls: ['./product-group-modal.component.css']
})
export class ProductGroupModalComponent implements OnInit {

    @Input() statusRec;
    @Input() objEdit: ProductGroup;
    @Input() viewMsg;

    statuses = ['Active', 'Inactive'];
    productGroup: ProductGroup;
    statusSelected: string;
    productGroups: ProductGroup[];
    isFormDirty: Boolean = false;

    constructor(public productGroupService: ProductGroupService,
        public modalService: NgbModal) { }

    ngOnInit() {
        console.log('obj to edit -> ', this.objEdit);
        console.log(this.statusRec);
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
        } else {
            this.productGroup = this.objEdit;
            if (this.productGroup.status === 1) {
                this.statusSelected = this.statuses[0];
            } else {
                this.statusSelected = this.statuses[1];
            }
            // this.setSelectedLookup(this.objEdit);
        }
    }

    setDefaultValue() {
        this.productGroup = {};
        this.statusSelected = this.statuses[0];
    }

    save(): void {
        // this.lookup.lookupGroup = this.lookupGroupSelected;
        this.productGroup.status = (this.statusSelected === 'Active' ? 1 : 0);
        this.productGroupService.save(this.productGroup).subscribe(result => {
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
