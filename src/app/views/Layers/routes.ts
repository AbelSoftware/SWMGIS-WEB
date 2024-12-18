import { Routes } from '@angular/router';
export const routes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () => import('./layer-list/layer-list.component').then(m => m.LayerListComponent),
  //   data: {
  //     title: 'Layer List'
  //   }
  // },
  {
    path: '',
    loadComponent: () => import('./layer-master/layer-master.component').then(m => m.LayerMasterComponent),
    data: {
      title: 'Layer List'
    }
  },
  {
    path: 'edit',
    loadComponent: () => import('./edit-layer/edit-layer.component').then(m => m.EditLayerComponent),
    data: {
      title: 'Edit Layer'
    }
  },
  {
    path: 'add',
    loadComponent: () => import('./create-layer/create-layer.component').then(m => m.CreateLayerComponent),
    data: {
      title: 'Create Layer'
    }
  }
];
