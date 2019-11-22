import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AosoMapComponent } from './aoso-map.component';

describe('AosoMapComponent', () => {
  let component: AosoMapComponent;
  let fixture: ComponentFixture<AosoMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AosoMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AosoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
