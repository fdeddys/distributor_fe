import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderComponent } from './sales-order.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderEditComponent } from './sales-order-edit/sales-order-edit.component';
import { SalesOrderDetailService } from './sales-order-detail.service';
import { SalesOrderModalComponent } from './sales-order-modal/sales-order-modal.component';

@NgModule({
    declarations: [SalesOrderComponent, SalesOrderEditComponent, SalesOrderModalComponent],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
    ],
    entryComponents: [
        SalesOrderComponent,
        SalesOrderEditComponent,
        SalesOrderModalComponent,
    ],
    providers: [
        SalesOrderService,
        SalesOrderDetailService,
    ]
})
export class SalesOrderModule { }
