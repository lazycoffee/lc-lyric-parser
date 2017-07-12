class LrcParser{
    constructor(lyric:string){
        if(!lyric){
            throw new Error('I cannot parse empty lyric string.')
        }
        let matchLeftBracket = lyric.match(/\[/g);
        let matchRightBracket = lyric.match(/\]/g);
        if(matchLeftBracket && matchRightBracket){
            if(matchLeftBracket.length > 5 && matchRightBracket.length > 5){
                this.hasTimeLine = true;
            }else{
                this.hasTimeLine = false;
                return;
            }
        }else{
            this.hasTimeLine = false;
            return;
        }
        this._lyric = lyric.replace(/^\?/, '');
        let lines = this._lyric.split(/\r?\n|\r/);
        let lrcInfo:string = '';
        for(let i = 0; i < lines.length; i++){
            let lineString = lines[i];
            if(!lineString.trim()){
                return;
            }
            let match = lineString.match(/^\[\D+:(.*)\]/);
            if(match && match[1]){
                lrcInfo += match[1] + '\n';
                lines.splice(i, 1);
                i--;
            }
        }
        if(lrcInfo){
            this.lines.push({
                time: 0,
                text: lrcInfo
            });
        }
        lines.forEach((lineString:string) => {
            if(!lineString.trim()){
                return;
            }
            let times = lineString.match(/\[([^\]]*)\]/g);
            let text = lineString.match(/.*](.*)$/)[1] || '';
            times.forEach((timeString) => {
                timeString = timeString.replace('[', '');
                timeString = timeString.replace(']', '');
                let timeArray = timeString.split(':');
                let time = (+timeArray[0]) * 60 + (+timeArray[1]);
                this.lines.push({
                    time: time,
                    text: text
                });
            });
        });
        this.lines.sort(function (a, b) {
            return a.time - b.time;
        });
        for(let i = 0; i < this.lines.length; i++){
            this.lines[i].index = i;
        }
    }
    public hasTimeLine:boolean;
    private _lyric:string;
    public lines:any[] = [];
    public currentTime:number = 0;
    private _intervalIndex:number = 0;
    private _currentIndex:number = -1;
    public isPlaying:boolean = false;
    play(currentTime:number, callback:(line:any)=>void){
        if(this.hasTimeLine === false){
            console.warn('Cannot play lyric with no time line.');
            return;
        }
        if(currentTime === undefined){
            this.currentTime = 0;
        }else{
            this.currentTime = currentTime;
        }
        if(this._intervalIndex !== 0){
            window.clearInterval(this._intervalIndex);
        }
        let startTime = Date.now();
        this.isPlaying = true;
        this._intervalIndex = window.setInterval(() => {
            let currentUnixTime = Date.now();
            let timeFlies = currentUnixTime - startTime;
            let playedTime = this.currentTime + timeFlies/1000;
            for(let i = 0; i < this.lines.length; i++){
                let isLast = i === this.lines.length - 1;
                if(this.lines[i].time < playedTime){
                    if(isLast === true || this.lines[i+1].time > playedTime){
                        if(this._currentIndex === i){
                            return;
                        }
                        this._currentIndex = i;
                        break;
                    }
                }
            }
            if(this._currentIndex === -1){
                return;
            }
            if(callback){
                callback(this.lines[this._currentIndex]);
                return;
            }
            if(this.playHandler){
                this.playHandler(this.lines[this._currentIndex]);
                return;
            }
            console.warn('No handler fired.');
        }, 100);
    }
    pause(){
        if(this.hasTimeLine === false){
            console.warn('Cannot pause lyric with no time line.');
            return;
        }
        this.isPlaying = false;
        this._currentIndex = -1;
        this._intervalIndex && window.clearInterval(this._intervalIndex);
        this._intervalIndex = 0;
    }
    fireHandler(){
        if(this._currentIndex === -1){
            console.warn('current no index, nothing I can do.');
            return;
        }
        if(!this.playHandler){
            console.warn('Do you forget setting handler?');
            return;
        }
        this.playHandler(this.lines[this._currentIndex]);
    }
    public playHandler:(line:any)=>void;
}
export = LrcParser;