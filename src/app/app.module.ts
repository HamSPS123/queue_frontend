import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppComponent } from './app.component';
import { AppMainComponent } from './layouts/app.main.component';
import { AppConfigComponent } from './core/configs/app.config.component';
import { AppMenuComponent } from './layouts/app.menu.component';
import { AppMenuitemComponent } from './shared/directives/app.menuitem.component';
import { AppTopBarComponent } from './layouts/app.topbar.component';
import { AppSearchComponent } from './shared/components/app.search.component';
import { AppFooterComponent } from './layouts/app.footer.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';

import { BreadcrumbService } from './shared/services/app.breadcrumb.service';
import { MenuService } from './core/services/app.menu.service';
import { ConfigService } from './core/services/app.config.service';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ConfirmationService, MessageService } from 'primeng/api';
import { reducer } from './core/state/spinner/spinner.reducer';
import { SpinnerInterceptor } from './core/intercepters/spinner.interceptor';
import { StoreModule } from '@ngrx/store';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AuthInterceptor } from './core/intercepters/auth.interceptor';

FullCalendarModule.registerPlugins([
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
]);

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BreadcrumbModule,
        BrowserAnimationsModule,
        ContextMenuModule,
        NgxWebstorageModule.forRoot(),
        StoreModule.forRoot({ spinner: reducer }),
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppConfigComponent,
        AppTopBarComponent,
        AppSearchComponent,
        AppFooterComponent,
        AppNotfoundComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SpinnerInterceptor,
            multi: true,
        },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        MenuService,
        BreadcrumbService,
        ConfigService,
        MessageService,
        ConfirmationService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
