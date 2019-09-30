import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

const AppRoutes: Routes = [
  { path: '**', component: NotFoundComponent }
];
export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
