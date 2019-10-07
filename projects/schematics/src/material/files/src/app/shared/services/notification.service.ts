import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  success(msg: string, duration: number = 1000) {
    this.snackBar.open(msg, 'Success', {duration});
  }

  errors(msg: string, duration: number = 2000) {
    this.snackBar.open(msg, 'Errors', {duration});
  }
}
