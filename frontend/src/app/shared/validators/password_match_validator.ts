import { AbstractControl, FormGroup } from "@angular/forms";

export const PasswordsMatchValidator = (password: string, confirmPassword: string) => {
  const validator = (form: AbstractControl) => {
    const passwordControl = form.get(password);
    const confirmPasswordControl = form.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) return;

    if (passwordControl?.value !== confirmPasswordControl?.value) {
      confirmPasswordControl?.setErrors({ passwordMismatch: true });
    } else {
      const erros = confirmPasswordControl?.errors;
      if (!erros) return;

      delete erros.passwordMismatch;
      confirmPasswordControl?.setErrors(erros);
    }
  }
  
  return validator;
}