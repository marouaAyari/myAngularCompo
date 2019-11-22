import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PellEditorComponent } from './pell-editor.component';

describe('PellEditorComponent', () => {
  let component: PellEditorComponent;
  let fixture: ComponentFixture<PellEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PellEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
