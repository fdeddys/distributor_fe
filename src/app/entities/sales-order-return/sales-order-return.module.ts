import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderReturnComponent } from './sales-order-return.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SalesOrderReturnService } from './sales-order-return.service';
import { SalesOrderReturnEditComponent } from './sales-order-return-edit/sales-order-return-edit.component';
import { SalesOrderReturnDetailService } from './sales-order-return-detail.service';

@NgModule({
    declarations: [
        SalesOrderReturnComponent,
        SalesOrderReturnEditComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        SalesOrderReturnComponent,
        SalesOrderReturnEditComponent
    ],
    providers: [
        SalesOrderReturnService,
        SalesOrderReturnDetailService,
    ]
})
export class SalesOrderReturnModule { }
