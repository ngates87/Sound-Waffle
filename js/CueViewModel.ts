/// <reference path="./../typings/github-electron/github-electron.d.ts" />
/// <reference path="./../typings/jquery/jquery.d.ts" />
/// <reference path="./../typings/knockout/knockout.d.ts" />
/// <reference path="AudioPlayer.ts" />
/// <reference path="ShowFile.ts" />

var $: JQueryStatic = require('jquery');
var ko: KnockoutStatic = require('knockout');
var path = require('path');

enum CurrentState {
    Playing,
    Paused,
    Stopped,
}


// should consider making CueVM and PlaylistCueVM one and the same? Isn't a single cue,just a playlist with one song?
abstract class BaseCueViewModel {

    protected player: HTMLAudioElement = new Audio();
    protected state: KnockoutObservable<CurrentState> = ko.observable(CurrentState.Stopped);
    protected loop = ko.observable<boolean>(false);
    protected volume = ko.observable<number>(100);
    protected displayName = ko.observable<string>("");
    protected fileName = ko.observable<string>("");
    protected icon = ko.observable<string>("fa-play");
    protected fadeTime = ko.observable<number>(1);
    protected progress = ko.observable<number>(0);
    protected src = ko.observable<string>("");

    constructor(loop: boolean = false, volume: number = 100, fadeTime: number = 1.0) {

        this.loop.subscribe((newVal) => {
            this.setLoop(newVal);
            //this.player.loop = newVal;
        });

        this.volume.subscribe((newValue) => {
            if (this.player)
                this.player.volume = newValue / 100;
        });

        this.state.subscribe((newValue) => {
            if (newValue === CurrentState.Playing) {
                this.icon("fa-pause");
            }
            else if (newValue === CurrentState.Paused || newValue === CurrentState.Stopped) {
                this.icon("fa-play");
            }
            else {
                //this.icon("fa-stop");
            }
        });

        this.player.onended = () => {
            this.onEnd();
        }

        this.loop(loop);
        this.volume(volume);
        this.fadeTime(fadeTime);

        this.player.ontimeupdate = (ev: Event) => {
            this.progress(this.player.currentTime / this.player.duration);
			
        };

        this.src.subscribe((val) => {
            this.player.src = val;
        });


    }

    private IsPlaying: KnockoutObservable<boolean> = ko.computed(() => {
        return this.state() === CurrentState.Playing;
    });

    onEnd(): void { 
		this.state(CurrentState.Stopped);
	}

    setLoop(newVal: boolean) { }

    public fade() {
        this.fadeOut(this.fadeTime() * 1000);
    }

    fadeOut(timeMs: number) {
        $(this.player).animate({ volume: 0.0 }, {
            duration: timeMs,
            done: () => {
                this.stop();
            }//,
        });
    }

    stop() {
        this.player.pause();
        var e: HTMLAudioElement = this.player;
        e.currentTime = 0;
        this.state(CurrentState.Stopped);
    }

    isPaused(): boolean {
        return this.state() === CurrentState.Paused;
    }

    isStopped(): boolean {
        return this.state() === CurrentState.Stopped;
    }

    public play() {
        if (this.isStopped() || this.isPaused()) {
            this.playCurrent();
        } else {
            this.player.pause();
            this.state(CurrentState.Paused);
        }
    }

    protected playCurrent() {
        this.player.volume = this.volume() / 100;
        this.player.play();
        this.state(CurrentState.Playing);
    }

    save(cue: ICue) {
        cue.loop = this.loop();
        cue.volume = this.volume();
        cue.fadeTime = this.fadeTime();
    }
}

class CueViewModel extends BaseCueViewModel {

    constructor(f: string, loop: boolean = false, volume: number = 100, fadeTime: number = 1) {
        super(loop, volume, fadeTime);
        this.src(f);
        this.fileName(f);
        this.displayName(path.basename(this.fileName()));
    }

    save(cue: ICue) {
        cue.fileName = this.fileName();
        super.save(cue);
    }

    setLoop(newVal: boolean) {
        this.player.loop = newVal;
    }
}


class PlaylistCueViewModel extends BaseCueViewModel {

    private files: KnockoutObservableArray<string> = ko.observableArray([]);
    private currentIndex: number = 0;
    private playlistCount: number;
    private shuffle: KnockoutObservable<boolean> = ko.observable(false);

    private history: number[] = [];

    constructor(files: string[], loop: boolean = false, shuffle: boolean = false, volume: number = 100, fadeTime: number = 1) {
        super(loop, volume, fadeTime);

        if (files) {
            files.forEach((file) => {
                this.files.push(file);
            });

            if (this.files && this.files().length > 0) {
                this.setCurrentPlayFile(0);
            }
        }

        this.shuffle(shuffle);
    }

    getDisplayString(file: string): string {
        return path.basename(file);
    }

    playAt(index: number) {
        this.setCurrentPlayFile(index);
        console.log("Play At: ", index);
        this.history.push(index);
        this.play();
    }

    isPlaying(data) {
        return data === this.src() && this.state() === CurrentState.Playing;
    }

    setCurrentPlayFile(index: number) {
        var file = this.files()[index];
        this.fileName(file);

        if (!(this.src().indexOf(file) > -1)) {
            this.state(CurrentState.Stopped);
            this.src(file);

            this.displayName(path.basename(this.fileName()));
        }

        this.playlistCount = this.files().length;
    }

    removeItem(index: number) {
        this.files().splice(index, 1);
    }

    onEnd(): void {

        var atEnd: boolean = false;

        if (this.shuffle()) {

            atEnd = this.history.length >= this.playlistCount;


            if (atEnd) {
                this.history = [];
            }

            this.currentIndex = this.getNewRandomIndex();

        }
        else {
            //this.currentIndex++;
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
    }

    save(cue: IPlayListCue) {
        cue.fileName = [];

        this.files().forEach((file) => {
            (<string[]>cue.fileName).push(file);
        });

        cue.shuffle = this.shuffle();
        super.save(cue);
    }

    toggleShuffle() {
        this.shuffle(!this.shuffle());
    }

    inHistory(n: number): boolean {
        var found: boolean = false;
        this.history.forEach((value) => {
            if (n === value) {
                found = true;
                return;
            }
        });
        return found;
    }

    getNewRandomIndex(): number {

        var index: number;
        do {

            index = Math.floor((Math.random() * this.playlistCount));

            if (!this.inHistory(index))
                break;

        } while (true)

        return index;
    }
}