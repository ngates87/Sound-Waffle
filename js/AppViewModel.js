var remote = require('electron').remote;
var dialog = remote.require('electron').dialog;
var fs = require('fs');
var AppViewModel = (function () {
    function AppViewModel() {
        this.$ = require('jquery');
        this.ko = require('knockout');
        this.SoundCues = ko.observableArray([]);
        this.currentShow = new ShowFile();
        this.editCueVM = ko.observable(new CueViewModel(""));
        this.loadedFilePath = null;
    }
    AppViewModel.prototype.stopAll = function () {
        this.SoundCues().forEach(function (scue) {
            scue.stop();
        });
    };
    AppViewModel.prototype.addCue = function () {
        var _this = this;
        dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
        }, function (fileName) {
            console.log(fileName);
            if (fileName) {
                fileName.forEach(function (value, index) {
                    _this.SoundCues.push(new CueViewModel(fileName[index], false));
                });
            }
        });
    };
    AppViewModel.prototype.addPlaylistCue = function () {
        var _this = this;
        dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
        }, function (files) {
            console.log(files);
            if (files) {
                _this.SoundCues.push(new PlaylistCueViewModel(files, false));
            }
        });
    };
    AppViewModel.prototype.save = function () {
        var _this = this;
        console.log("save");
        this.currentShow.ShowName = "Test";
        this.currentShow.Cues = [];
        this.SoundCues().forEach(function (scue) {
            var cue = new Cue();
            scue.save(cue);
            _this.currentShow.Cues.push(cue);
        });
        if (!this.loadedFilePath) {
            dialog.showSaveDialog({
                title: "Save Show",
                filters: [{ name: 'show File', extensions: ['sc'] }]
            }, function (filePath) {
                fs.writeFile(filePath, JSON.stringify(_this.currentShow));
                console.log("saved");
            });
        }
        else {
            fs.writeFile(this.loadedFilePath, JSON.stringify(this.currentShow));
        }
    };
    AppViewModel.prototype.load = function () {
        var _this = this;
        console.log("load");
        dialog.showOpenDialog({
            title: "Save Show",
            filters: [{ name: 'show File', extensions: ['sc'] }]
        }, function (filePath) {
            if (filePath) {
                if (filePath[0]) {
                    var path = filePath[0];
                    _this.currentShow = JSON.parse(fs.readFileSync(path));
                    _this.SoundCues.removeAll();
                    var cvm = null;
                    _this.currentShow.Cues.forEach(function (cue) {
                        if (typeof cue.fileName === 'string') {
                            cvm = new CueViewModel(cue.fileName, cue.loop, cue.volume, cue.fadeTime);
                        }
                        else if (typeof cue.fileName === 'object') {
                            cvm = new PlaylistCueViewModel(cue.fileName, cue.loop, cue.shuffle, cue.volume, cue.fadeTime);
                        }
                        _this.SoundCues.push(cvm);
                    });
                    _this.loadedFilePath = path;
                    console.log("loaded");
                }
            }
        });
    };
    AppViewModel.prototype.deleteCue = function (e) {
        if (confirm("Are you sure")) {
            this.SoundCues.remove(e);
        }
    };
    AppViewModel.prototype.editCue = function (e) {
        this.editCueVM(e);
        $("#editModal").modal('show');
    };
    return AppViewModel;
}());
