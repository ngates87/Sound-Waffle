import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistCueComponent } from './playlist-cue.component';

describe('PlaylistCueComponent', () => {
  let component: PlaylistCueComponent;
  let fixture: ComponentFixture<PlaylistCueComponent>;

  beforeEach(async(() => {
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
