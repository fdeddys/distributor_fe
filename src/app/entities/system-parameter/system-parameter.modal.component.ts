import { Component, OnInit, Input } from '@angular/core';
import { SystemParameter } from './system-parameter.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemParameterService } from './system-parameter.service';

@Component({
  selector: 'op-system-parameter-modal',
  templateUrl: './system-parameter.modal.component.html',
  styleUrls: ['./system-parameter.modal.component.css']
})
export class SystemParameterModalComponent implements OnInit {
    @Input() statusRec;
    @Input() objEdit: SystemParameter;
    @Input() viewMsg;

    systemParameter: SystemParameter;
    isFormDirty: Boolean = false;

    constructor(private modalService: NgbModal,
                private systemParameterService: SystemParameterService) { }

    ngOnInit() {
        if (this.statusRec === 'addnew') {
            this.systemParameter = {};
            this.systemParameter.id = 0;
        } else {
            this.systemParameter = this.objEdit;
        }
    }

    // on click button save from modal
    save(): void {
        this.systemParameterService.save(this.systemParameter).subscribe(result => {
            this.isFormDirty = true;
            if (result.body.errCode === '00') {
                this.closeForm();
            } else {
                console.log('error');
            }
        });
    }

    // event on click close button
    closeForm(): void {
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');

        } else {
            this.modalService.dismissAll('close');
        }
    }

}
