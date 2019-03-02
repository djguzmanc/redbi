import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionNotesComponent } from './version-notes.component';

describe('VersionNotesComponent', () => {
  let component: VersionNotesComponent;
  let fixture: ComponentFixture<VersionNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
