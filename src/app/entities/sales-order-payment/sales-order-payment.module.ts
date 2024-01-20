import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderPaymentComponent } from './sales-order-payment.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SalesOrderPayment } from './sales-order-payment.model';
import { SalesOrderPaymentService } from './sales-order-payment.service';
import { SalesOrderPaymentEditComponent } from './sales-order-payment-edit/sales-order-payment-edit.component';

@NgModule({
    declarations: [
        SalesOrderPaymentComponent, 
        SalesOrderPaymentEditComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents:[
        SalesOrderPaymentComponent,
        SalesOrderPaymentEditComponent,
    ],
    providers: [
        SalesOrderPaymentService
    ]
})
export class SalesOrderPaymentModule { }
