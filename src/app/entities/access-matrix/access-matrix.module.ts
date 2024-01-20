import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessMatrixComponent } from './access-matrix.component';
import { AccessMatrixService } from './access-matrix.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
// import { AreaModalComponent } from './area.modal.component';

import { TreeviewModule } from 'ngx-treeview';

@NgModule({
    declarations: [
        AccessMatrixComponent,
        // AreaModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        TreeviewModule,
    ],
    entryComponents: [
        AccessMatrixComponent,
        // AreaModalComponent
    ],
    providers: [
        AccessMatrixService
    ],
    exports: [
        // AreaModalComponent
    ]
})
export class AccessMatrixModule { }
