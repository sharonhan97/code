import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSingleComponent } from './result-single.component';

describe('ResultSingleComponent', () => {
  let component: ResultSingleComponent;
  let fixture: ComponentFixture<ResultSingleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultSingleComponent]
    });
    fixture = TestBed.createComponent(ResultSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
