import { booleanAttribute, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidationUtils } from '../form-validation-utils';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-component',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-component.html',
  styleUrl: './auth-component.css'
})
export class AuthComponent implements OnInit {
  showPassword = false;
  isLoading = false;

  constructor(private authService: AuthService, private route: Router) {}

  // When landing on this page, we require there to be a token from the incomming url.
  // If we don't have one, then the visitor may have arrived here accidentally.
  ngOnInit(): void {
    this.authService.onInitComponentBehindTokenWall();
  }

  formAuth = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  shouldShowRequiredError(fieldName: string): boolean {
      return FormValidationUtils.shouldShowRequiredError(this.formAuth, fieldName);
    }

  shouldShowEmailError(fieldName: string): boolean {
      return FormValidationUtils.shouldShowEmailError(this.formAuth, fieldName);
    }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private async verifyTokenIfPresentWithRetry(email: string): Promise<boolean> {
    let triesRemaining: number = 3;
    let tokenVerified: boolean = false;

    do {
      console.log(`Token validation tryies remaining=${triesRemaining}`)
      tokenVerified = await this.verifyTokenIfPresent(email);
      triesRemaining--;
    } while (!tokenVerified && triesRemaining > 0);

    return tokenVerified;
  }

  private verifyTokenIfPresent(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      // If no token, resolve immediately with false (no verification possiible - we should never have arrived here)
      if (!this.authService.session.hasLandingToken()) {
        resolve(false);
        return;
      }

      const landingToken = this.authService.session.linkAuth.landedToken;

      this.authService.sendEmailVerification(email, landingToken).subscribe({
        next: (response) => {
          console.log('Token verification successful:', response);
          this.authService.session.linkAuth.addTokenAuthed();
          resolve(true);
        },
        error: (error) => {
          if (error.status === 401) {
            console.log('Token verification failed: Invalid email/token combination');
          } else {
            console.error('Token verification error:', error);
          }
          this.authService.session.linkAuth.reset();
          resolve(false);
        }
      });
    });
  }

  async submitForm(event: Event) {
    event.preventDefault();

    if (this.formAuth.valid) {
      this.isLoading = true;
      const formEmail = this.formAuth.get('emailAddress')?.value?.toLowerCase() || '';
      const password = this.formAuth.get('password')?.value || '';

      try {
        // First, verify token if present
        const tokenVerified = await this.verifyTokenIfPresentWithRetry(formEmail);

        if (!tokenVerified) {
          console.log('Token verification failed.');
          alert("The email address does not match the email.");
          return;
        }

        console.log('Token verification passed, proceeding with Firebase auth...');

        // Second, authenticate with Firebase
        const user = await this.authService.signInWithEmail(formEmail, password);
        console.log('Firebase authentication successful:', user);
        this.authService.addUserPassedAuth(user?.displayName || undefined);

      } catch (error: any) {
        // Handle Firebase authentication errors
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
          alert("Incorrect password. Please try again.");
        } else if (errorCode === 'auth/user-not-found') {
          alert("No account found with that email address.");
        } else if (errorCode === 'auth/invalid-email') {
          alert("The email address is not valid.");
        } else {
          alert("Sign-in failed.");
          console.log(errorMessage);
        }

        this.authService.session.passwordAuth.reset();
      } finally {
        this.isLoading = false;
      }

      if (this.authService.session.isAuthed()) {
        // Route to the Flight Info page if we have successfully authed...
        this.route.navigate(['flightinfo']);
      }
    }
  }
}
