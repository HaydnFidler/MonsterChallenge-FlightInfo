import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightService, FlightInfoPayload } from '../flight-service';
import { Router } from '@angular/router';
import { FormValidationUtils } from '../form-validation-utils';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-flight-info-component',
  imports: [ReactiveFormsModule],
  templateUrl: './flight-info-component.html',
  styleUrl: './flight-info-component.css'
})
export class FlightInfoComponent implements OnInit {
  customerDisplayName: string = '';

  formFlightInfo = new FormGroup({
    arrivalDate: new FormControl('', Validators.required),
    arrivalTime: new FormControl('', Validators.required),
    airlineName: new FormControl('', Validators.required),
    flightNumber: new FormControl('', Validators.required),
    guestCount: new FormControl('', [Validators.required, Validators.min(1)]),
    comments: new FormControl('')
  });

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private flightService: FlightService, private router: Router, protected auth: AuthService) {}

  ngOnInit(): void {
    
    // This component is behind the auth-wall. If we're not authed, redirect to the Unknown Landing page...
    this.auth.onInitComponentBehindAuthWall();

    this.customerDisplayName = this.auth.session.userName;
  }

  shouldShowRequiredError(fieldName: string): boolean {
    return FormValidationUtils.shouldShowRequiredError(this.formFlightInfo, fieldName);
  }

  shouldShowMinError(fieldName: string): boolean {
    return FormValidationUtils.shouldShowMinError(this.formFlightInfo, fieldName);
  }

  welcomePhrase(): string {
    if (this.customerDisplayName == '') {
      //return 'We\'re looking forward to seeing you!';
      return 'Hi, tell us about your plans!'
    }
    else {
      return 'Hi ' + this.customerDisplayName + ', tell us about your plans!'
    }
  }

  submitForm(event: Event) {
    event.preventDefault();

    if (this.formFlightInfo.valid) {
      const payload: FlightInfoPayload = {
        airline: this.formFlightInfo.get('airlineName')?.value || '',
        arrivalDate: this.formFlightInfo.get('arrivalDate')?.value || '',
        arrivalTime: this.formFlightInfo.get('arrivalTime')?.value || '',
        flightNumber: this.formFlightInfo.get('flightNumber')?.value || '',
        numOfGuests: Number(this.formFlightInfo.get('guestCount')?.value) || 0,
        comments: this.formFlightInfo.get('comments')?.value || ''
      };

      this.isSubmitting = true;
      this.submitError = '';

      this.flightService.submitFlightInfo(payload).subscribe({
        next: (response) => {
          console.log('Flight info submitted successfully:', response);
          this.submitSuccess = true;
          this.isSubmitting = false;

          // Route to the Completion page...
          this.router.navigate(['completion']);
        },
        error: (error) => {
          console.error('Error submitting flight info:', error);
          this.submitError = 'Failed to submit flight information. Please try again.';
          this.isSubmitting = false;

          alert('We didn\'t quite get that. Please try again.');
        }
      });
    }
  }

  onTestDataClick(event: Event) {
    event.preventDefault();

    if(!this.formFlightInfo) return;

    this.formFlightInfo.get('airlineName')?.setValue('Delta');
    this.formFlightInfo.get('arrivalDate')?.setValue('2025-10-19');
    this.formFlightInfo.get('arrivalTime')?.setValue('14:29');
    this.formFlightInfo.get('flightNumber')?.setValue('DL10');
    this.formFlightInfo.get('guestCount')?.setValue('1');
    this.formFlightInfo.get('comments')?.setValue('Still none');
  }
}
