import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnReceivingComponent } from './return-receiving.component';
import { ReturnReceivingModalComponent } from './return-receiving-modal/return-receiving-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReturnReceivingService } from './return-receiving.service';
import { ReturnReceivingDetailService } from './return-receiving-detail.service';

@NgModule({
    declarations: [
        ReturnReceivingComponent,
        ReturnReceivingModalComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        ReturnReceivingComponent,
        ReturnReceivingModalComponent
    ],
    providers: [
        ReturnReceivingService,
        ReturnReceivingDetailService,
    ]
})
export class ReturnReceivingModule { }
