import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockMutationComponent } from './stock-mutation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { StockMutationService } from './stock-mutation.service';
import { StockMutationDetailService } from './stock-mutation-detail.service';
import { StockMutationEditComponent } from './stock-mutation-edit/stock-mutation-edit.component';

@NgModule({
    declarations: [
        StockMutationComponent,
        StockMutationEditComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
    ],
    entryComponents: [
        StockMutationComponent,
    ],
    providers: [
        StockMutationService,
        StockMutationDetailService,
    ]
})
export class StockMutationModule { }
