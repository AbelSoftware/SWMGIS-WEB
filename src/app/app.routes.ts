import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import {AuthGuard} from './guards/auth.guard'
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      }
    ],
    canActivate:[ AuthGuard]
  },
  {
    path: 'layer',
    component: DefaultLayoutComponent,
    data: {
      title: 'layer'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./views/Layers/routes').then((m) => m.routes)
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'zoomindemo',
    loadComponent: () => import('./modules/zoomindemo/zoomindemo.component').then(m => m.ZoomindemoComponent),
    data: {
      title: 'Zoom Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'verifygeomtry',
    loadComponent: () => import('./modules/administrator/verifygeometry/verifygeometry.component').then(m => m.VerifygeometryComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
