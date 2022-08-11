import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceTypesRoutingModule } from './service-types-routing.module';
import { ServiceTypesComponent } from './service-types.component';
import { ServiceTypesListComponent } from './service-types-list/service-types-list.component';
import { ServiceTypesFormComponent } from './service-types-form/service-types-form.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ServiceTypesComponent,
    ServiceTypesListComponent,
    ServiceTypesFormComponent
  ],
  imports: [
    CommonModule,
    ServiceTypesRoutingModule,
    SharedModule
  ]
})
export class ServiceTypesModule { }
