import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconStatComponent } from './icon-stat.component';

describe('IconStatComponent', () => {
  let component: IconStatComponent;
  let fixture: ComponentFixture<IconStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
