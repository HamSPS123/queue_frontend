import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppMainComponent } from './layouts/app.main.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: AppMainComponent,
        children: [
            {
                path: '',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./modules/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
                data: { role: 'ADMIN' },
            },
            {
                path: 'staff',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./modules/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
                data: { role: 'STAFF' },
            },
            {
                path: 'users',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./modules/users/users.module').then(
                        (m) => m.UsersModule
                    ),
                data: { role: 'ADMIN' },
            },
            {
                path: 'service-types',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./modules/service-types/service-types.module').then(
                        (m) => m.ServiceTypesModule
                    ),
                data: { role: 'ADMIN' },
            },
            {
                path: 'services',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./modules/services/services.module').then(
                        (m) => m.ServicesModule
                    ),
                data: { role: 'ADMIN' },
            },
            {
                path: 'counters',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./modules/counters/counters.module').then(
                        (m) => m.CountersModule
                    ),
                data: { role: 'ADMIN' },
            },
        ],
    },
    { path: 'notfound', component: AppNotfoundComponent },
    // { path: 'login', component: AppLoginComponent },
    {
        path: 'auth',
        loadChildren: () =>
            import('./modules/auth/auth.module').then((m) => m.AuthModule),
    },
    { path: '**', redirectTo: '/notfound' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            paramsInheritanceStrategy: 'always',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
