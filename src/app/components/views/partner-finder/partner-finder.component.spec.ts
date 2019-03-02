import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerFinderComponent } from './partner-finder.component';

describe('PartnerFinderComponent', () => {
  let component: PartnerFinderComponent;
  let fixture: ComponentFixture<PartnerFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
