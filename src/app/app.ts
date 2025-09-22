import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth-service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  currentYear = new Date().getFullYear();

  constructor(protected auth: AuthService) {}

  ngOnInit(): void {
  }

  onSearch(searchTerm: string) {
    if (searchTerm.trim()) {
      // Redirect to monsterrg.com with search parameter
      const searchUrl = `https://monsterrg.com/?s=${encodeURIComponent(searchTerm)}`;
      window.open(searchUrl, '_blank');
    }
  }
}
