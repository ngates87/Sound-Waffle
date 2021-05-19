import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SingleFileCueComponent } from './single-file-cue/single-file-cue.component';
import { PlaylistCueComponent } from './playlist-cue/playlist-cue.component';

@NgModule({
  declarations: [
    AppComponent,
    SingleFileCueComponent,
    PlaylistCueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, MatButtonModule, MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
