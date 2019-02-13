import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongDomainComponent } from './wrong-domain.component';

describe('WrongDomainComponent', () => {
  let component: WrongDomainComponent;
  let fixture: ComponentFixture<WrongDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrongDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
