import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlStructureComponent } from './xml-structure.component';

describe('XmlStructureComponent', () => {
  let component: XmlStructureComponent;
  let fixture: ComponentFixture<XmlStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmlStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
