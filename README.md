# [lc-lyric-parser](https://lazycoffee.github.io/lc-lyric-parser)
A simple and easy-to-use lyric parser.

## Install

```bash
npm i lc-lyric-parser --save
```

## Usage
```lc-lyric-parser``` follow LRC format stander.
### Example
```javascript
const LyricParser = require('lc-lyric-parser');
let audio = new Audio();
// you should use ajax to get lyricString instead
let lyricString = `
[ti:会呼吸的痛]
[ar:梁静茹]
[al:崇拜]
[by:Creator]
[00:13.03]Lyric Creator
[01:53.90][00:00.61]
[04:20.51][01:54.84][00:02.30]梁静茹-会呼吸的痛
[00:05.86]作词：姚若龙 作曲：宇恒
[00:08.66]编曲：黄中岳/安栋
[04:26.99][01:47.93]专辑：崇拜
`;
let lyricParser = new LyricParser(lyricString);
lyricParser.lines.forEach(function(line){
    // add line to your document
});
lyricParser.handler = function(line){
    // switch lyric line by line.index
};
audio.addEventListener('play', function () {
    if(lyricParser && lyricParser.hasTimeLine){
        lyricParser.play(audio.currentTime);
    }
});
audio.addEventListener('pause', function () {
    if(lyricParser && lyricParser.hasTimeLine){
        lyricParser.pause();
    }
});
audio.play();
```
## API
```lc-lyric-parser``` only has few api. I design it as easy and simple.

### play(audioCurrentTime)
```lc-lyric-parser``` just like Audio object. You just need to play it and it will tell you where the current line of lyric. You need to pass a time of current audio play point to tell ```lc-lyric-parser``` where the current time of audio.

### pause()
There is no ```stop``` function. The only way you can stop ```lc-lyric-parser``` is using ```pause``` function.

## Property
```lc-lyric-parser``` supply some useful properties.

### lines
```lc-lyric-parser``` will parse lyric string and push it to ```lines``` property. Each line has these properties:

```
lyricParser.lines.forEach(line){
    // line.index: the index(number) of current line
    // line.time:  the time(number) of current line
    // line.text:  the lyric text (string) of current line
}
```
### isPlaying
If you want to know whether it is playing. This property will tell you the status of playing.

### hasTimeLine
Some lyric file dose't have time line. If don't, this property will be false. Don't play lyric with no time line.

## Licence
MIT
