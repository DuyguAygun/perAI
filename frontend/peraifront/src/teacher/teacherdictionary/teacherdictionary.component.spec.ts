import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherdictionaryComponent } from './teacherdictionary.component';

describe('TeacherdictionaryComponent', () => {
  let component: TeacherdictionaryComponent;
  let fixture: ComponentFixture<TeacherdictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherdictionaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherdictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
