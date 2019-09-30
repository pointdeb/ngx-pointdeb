import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const modules = [
  MaterialModule,
  HttpClientModule,
  RouterModule,
  ReactiveFormsModule
];

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
    NotFoundComponent,
    ...modules
  ]
})
export class SharedModule { }
