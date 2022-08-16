import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountersListComponent } from './counter-list/counters-list.component';

const routes: Routes = [{ path: '', component: CountersListComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CountersRoutingModule {}
