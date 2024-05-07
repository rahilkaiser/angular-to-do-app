import {Component, model} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbInputDatepicker],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
