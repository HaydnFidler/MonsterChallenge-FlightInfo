import { Component, OnInit } from '@angular/core';
import { FlightInfoPayload, FlightService } from '../flight-service';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-completion-component',
  imports: [],
  templateUrl: './completion-component.html',
  styleUrl: './completion-component.css'
})
export class CompletionComponent implements OnInit {
  payload?: FlightInfoPayload;

  constructor(private service: FlightService, private auth: AuthService) {
    this.payload = service.lastPayload;
  }

  ngOnInit(): void {
    // This component is behind the auth-wall. If we're not authed, redirect to the Unknown Landing page...
    this.auth.onInitComponentBehindAuthWall();
  }

  getMonthName(): string {
    if (!this.payload?.arrivalDate) return '';
    const date = new Date(this.payload.arrivalDate);
    return date.toLocaleDateString('en-US', { month: 'long' });
  }

  getMonthNamePhrase(): string {
    const monthName: string = this.getMonthName();
    if (monthName == '') 
      return 'See you soon!';
    return 'See you in ' + monthName + '!';
  }

}
