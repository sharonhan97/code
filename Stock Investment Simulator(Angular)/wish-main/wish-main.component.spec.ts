import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishMainComponent } from './wish-main.component';

describe('WishMainComponent', () => {
  let component: WishMainComponent;
  let fixture: ComponentFixture<WishMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WishMainComponent]
    });
    fixture = TestBed.createComponent(WishMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
