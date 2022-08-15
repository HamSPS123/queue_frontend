import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterListComponent } from './counter-list/counter-list.component';

const routes: Routes = [{ path: '', component: CounterListComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CountersRoutingModule {}
