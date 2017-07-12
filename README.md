# lc-lyric-parser
A simple and easy-to-use lyric parser.

## install

```bash
npm i lc-lyric-parser --save
```

## usage

```javascript
const LyricParser = require('lc-lyric-parser');
let audio = new Audio();
// you can use ajax to get lyric file
let lyricString = `
[ti:会呼吸的痛]
[ar:梁静茹]
[al:崇拜]
[by:dumbbird]
[00:13.03]Dumbbird@虾米歌词组制作
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
