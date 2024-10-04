import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishSingleComponent } from './wish-single.component';

describe('WishSingleComponent', () => {
  let component: WishSingleComponent;
  let fixture: ComponentFixture<WishSingleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WishSingleComponent]
    });
    fixture = TestBed.createComponent(WishSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
