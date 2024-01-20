import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PaymentSupplierComponent } from './payment-supplier.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PaymentSupplierService } from './payment-supplier.service';
import { PaymentSupplierEditComponent } from './payment-supplier-edit/payment-supplier-edit.component';
import { PaymentSupplierSearchReceiveModalComponent } from './payment-supplier-search-receive-modal/payment-supplier-search-receive-modal.component';
import { PaymentSupplierModalComponent } from './payment-supplier-modal/payment-supplier-modal.component';

@NgModule({
    declarations: [
        PaymentSupplierComponent,
        PaymentSupplierEditComponent,
        PaymentSupplierSearchReceiveModalComponent,
        PaymentSupplierModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        PaymentSupplierComponent,
        PaymentSupplierEditComponent,
        PaymentSupplierSearchReceiveModalComponent,
        PaymentSupplierModalComponent
    ],
    providers: [
        PaymentSupplierService,
        DatePipe
    ]
})
export class PaymentSupplierModule { }
