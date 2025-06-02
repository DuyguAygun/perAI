// sidebar.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isClosed = false;

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }
}
