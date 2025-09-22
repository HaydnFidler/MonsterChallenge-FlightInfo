import { Routes } from '@angular/router';
import { FlightInfoComponent } from './flight-info-component/flight-info-component';
import { CompletionComponent } from './completion-component/completion-component';
import { AuthComponent } from './auth-component/auth-component';
import { UnknownLandingComponent } from './unknown-landing-component/unknown-landing-component';

export const routes: Routes = [
    { path: 'auth', component:AuthComponent },
    { path: 'flightinfo', component:FlightInfoComponent },
    { path: 'completion', component:CompletionComponent },
    { path: 'unknownlanding', component:UnknownLandingComponent },
    { path: '**', component:AuthComponent }
];
