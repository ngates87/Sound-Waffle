// Mixing jQuery and Node.js code in the same file? Yes please!
/// <reference path="./../typings/github-electron/github-electron.d.ts" />
/// <reference path="./../typings/jquery/jquery.d.ts" />
/// <reference path="./../typings/bootstrap/bootstrap.d.ts" />
/// <reference path="./../typings/Knockout/knockout.d.ts" />
/// <reference path="CueViewModel.ts" /> 

var remote = require('remote');
var fs = require('fs');
var dlg: Electron.Dialog = remote.require('dialog');

class AppViewModel {
    private $ = require('jquery');
    private ko: KnockoutStatic = require('knockout');

    public SoundCues = ko.observableArray<BaseCueViewModel>([]);
    private currentShow: ShowFile = new ShowFile(); // eventually load in?

    private editCueVM: KnockoutObservable<CueViewModel> = ko.observable(new CueViewModel(""));

    private loadedFilePath: string = null

    stopAll() {
        this.SoundCues().forEach((scue) => {
            scue.stop();
        });
    }

    addCue(): void {

        dlg.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
        }, (fileName) => {
            console.log(fileName);
            if (fileName) {

                fileName.forEach((value, index) => {
                    this.SoundCues.push(new CueViewModel(fileName[index], false));
                });

            }
        });
    }

    addPlaylistCue(): void {

        dlg.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
        }, (files) => {
            console.log(files);
            if (files) {

                this.SoundCues.push(new PlaylistCueViewModel(files, false));

            }
        });
    }

    save() {
        console.log("save");

        this.currentShow.ShowName = "Test";
        this.currentShow.Cues = [];

        this.SoundCues().forEach((scue) => {

            var cue: Cue = new Cue();
            scue.save(cue);

            this.currentShow.Cues.push(cue);
        });

        if (!this.loadedFilePath) {
            dlg.showSaveDialog({
                title: "Save Show",
                filters: [{ name: 'show File', extensions: ['sc'] }]
            }, (filePath: string) => {

                //this.currentShow = ko.toJSON(this.SoundCues);
                fs.writeFile(filePath, JSON.stringify(this.currentShow));

                console.log("saved");
            })
        } else {
            fs.writeFile(this.loadedFilePath, JSON.stringify(this.currentShow));
        }


    }

    load() {
        console.log("load");

        dlg.showOpenDialog({
            title: "Save Show",
            filters: [{ name: 'show File', extensions: ['sc'] }]
        }, (filePath: string[]) => {
            if (filePath) {
                if (filePath[0]) {

                    var path = filePath[0];

                    this.currentShow = JSON.parse(fs.readFileSync(path));

                    this.SoundCues.removeAll();

                    var cvm: BaseCueViewModel = null;

                    this.currentShow.Cues.forEach((cue) => {

                        if (typeof cue.fileName === 'string') {
                            cvm = new CueViewModel(<string>cue.fileName, cue.loop, cue.volume);
                        } else if (typeof cue.fileName === 'object') {
                            cvm = new PlaylistCueViewModel(<string[]>cue.fileName, cue.loop, (<IPlayListCue>cue).shuffle, cue.volume);
                        }

                        //cvm.load(cue);
                        this.SoundCues.push(cvm);
                    });

                    this.loadedFilePath = path
                    console.log("loaded");
                }
            }
        })
    }

    private deleteCue(e: CueViewModel) {
        //e.stop();
        if (confirm("Are you sure")) {
            this.SoundCues.remove(e);
            //e.removeDom();
        }
    }

    private editCue(e) {
        this.editCueVM(e);
        $("#editModal").modal('show');
    }

}