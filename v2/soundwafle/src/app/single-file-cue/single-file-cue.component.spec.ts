import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleFileCueComponent } from './single-file-cue.component';

describe('SingleFileCueComponent', () => {
  let component: SingleFileCueComponent;
  let fixture: ComponentFixture<SingleFileCueComponent>;

  beforeEach(waitForAsync(() => {
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
