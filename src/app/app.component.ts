import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HostComponent } from './components/host/host.component';
import { JoinerComponent } from './components/joiner/joiner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HostComponent,JoinerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'video-calling-app';
}
