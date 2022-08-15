import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountersRoutingModule } from './counters-routing.module';
import { CountersComponent } from './counters.component';
import { CounterListComponent } from './counter-list/counter-list.component';
import { CounterFormComponent } from './counter-form/counter-form.component';


@NgModule({
  declarations: [
    CountersComponent,
    CounterListComponent,
    CounterFormComponent
  ],
  imports: [
    CommonModule,
    CountersRoutingModule
  ]
})
export class CountersModule { }
