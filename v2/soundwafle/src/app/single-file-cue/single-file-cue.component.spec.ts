import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFileCueComponent } from './single-file-cue.component';

describe('SingleFileCueComponent', () => {
  let component: SingleFileCueComponent;
  let fixture: ComponentFixture<SingleFileCueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleFileCueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleFileCueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
