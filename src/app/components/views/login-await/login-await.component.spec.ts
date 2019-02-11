import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAwaitComponent } from './login-await.component';

describe('LoginAwaitComponent', () => {
  let component: LoginAwaitComponent;
  let fixture: ComponentFixture<LoginAwaitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAwaitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAwaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
