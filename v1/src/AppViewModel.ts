import * as $ from 'jquery';
import * as ko from 'knockout';
import "jquery-circle-progress"
import { dialog } from 'electron'
import { BaseCueViewModel, CueViewModel, PlaylistCueViewModel } from './CueViewModel';
const fs = require('fs');


export class AppViewModel {
    public SoundCues = ko.observableArray<BaseCueViewModel>([]);
    private currentShow = new ShowFile(); // eventually load in?

    private editCueVM = ko.observable(new CueViewModel(""));

    private loadedFilePath: string = null

    stopAll() {
        this.SoundCues().forEach((scue) => {
            scue.stop();
        });
    }

    async addCue() {

        const openResult = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
        });
        const { filePaths } = openResult;
        if (filePaths) {

            filePaths.forEach((value, index) => {
                this.SoundCues.push(new CueViewModel(filePaths[index], false));
            });

        }

    }

    async addPlaylistCue() {

        const openResult = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
        });
        const { filePaths } = openResult;
        if (filePaths?.length) {
            this.SoundCues.push(new PlaylistCueViewModel(filePaths, false));
        }
    }

    async save() {
        console.log("save");

        this.currentShow.ShowName = "Test";
        this.currentShow.Cues = [];

        this.SoundCues().forEach((scue) => {

            var cue: Cue = new Cue();
            scue.save(cue);

            this.currentShow.Cues.push(cue);
        });

        if (!this.loadedFilePath) {
            const saveResult = await dialog.showSaveDialog({
                title: "Save Show",
                filters: [{ name: 'show File', extensions: ['sc'] }]
            });

            const { filePath } = saveResult;

            //this.currentShow = ko.toJSON(this.SoundCues);
            fs.writeFile(filePath, JSON.stringify(this.currentShow));

            console.log("saved");
        } else {
            fs.writeFile(this.loadedFilePath, JSON.stringify(this.currentShow));
        }


    }

    async load() {
        console.log("load");

        const openResult = await dialog.showOpenDialog({
            title: "Save Show",
            filters: [{ name: 'show File', extensions: ['sc'] }]
        });

        const { filePaths } = openResult;
        if (filePaths) {
            if (filePaths[0]) {

                var path = filePaths[0];

                this.currentShow = JSON.parse(fs.readFileSync(path));

                this.SoundCues.removeAll();

                var cvm: BaseCueViewModel = null;

                this.currentShow.Cues.forEach((cue) => {

                    if (typeof cue.fileName === 'string') {
                        cvm = new CueViewModel(<string>cue.fileName, cue.loop, cue.volume, cue.fadeTime);
                    } else if (typeof cue.fileName === 'object') {
                        cvm = new PlaylistCueViewModel(<string[]>cue.fileName, cue.loop, (<IPlayListCue>cue).shuffle, cue.volume, cue.fadeTime);
                    }

                    //cvm.load(cue);
                    this.SoundCues.push(cvm);
                });

                this.loadedFilePath = path
                console.log("loaded");
            }
        }
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