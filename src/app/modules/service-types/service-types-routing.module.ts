import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceTypesListComponent } from './service-types-list/service-types-list.component';

const routes: Routes = [
    {path: '', component: ServiceTypesListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceTypesRoutingModule { }
