import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockInfoBatchComponent } from './stock-info-batch.component';
import { StockInfoBatchService } from './stock-info-batch.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        StockInfoBatchComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
    ],
    entryComponents: [
        StockInfoBatchComponent,
    ],
    providers: [
        StockInfoBatchService
    ]
})
export class StockInfoBatchModule { }
