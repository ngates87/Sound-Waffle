import { Component } from '@angular/core';
import { dialog } from 'electron';
import { ElectronService } from 'ngx-electron';
import { BaseCueViewModel, CueViewModel, PlaylistCueViewModel } from './code/CueViewModel';
import { Cue, IPlayListCue, ShowFile } from './code/ShowFile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sound waffle';

  public SoundCues = [];
  private currentShow = new ShowFile(); // eventually load in?

  private editCueVM = new CueViewModel('');

  private loadedFilePath: string = null;

  constructor(private electronService: ElectronService) {
    console.log(`service`, this.electronService);
  }

  stopAll() {
    this.SoundCues.forEach((scue) => {
      scue.stop();
    });
  }

  async addCue() {

    console.log(`electorn`, dialog, window.Electron);

    const returnValue = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
    });

    const filePaths = returnValue.filePaths;

    filePaths?.forEach((value, index) => {
      this.SoundCues.push(new CueViewModel(filePaths[index], false));
    });

  }


  async addPlaylistCue() {

    const returnValue = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
    });

    const files = returnValue.filePaths;


    if (files) {
      this.SoundCues.push(new PlaylistCueViewModel(files, false));
    }
  }

  async save() {

    this.currentShow.ShowName = 'Test';
    this.currentShow.Cues = [];

    this.SoundCues.forEach((scue) => {

      const cue: Cue = new Cue();
      scue.save(cue);

      this.currentShow.Cues.push(cue);
    });

    if (!this.loadedFilePath) {
      const returnValue = dialog.showSaveDialog({
        title: 'Save Show',
        filters: [{ name: 'show File', extensions: ['sc'] }]
      });

      const { filePath } = (await returnValue);

      // this.currentShow = ko.toJSON(this.SoundCues);
      // fs.writeFile(filePath, JSON.stringify(this.currentShow), () => { });

      console.log('saved');
    } else {
      // fs.writeFile(this.loadedFilePath, JSON.stringify(this.currentShow), () => { });
    }


  }

  async load() {
    console.log('load');

    const returnValue = await dialog.showOpenDialog({
      title: 'Save Show',
      filters: [{ name: 'show File', extensions: ['sc'] }]
    });

    const { filePaths } = returnValue;

    if (filePaths) {
      if (filePaths[0]) {

        const path = filePaths[0];

        // this.currentShow = JSON.parse(fs.readFileSync(path, 'utf8'));

        this.SoundCues = [];

        let cvm: BaseCueViewModel = null;

        this.currentShow.Cues.forEach((cue) => {

          if (typeof cue.fileName === 'string') {
            cvm = new CueViewModel(cue.fileName, cue.loop, cue.volume, cue.fadeTime);
          } else if (typeof cue.fileName === 'object') {
            cvm = new PlaylistCueViewModel(cue.fileName, cue.loop, (cue as IPlayListCue).shuffle, cue.volume, cue.fadeTime);
          }

          // cvm.load(cue);
          this.SoundCues.push(cvm);
        });

        this.loadedFilePath = path;
        console.log('loaded');
      }
    }
  }

  // private deleteCue(e: CueViewModel) {
  //   // e.stop();
  //   if (confirm('Are you sure')) {
  //     // this.SoundCues.remove(e);
  //     // e.removeDom();
  //   }
  // }

  private editCue(e) {
    //   this.editCueVM(e);
    //   $('#editModal').modal('show');
  }
}
