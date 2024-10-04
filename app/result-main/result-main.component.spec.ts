import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultMainComponent } from './result-main.component';

describe('ResultMainComponent', () => {
  let component: ResultMainComponent;
  let fixture: ComponentFixture<ResultMainComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultMainComponent]
    });
    fixture = TestBed.createComponent(ResultMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
