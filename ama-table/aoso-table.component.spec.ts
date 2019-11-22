import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AosoTableComponent } from './aoso-table.component';

describe('AosoTableComponent', () => {
  let component: AosoTableComponent;
  let fixture: ComponentFixture<AosoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AosoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AosoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
