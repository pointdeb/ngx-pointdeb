import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { IconsComponent } from './shared/pages/icons/icons.component';

const AppRoutes: Routes = [
  { path: 'icons', component: IconsComponent },
  { path: '**', component: NotFoundComponent }
];
export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
