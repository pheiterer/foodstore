import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const VALIDATOR_MESSAGE: any = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minlength: 'Field is too short',
  passwordMismatch: 'Passwords do not match',
};

@Component({
  selector: 'input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.css']
})
export class InputValidationComponent implements OnInit, OnChanges {
  @Input()
  control!: AbstractControl;
  @Input()
  showError: boolean = true;
  errorMessages: string[] = [];
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidation();
  }

  ngOnInit(): void {
    this.control.statusChanges.subscribe(() => {
      this.checkValidation();
    });

    this.control.valueChanges.subscribe(() => {
      this.checkValidation();
    });
  }

  checkValidation(){
    const errors = this.control.errors;
    if (!errors){
      this.errorMessages = [];
      return;
    }

    const errorKey = Object.keys(errors);
    this.errorMessages = errorKey.map(key => VALIDATOR_MESSAGE[key]);
  }
}
