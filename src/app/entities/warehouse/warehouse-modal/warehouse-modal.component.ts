import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Warehouse } from '../warehouse.model';
import { WarehouseService } from '../warehouse.service';

@Component({
  selector: 'op-warehouse-model',
  templateUrl: './warehouse-modal.component.html',
  styleUrls: ['./warehouse-modal.component.css']
})
export class WarehouseModalComponent implements OnInit {

    @Input() statusRec: string;
    @Input() objEdit;
    @Input() viewMsg: string;

    warehouse: Warehouse;
    whInStatuses = ['Y', 'N'];
    whInSelected: string;
    
    whOutStatuses = ['Y', 'N'];
    whOutSelected: string;

    statuses = ['Active', 'Inactive'];
    statusSelected: string;

    isFormDirty: Boolean = false;

    constructor(
        public warehouseService: WarehouseService,
        public modalService: NgbModal) { }

    ngOnInit() {
        console.log('obj to edit -> ', this.objEdit);
        console.log(this.statusRec);
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
            return;
        } 
    
        this.warehouse = this.objEdit;
        this.statusSelected = (this.warehouse.status === 1) ? this.statuses[0] : this.statuses[1] ; 
        this.whInSelected = (this.warehouse.whIn === 1) ?  this.whInStatuses[0] : this.whInStatuses[1];
        this.whOutSelected = (this.warehouse.whOut === 1) ?  this.whOutStatuses[0] : this.whOutStatuses[1];
        // this.statusSelected = this.statuses[0];
        // if (this.Warehouse.status !== 1) {
        //     this.statusSelected = this.statuses[1];
        // }
    
    }

    setDefaultValue() {
        this.warehouse = {};
        this.statusSelected = this.statuses[0];
        this.whInSelected = this.whInStatuses[0];
        this.whOutSelected = this.whOutStatuses[0];

    }

    save(): void {
        this.warehouse.status = (this.statusSelected === 'Active' ? 1 : 0);
        this.warehouse.whIn = (this.whInSelected === 'Y' ? 1 : 0 );
        this.warehouse.whOut = (this.whOutSelected === 'Y' ? 1 : 0 );
        
        this.warehouseService.save(this.warehouse).subscribe(result => {
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
