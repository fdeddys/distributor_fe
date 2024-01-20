import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LookupComponent } from './lookup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { LookupService } from './lookup.service';
import { LookupModalComponent } from './lookup.modal/lookup.modal.component';

@NgModule({
  declarations: [
    LookupModalComponent,
    LookupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
  ],
  entryComponents: [
    LookupComponent,
    LookupModalComponent,
  ],
  providers: [
    LookupService,
  ],
  exports: [
    LookupModalComponent,
  ]

})
export class LookupModule { }
