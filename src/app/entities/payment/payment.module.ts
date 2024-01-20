import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from './payment.service';
import { PaymentOrderService } from './payment-order.service';
import { PaymentDetailService } from './payment-detail.service';
import { PaymentReturnService } from './payment-return.service';
import { PaymentModalOrderComponent } from './payment-modal-order/payment-modal-order.component';
import { PaymentModalReturnComponent } from './payment-modal-return/payment-modal-return.component';

@NgModule({
    declarations: [
        PaymentComponent, 
        PaymentModalComponent, 
        PaymentModalOrderComponent, 
        PaymentModalReturnComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        PaymentComponent, 
        PaymentModalComponent,
        PaymentModalOrderComponent,
        PaymentModalReturnComponent,
    ],
    providers: [
        PaymentService,
        PaymentOrderService,
        PaymentDetailService,
        PaymentReturnService,
    ]
})
export class PaymentModule { }
