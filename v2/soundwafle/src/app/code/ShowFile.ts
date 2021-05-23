export interface ICue {
    fileName: string | string[];
    loop: boolean;
    volume: number;
    fadeTime: number;
}

export interface IPlayListCue extends ICue {
    shuffle: boolean;
}


export class Cue implements ICue {
    fileName: string | string[];
    loop: boolean;
    volume: number;
    fadeTime: number;
}

export class ShowFile {

    ShowName: string;

    Cues: Cue[] = [];
}
