import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlaylistCueComponent } from './playlist-cue.component';

describe('PlaylistCueComponent', () => {
  let component: PlaylistCueComponent;
  let fixture: ComponentFixture<PlaylistCueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistCueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistCueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
