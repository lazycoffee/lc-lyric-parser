declare class LrcParser {
    constructor(lyric: string);
    hasTimeLine: boolean;
    private _lyric;
    lines: any[];
    currentTime: number;
    private _intervalIndex;
    private _currentIndex;
    isPlaying: boolean;
    play(currentTime: number, callback: (line: any) => void): void;
    pause(): void;
    fireHandler(): void;
    playHandler: (line: any) => void;
}
export = LrcParser;
