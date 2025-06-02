import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherdictionarychatComponent } from './teacherdictionarychat.component';

describe('TeacherdictionarychatComponent', () => {
  let component: TeacherdictionarychatComponent;
  let fixture: ComponentFixture<TeacherdictionarychatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherdictionarychatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherdictionarychatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
