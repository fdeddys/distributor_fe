import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseService } from './warehouse.service';
import { WarehouseModalComponent } from './warehouse-modal/warehouse-modal.component';


@NgModule({
    declarations: [
        WarehouseComponent,
        WarehouseModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        WarehouseComponent,
        WarehouseModalComponent
    ],
    providers: [
        WarehouseService,
    ],
    exports: [
        WarehouseComponent
    ]
})
export class WarehouseModule { }
