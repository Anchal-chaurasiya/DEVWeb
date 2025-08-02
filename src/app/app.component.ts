import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AutoLogoutService } from './services/autologout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eway-bill-app';
  constructor(private autoLogoutService: AutoLogoutService) {
  }
}
