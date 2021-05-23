import { Component, OnInit } from '@angular/core';
import { CueViewModel, PlaylistCueViewModel, BaseCueViewModel } from '../code/CueViewModel';
import { ShowFile, Cue, IPlayListCue } from '../code/ShowFile';
import { dialog } from 'electron';

// import 'require-polyfills';
// import * as path from 'path-browserify';
// import * as fs from 'fs';


@Component({
  selector: 'app-single-file-cue',
  templateUrl: './single-file-cue.component.html',
  styleUrls: ['./single-file-cue.component.scss']
})
export class SingleFileCueComponent implements OnInit {
  ngOnInit(): void {

  }



}
