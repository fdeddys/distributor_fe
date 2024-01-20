import { Component, OnInit, Input } from '@angular/core';
import { SupplierService } from '../supplier.service';
import { Supplier } from '../supplier.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LookupService } from '../../lookup/lookup.service';
import { Lookup, LookupDto } from '../../lookup/lookup.model';

@Component({
  selector: 'op-supplier-modal',
  templateUrl: './supplier-modal.component.html',
  styleUrls: ['./supplier-modal.component.css']
})
export class SupplierModalComponent implements OnInit {

    @Input() statusRec;
    @Input() objEdit: Supplier;
    @Input() viewMsg;

    statuses = ['Active', 'Inactive'];
    supplier: Supplier;
    statusSelected: string;
    bankSelected: number;
    suppliers: Supplier[];
    banks: Lookup[];
    isFormDirty: Boolean = false;

    constructor(
        public supplierService: SupplierService,
        public modalService: NgbModal,
        public bankService: LookupService,
    ) { }

    ngOnInit() {
        this.findAllBank();
        console.log('obj to edit -> ', this.objEdit);
        console.log(this.statusRec);
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
        } else {
            this.supplier = this.objEdit;
            if (this.supplier.status === 1) {
                this.statusSelected = this.statuses[0];
            } else {
                this.statusSelected = this.statuses[1];
            }
        }
    }

    findAllBank() {
        this.bankService.findByName({
            groupName: 'bank'
            }).subscribe(
                result => {
                    
                    this.banks = result.body.contents;
                    
                    console.log('get find by group-name :', result);
                    if (this.statusRec === 'addnew') {
                        let lookup = new Lookup()
                        lookup.name = "Please Select"
                        lookup.id = 0
                        this.banks.unshift(lookup);
                        this.bankSelected = 0;
                        //  this.banks[0].id;
                    } else {
                        this.bankSelected = this.supplier.bankId;
                    }
                }
            );
    }

    setDefaultValue() {
        this.supplier = {};
        this.statusSelected = this.statuses[0];
    }

    save(): void {
        // this.lookup.lookupGroup = this.lookupGroupSelected;
        this.supplier.status = (this.statusSelected === 'Active' ? 1 : 0);
        this.supplier.bankId = Number(this.bankSelected);
        this.supplierService.save(this.supplier).subscribe(result => {
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
