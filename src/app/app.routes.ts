import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/home/home.component').then(x => x.HomeComponent)
            },
            {
                path: "management",
                loadComponent: () => import('./pages/management/management.component').then(x => x.ManagementComponent)
            },
            {
                path: 'chating',
                loadComponent: () => import('./pages/chating/chating.component').then(x => x.ChatingComponent)
            }
        ]
    },
    {
        path: 'not-found',
        component: NotFoundComponent
    },

    { path: '**', redirectTo: 'not-found' }
];
