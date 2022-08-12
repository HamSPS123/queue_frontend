import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';
import { ServicesListComponent } from './services-list/services-list.component';
import { ServicesFormComponent } from './services-form/services-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
        ServicesComponent,
        ServicesListComponent,
        ServicesFormComponent,
    ],
    imports: [CommonModule, ServicesRoutingModule, SharedModule],
})
export class ServicesModule {}
