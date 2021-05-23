///// <reference path="./../typings/github-electron/github-electron.d.ts" />
///// <reference path="./../typings/jquery/jquery.d.ts" />

//enum CurrentState {
//    Playing,
//    Paused,
//    Stopped,
//}

//class AudioPlayer {

//    //private play = require('audio-play');
//    private $ = require('jquery');
//    private player:HTMLAudioElement = null;
//    private state: CurrentState = CurrentState.Stopped;
//    private _loop: boolean = false;

   

//    public set loop(loop: boolean) {
//        this.player.loop = loop;
//    }

//    public set volume(v: number) {
//        // this._volume = v;

//        console.log("volume: " + v / 100);
//        this.player.volume = v / 100;
//    }

//    constructor(onEnd:()=>void = null, fileName: string = "", loop: boolean = false, volume: number = 100) {


//        this.player = new Audio(fileName);

//        //this.player = this.play(fileName).preload().on('ended', () => {
//        //    this.stop();

//        //    if(onEnd)
//        //        onEnd();    
//        //});
//        this.loop = loop;
//        this.volume = volume;
//    }

//    src(fileName: string) {
//        //this.player.src(fileName);

//        this.player.src = fileName;
//    }

//    playFile(/*fileName: string*/) {

//        this.player.play();
//        //this.player.play().volume(1.0);
//        this.state = CurrentState.Playing;
//    }

//    pause() {
//        this.player.pause();
//        this.state = CurrentState.Paused;
//    }

//    fadeOut(timeMs: number) {
//        this.$(this.player).animate({ volume: 0.0 }, {
//            duration: timeMs,
//            done: () => {
//                this.stop();
//            }
//        });
//    }

//    stop() {
//        this.player.pause();
//        var e: HTMLAudioElement = this.player;
//        e.currentTime = 0;
//        this.state = CurrentState.Stopped;
//    }

//    isPlaying(): boolean {
//        return this.state === CurrentState.Playing;
//    }

//    isPaused(): boolean {
//        return this.state === CurrentState.Paused;
//    }

//    isStopped(): boolean {
//        return this.state === CurrentState.Stopped;
//    }

//    removeDom() {
//        $(this.player).remove();
//        this.player = null;
//    }
//}