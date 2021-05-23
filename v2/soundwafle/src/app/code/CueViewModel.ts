// tslint:variable-name
import { ICue, IPlayListCue } from './ShowFile';

const path = require('path');


enum CurrentState {
    Playing,
    Paused,
    Stopped,
}


// should consider making CueVM and PlaylistCueVM one and the same? Isn't a single cue,just a playlist with one song?
export abstract class BaseCueViewModel {

    protected playIcon = 'fa-play';
    protected player: HTMLAudioElement = new Audio();
    protected displayName = '';
    protected fileName = '';
    protected icon = this.playIcon;
    protected progress = 0;
    protected progressNormalize = 0;

    protected get loop() {
        return this._loop;
    }

    protected set loop(val: boolean) {
        this.setLoop(val);
    }


    public get volume(): number {
        return this._volume;
    }

    public set volume(newValue: number) {
        this._volume = newValue;
        if (this.player) {
            this.player.volume = newValue / 100;
        }
    }

    private _state = CurrentState.Stopped;
    public get state() {
        return this._state;
    }

    public set state(newValue) {
        if (newValue === CurrentState.Playing) {
            this.icon = 'fa-pause';
        }
        else if (newValue === CurrentState.Paused || newValue === CurrentState.Stopped) {
            this.icon = this.playIcon;
        }
        else {
            // this.icon("fa-stop");
        }
    }


    private _src: string;
    public get src(): string {
        return this._src;
    }
    public set src(v: string) {
        this._src = v;
        this.player.src = v;

    }



    constructor(protected _loop: boolean = false, protected _volume: number = 100, protected fadeTime: number = 1.0) {

        this.player.onended = () => {
            this.onEnd();
        };

        // this.loop(loop);
        // this.volume(volume);
        // this.fadeTime(fadeTime);

        this.player.ontimeupdate = (ev: Event) => {
            this.progress = this.player.currentTime / this.player.duration;
            this.progressNormalize = this.progress * 100;

        };


    }

    private get IsPlaying() {
        return this.state === CurrentState.Playing;
    }

    onEnd(): void {
        this.state = CurrentState.Stopped;
    }

    setLoop(newVal: boolean) { }

    public fade() {
        this.fadeOut(this.fadeTime * 1000);
    }

    fadeOut(timeMs: number) {
        // $(this.player).animate({ volume: 0.0 }, {
        //     duration: timeMs,
        //     done: () => {
        //         this.stop();
        //     }// ,
        // });
    }

    stop() {
        this.player.pause();
        const e: HTMLAudioElement = this.player;
        e.currentTime = 0;
        this.state = CurrentState.Stopped;
    }

    isPaused(): boolean {
        return this.state === CurrentState.Paused;
    }

    isStopped(): boolean {
        return this.state === CurrentState.Stopped;
    }

    public play() {
        if (this.isStopped() || this.isPaused()) {
            this.playCurrent();
        } else {
            this.player.pause();
            this.state = CurrentState.Paused;
        }
    }

    protected playCurrent() {
        this.player.volume = this.volume / 100;
        this.player.play();
        this.state = CurrentState.Playing;
    }

    save(cue: ICue) {
        cue.loop = this.loop;
        cue.volume = this.volume;
        cue.fadeTime = this.fadeTime;
    }
}

export class CueViewModel extends BaseCueViewModel {

    constructor(f: string, loop: boolean = false, volume: number = 100, fadeTime: number = 1) {
        super(loop, volume, fadeTime);
        this.src = f;
        this.fileName = f;
        this.displayName = path.basename(this.fileName);
    }

    save(cue: ICue) {
        cue.fileName = this.fileName;
        super.save(cue);
    }

    setLoop(newVal: boolean) {
        this.player.loop = newVal;
    }
}


export class PlaylistCueViewModel extends BaseCueViewModel {

    private files = [];
    private currentIndex = 0;
    private playlistCount: number;
    private shuffle = false;

    private history: number[] = [];

    constructor(files: string[], loop: boolean = false, shuffle: boolean = false, volume: number = 100, fadeTime: number = 1) {
        super(loop, volume, fadeTime);

        if (files) {
            files.forEach((file) => {
                this.files.push(file);
            });

            if (this.files?.length) {
                this.setCurrentPlayFile(0);
            }
        }

        this.shuffle = shuffle;
    }

    getDisplayString(file: string): string {
        return path.basename(file);
    }

    playAt(index: number) {
        this.setCurrentPlayFile(index);
        console.log('Play At: ', index);
        this.history.push(index);
        this.play();
    }

    isPlaying(data) {
        return data === this.src && this.state === CurrentState.Playing;
    }

    setCurrentPlayFile(index: number) {
        const file = this.files[index];
        this.fileName = file;

        if (!(this.src.indexOf(file) > -1)) {
            this.state = CurrentState.Stopped;
            this.src = file;

            this.displayName = path.basename(this.fileName);
        }

        this.playlistCount = this.files.length;
    }

    removeItem(index: number) {
        this.files.splice(index, 1);
    }

    onEnd(): void {

        let atEnd = false;

        if (this.shuffle) {

            atEnd = this.history.length >= this.playlistCount;


            if (atEnd) {
                this.history = [];
            }

            this.currentIndex = this.getNewRandomIndex();

        }
        else {
            // this.currentIndex++;
            atEnd = this.currentIndex === this.playlistCount - 1;


            if (atEnd) {
                this.currentIndex = 0;
            }
        }

        if (atEnd && !this.loop) {
            this.src = '';
            return;
        }

        this.setCurrentPlayFile(this.currentIndex);

        this.playAt(this.currentIndex);
    }

    save(cue: IPlayListCue) {
        cue.fileName = [];

        this.files.forEach((file) => {
            (cue.fileName as string[]).push(file);
        });

        cue.shuffle = this.shuffle;
        super.save(cue);
    }

    toggleShuffle() {
        this.shuffle = !this.shuffle;
    }

    inHistory(n: number): boolean {
        let found = false;
        this.history.forEach((value) => {
            if (n === value) {
                found = true;
                return;
            }
        });
        return found;
    }

    getNewRandomIndex(): number {

        let index: number;
        do {

            index = Math.floor((Math.random() * this.playlistCount));

            if (!this.inHistory(index)) {
                break;
            }

        } while (true);

        return index;
    }
}
