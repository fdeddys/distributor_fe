import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjustmentComponent } from './adjustment.component';
import { AdjustmentEditComponent } from './adjustment-edit/adjustment-edit.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdjustmentService } from './adjustment.service';
import { AdjustmentDetailService } from './adjustment-detail.service';

@NgModule({
    declarations: [
        AdjustmentComponent,
        AdjustmentEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        AdjustmentComponent,
        AdjustmentEditComponent
    ],
    providers: [
        AdjustmentService,
        AdjustmentDetailService,
    ]
})
export class AdjustmentModule { }
