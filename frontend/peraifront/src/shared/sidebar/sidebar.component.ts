// sidebar.component.ts
import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {SidebarService} from './sidebar.service';
import {AuthService} from '../../auth/auth.service';  // Adjust the path as needed
import {NgClass, NgIf} from '@angular/common';
import {RouterLink, RouterLinkActive, Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    NgClass,
    RouterLinkActive,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class SidebarComponent implements OnInit {
  isTeacher = false;
  isStudent = false;
  userName = '';

  constructor(
    public sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router  // Inject Router properly here
  ) {
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userName = `${user.name} ${user.lastName}`;
        this.isTeacher = user.role === 'TEACHER';
        this.isStudent = user.role !== 'TEACHER';
      },
      error: (error) => console.error('Error fetching user:', error)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
