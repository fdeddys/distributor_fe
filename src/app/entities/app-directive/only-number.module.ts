import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyNumberDirective } from './only-number.directive';
import { OnlyNumberMgDirective } from './OnlyNumberMgDirective';
import { OnlyNumberFloatDirective } from './only-number-float.directive';

@NgModule({
  declarations: [
    // OnlyNumberDirective,
    OnlyNumberMgDirective,
    OnlyNumberDirective,
    OnlyNumberFloatDirective
  ],
  imports: [
    CommonModule,
  ],
  providers: [
  ],
  exports: [
    // OnlyNumberDirective
  ]
})
export class OnlyNumberModule { }
