import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenotationComponent } from './prenotation.component';

describe('PrenotationComponent', () => {
  let component: PrenotationComponent;
  let fixture: ComponentFixture<PrenotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrenotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrenotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
