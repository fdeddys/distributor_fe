import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppParameterService } from './app-parameter.service';
import { AppParameterComponent } from './app-parameter.component';

@NgModule({
  declarations: [
    AppParameterComponent,
  ],
  imports: [
    CommonModule
  ],
  providers: [
    AppParameterService
  ]
})
export class AppParameterModule { }
