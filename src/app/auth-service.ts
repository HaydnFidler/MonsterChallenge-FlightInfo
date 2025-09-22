import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from './firebase.config';
import { AuthSession } from './auth-session';
import { routes } from './app.routes';
import { Router } from '@angular/router';
import { DevelopmentFlags } from './development-flags';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public devFlags = new DevelopmentFlags(); // Pass 'false' to use the deveopment settings.
  private apiUrl = this.devFlags.getTokenWebApiUrl();
  public session: AuthSession = new AuthSession();
  
  constructor(private http: HttpClient, private router: Router) {
    // Store the landing URL (and extract the token) when the service is initialized.
    this.session.enactLandingEvent(this.devFlags.getRuntimeLandingUrl());

    // Tell us whether the url was well formed:
    if (this.session.hasLandingToken()) {
      console.log('Landing token detected.');
    } else {
      console.log('No landing token detected.');
    }
  }

  verifyToken(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = { token };

    return this.http.post(`${this.apiUrl}/api/verify-token`, body, { headers });
  }

  addUserPassedAuth(userName?: string) {
    let user: string = '';
    if (userName)
      user = userName.toString();
    this.session.addUserPassedAuth(user);
  }

  resetSession() {
    this.session.reset();
  }

  // onInitComponentBehindTokenWall is used by components that can only be seen when there is a token in the landing URL.
  onInitComponentBehindTokenWall() {
    if (!this.session.hasLandingToken() && this.devFlags.enableTokenWall) {
      this.router.navigate(['unknownlanding']);
    }
  }

  // onInitComponentBehindAuthWall() is used by components that can only be seen after the user has sucessfully authenticated.
  onInitComponentBehindAuthWall() {
    if (!this.session.isAuthed() && this.devFlags.enableAuthWall) {
      this.router.navigate(['unknownlanding']);
    }
  }

  sendEmailVerification(formEmail: string, landingToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      email: formEmail,
      token: landingToken
    };

    return this.http.post(`${this.apiUrl}/api/verify-token`, body, { headers });
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign-in error:", error.code, error.message);
      throw error;
    }
  }
}
