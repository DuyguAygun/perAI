import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-intro',
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class IntroComponent {
  constructor(private router: Router) {
  }

  getStarted() {
    this.router.navigate(['/login']);
  }
}
