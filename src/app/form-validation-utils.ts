import { FormGroup } from '@angular/forms';

export class FormValidationUtils {
  static shouldShowRequiredError(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.invalid && field?.hasError('required') && (field?.dirty || field?.touched));
  }

  static shouldShowMinError(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.invalid && field?.hasError('min') && (field?.dirty || field?.touched));
  }

  static shouldShowEmailError(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.invalid && field?.hasError('email') && (field?.dirty || field?.touched));
  }
}