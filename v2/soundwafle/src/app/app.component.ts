import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sound waffle';

  public addCue() { }

  public addPlaylistCue() { }

  public save() { }

  public load() { }

  public stopAll() { }
}
