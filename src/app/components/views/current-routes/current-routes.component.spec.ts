import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRoutesComponent } from './current-routes.component';

describe('CurrentRoutesComponent', () => {
  let component: CurrentRoutesComponent;
  let fixture: ComponentFixture<CurrentRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
