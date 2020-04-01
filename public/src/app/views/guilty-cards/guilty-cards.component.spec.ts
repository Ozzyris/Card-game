import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiltyCardsComponent } from './guilty-cards.component';

describe('GuiltyCardsComponent', () => {
  let component: GuiltyCardsComponent;
  let fixture: ComponentFixture<GuiltyCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuiltyCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiltyCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
