var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = require('jquery');
var ko = require('knockout');
var path = require('path');
var CurrentState;
(function (CurrentState) {
    CurrentState[CurrentState["Playing"] = 0] = "Playing";
    CurrentState[CurrentState["Paused"] = 1] = "Paused";
    CurrentState[CurrentState["Stopped"] = 2] = "Stopped";
})(CurrentState || (CurrentState = {}));
var BaseCueViewModel = (function () {
    function BaseCueViewModel(loop, volume, fadeTime) {
        var _this = this;
        if (loop === void 0) { loop = false; }
        if (volume === void 0) { volume = 100; }
        if (fadeTime === void 0) { fadeTime = 1.0; }
        this.player = new Audio();
        this.state = ko.observable(CurrentState.Stopped);
        this.loop = ko.observable(false);
        this.volume = ko.observable(100);
        this.displayName = ko.observable("");
        this.fileName = ko.observable("");
        this.icon = ko.observable("fa-play");
        this.fadeTime = ko.observable(1);
        this.progress = ko.observable(0);
        this.src = ko.observable("");
        this.IsPlaying = ko.computed(function () {
            return _this.state() === CurrentState.Playing;
        });
        this.loop.subscribe(function (newVal) {
            _this.setLoop(newVal);
        });
        this.volume.subscribe(function (newValue) {
            if (_this.player)
                _this.player.volume = newValue / 100;
        });
        this.state.subscribe(function (newValue) {
            if (newValue === CurrentState.Playing) {
                _this.icon("fa-pause");
            }
            else if (newValue === CurrentState.Paused || newValue === CurrentState.Stopped) {
                _this.icon("fa-play");
            }
            else {
            }
        });
        this.player.onended = function () {
            _this.onEnd();
        };
        this.loop(loop);
        this.volume(volume);
        this.fadeTime(fadeTime);
        this.player.ontimeupdate = function (ev) {
            _this.progress(_this.player.currentTime / _this.player.duration);
        };
        this.src.subscribe(function (val) {
            _this.player.src = val;
        });
    }
    BaseCueViewModel.prototype.onEnd = function () { };
    BaseCueViewModel.prototype.setLoop = function (newVal) { };
    BaseCueViewModel.prototype.fade = function () {
        this.fadeOut(this.fadeTime() * 1000);
    };
    BaseCueViewModel.prototype.fadeOut = function (timeMs) {
        var _this = this;
        $(this.player).animate({ volume: 0.0 }, {
            duration: timeMs,
            done: function () {
                _this.stop();
            }
        });
    };
    BaseCueViewModel.prototype.stop = function () {
        this.player.pause();
        var e = this.player;
        e.currentTime = 0;
        this.state(CurrentState.Stopped);
    };
    BaseCueViewModel.prototype.isPaused = function () {
        return this.state() === CurrentState.Paused;
    };
    BaseCueViewModel.prototype.isStopped = function () {
        return this.state() === CurrentState.Stopped;
    };
    BaseCueViewModel.prototype.play = function () {
        if (this.isStopped() || this.isPaused()) {
            this.playCurrent();
        }
        else {
            this.player.pause();
            this.state(CurrentState.Paused);
        }
    };
    BaseCueViewModel.prototype.playCurrent = function () {
        this.player.volume = this.volume() / 100;
        this.player.play();
        this.state(CurrentState.Playing);
    };
    BaseCueViewModel.prototype.save = function (cue) {
        cue.loop = this.loop();
        cue.volume = this.volume();
        cue.fadeTime = this.fadeTime();
    };
    return BaseCueViewModel;
}());
var CueViewModel = (function (_super) {
    __extends(CueViewModel, _super);
    function CueViewModel(f, loop, volume, fadeTime) {
        if (loop === void 0) { loop = false; }
        if (volume === void 0) { volume = 100; }
        if (fadeTime === void 0) { fadeTime = 1; }
        _super.call(this, loop, volume, fadeTime);
        this.src(f);
        this.fileName(f);
        this.displayName(path.basename(this.fileName()));
    }
    CueViewModel.prototype.save = function (cue) {
        cue.fileName = this.fileName();
        _super.prototype.save.call(this, cue);
    };
    CueViewModel.prototype.setLoop = function (newVal) {
        this.player.loop = newVal;
    };
    return CueViewModel;
}(BaseCueViewModel));
var PlaylistCueViewModel = (function (_super) {
    __extends(PlaylistCueViewModel, _super);
    function PlaylistCueViewModel(files, loop, volume, fadeTime) {
        var _this = this;
        if (loop === void 0) { loop = false; }
        if (volume === void 0) { volume = 100; }
        if (fadeTime === void 0) { fadeTime = 1; }
        _super.call(this, loop, volume, fadeTime);
        this.files = ko.observableArray([]);
        this.currentIndex = 0;
        this.shuffle = ko.observable(false);
        this.history = [];
        if (files) {
            files.forEach(function (file) {
                _this.files.push(file);
            });
            if (this.files && this.files().length > 0) {
                this.setCurrentPlayFile(0);
            }
        }
    }
    PlaylistCueViewModel.prototype.getDisplayString = function (file) {
        return path.basename(file);
    };
    PlaylistCueViewModel.prototype.playAt = function (index) {
        this.setCurrentPlayFile(index);
        console.log("Play At: ", index);
        this.history.push(index);
        this.play();
    };
    PlaylistCueViewModel.prototype.isPlaying = function (data) {
        return data === this.src() && this.state() === CurrentState.Playing;
    };
    PlaylistCueViewModel.prototype.setCurrentPlayFile = function (index) {
        var file = this.files()[index];
        this.fileName(file);
        if (!(this.src().indexOf(file) > -1)) {
            this.state(CurrentState.Stopped);
            this.src(file);
            this.displayName(path.basename(this.fileName()));
        }
        this.playlistCount = this.files().length;
    };
    PlaylistCueViewModel.prototype.removeItem = function (index) {
        this.files().splice(index, 1);
    };
    PlaylistCueViewModel.prototype.onEnd = function () {
        var atEnd = false;
        if (this.shuffle()) {
            atEnd = this.history.length >= this.playlistCount;
            if (atEnd) {
                this.history = [];
            }
            this.currentIndex = this.getNewRandomIndex();
        }
        else {
            atEnd = this.currentIndex === this.playlistCount - 1;
            if (atEnd) {
                this.currentIndex = 0;
            }
        }
        if (atEnd && !this.loop()) {
            this.src("");
            return;
        }
        this.setCurrentPlayFile(this.currentIndex);
        this.playAt(this.currentIndex);
    };
    PlaylistCueViewModel.prototype.save = function (cue) {
        cue.fileName = [];
        this.files().forEach(function (file) {
            cue.fileName.push(file);
        });
        _super.prototype.save.call(this, cue);
    };
    PlaylistCueViewModel.prototype.toggleShuffle = function () {
        this.shuffle(!this.shuffle());
    };
    PlaylistCueViewModel.prototype.inHistory = function (n) {
        var found = false;
        this.history.forEach(function (value) {
            if (n === value) {
                found = true;
                return;
            }
        });
        return found;
    };
    PlaylistCueViewModel.prototype.getNewRandomIndex = function () {
        var index;
        do {
            index = Math.floor((Math.random() * this.playlistCount));
            if (!this.inHistory(index))
                break;
        } while (true);
        return index;
    };
    return PlaylistCueViewModel;
}(BaseCueViewModel));
