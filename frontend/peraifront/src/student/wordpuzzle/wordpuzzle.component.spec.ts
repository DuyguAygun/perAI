import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpuzzleComponent } from './wordpuzzle.component';

describe('WordpuzzleComponent', () => {
  let component: WordpuzzleComponent;
  let fixture: ComponentFixture<WordpuzzleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordpuzzleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordpuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
