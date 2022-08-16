import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountersRoutingModule } from './counters-routing.module';
import { CountersComponent } from './counters.component';
import { CountersListComponent } from './counter-list/counters-list.component';
import { CountersFormComponent } from './counter-form/counters-form.component';

@NgModule({
    declarations: [
        CountersComponent,
        CountersListComponent,
        CountersFormComponent,
    ],
    imports: [CommonModule, CountersRoutingModule, SharedModule],
})
export class CountersModule {}
