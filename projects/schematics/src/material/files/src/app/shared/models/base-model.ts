import { FormGroup } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';

export class BaseForm<T> {
  @Input() value: T;
  @Output() valueChange = new EventEmitter<T>();
  // tslint:disable-next-line: variable-name
  private __errors: any;
  @Input() set errors(value: any) {
    this.__errors = value;
    this.updateErrors();
  }
  get errors(): any {
    return this.__errors;
  }
  @Output() errorsChange = new EventEmitter<any>();
  formGroup: FormGroup;
  protected genericErrorMessages = {
    required: 'This field is required.',
    email: 'Please provide a valid email.',
    notmatch: 'Password does not match.',
  };

  constructor() {}

  submit(): void {
    if (this.formGroup.valid) {
      this.value = this.formGroup.value;
      this.valueChange.emit(this.value);
    }
  }

  updateErrors() {
    if (this.formGroup === undefined) {
      return;
    }
    this.formGroup.setErrors({});
    for (const key in this.errors) {
      if (this.formGroup.controls.hasOwnProperty(key)) {
        const value: string[] = this.errors[key];
        this.formGroup.controls[key].setErrors({
          custom: value[0]
        });
      }
    }
  }

  hasError(controlName: string, validationKkey: string): boolean {
    if (!this.formGroup) {
      return false;
    }

    if (controlName === 'password_confirmation') {
      this.passwordMatch();
    }

    const control = this.formGroup.controls[controlName];
    return control.hasError(validationKkey);
  }

  getError(controlName: string, validationKkey: string): string {
    if (!this.formGroup || !this.hasError(controlName, validationKkey)) {
      return null;
    }
    const control = this.formGroup.controls[controlName];
    return this.genericErrorMessages.hasOwnProperty(validationKkey)
      ? this.genericErrorMessages[validationKkey]
      : control.getError(validationKkey);
  }

  passwordMatch() {
    const password = this.formGroup.controls.password;
    const passwordConfirmation = this.formGroup.controls.password_confirmation;
    if (passwordConfirmation.value === '') {
      return false;
    }

    if (
      password.value === passwordConfirmation.value &&
      passwordConfirmation.value !== ''
    ) {
      return false;
    } else {
      passwordConfirmation.setErrors({ notmatch: true });
      return true;
    }
  }
}
