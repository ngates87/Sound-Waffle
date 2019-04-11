interface ICue {
    fileName: string | string[];
    loop: boolean;
    volume: number;
    fadeTime: number;
}

interface IPlayListCue extends ICue {
    shuffle: boolean;
}


class Cue implements ICue {
    fileName: string | string[];
    loop: boolean;
    volume: number;
    fadeTime: number;
}

class ShowFile {

    ShowName: string;

    Cues: Cue[] = [];

}