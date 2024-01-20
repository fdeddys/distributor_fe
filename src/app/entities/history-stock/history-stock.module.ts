import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryStockComponent } from './history-stock.component';
import { HistoryStockService } from './history-stock.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        HistoryStockComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
    ],
    entryComponents: [
        HistoryStockComponent,
    ],
    providers: [
        HistoryStockService
    ]
})
export class HistoryStockModule { }
