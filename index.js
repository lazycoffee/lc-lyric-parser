"use strict";
var LrcParser = (function () {
    function LrcParser(lyric) {
        var _this = this;
        this.lines = [];
        this.currentTime = 0;
        this._intervalIndex = 0;
        this._currentIndex = -1;
        this.isPlaying = false;
        if (!lyric) {
            throw new Error('I cannot parse empty lyric string.');
        }
        var matchLeftBracket = lyric.match(/\[/g);
        var matchRightBracket = lyric.match(/\]/g);
        if (matchLeftBracket && matchRightBracket) {
            if (matchLeftBracket.length > 5 && matchRightBracket.length > 5) {
                this.hasTimeLine = true;
            }
            else {
                this.hasTimeLine = false;
                return;
            }
        }
        else {
            this.hasTimeLine = false;
            return;
        }
        this._lyric = lyric.replace(/^\?/, '');
        var lines = this._lyric.split(/\r?\n|\r/);
        var lrcInfo = '';
        for (var i = 0; i < lines.length; i++) {
            var lineString = lines[i];
            if (!lineString.trim()) {
                return;
            }
            var match = lineString.match(/^\[\D+:(.*)\]/);
            if (match && match[1]) {
                lrcInfo += match[1] + '\n';
                lines.splice(i, 1);
                i--;
            }
        }
        if (lrcInfo) {
            this.lines.push({
                time: 0,
                text: lrcInfo
            });
        }
        lines.forEach(function (lineString) {
            if (!lineString.trim()) {
                return;
            }
            var times = lineString.match(/\[([^\]]*)\]/g);
            var text = lineString.match(/.*](.*)$/)[1] || '';
            times.forEach(function (timeString) {
                timeString = timeString.replace('[', '');
                timeString = timeString.replace(']', '');
                var timeArray = timeString.split(':');
                var time = (+timeArray[0]) * 60 + (+timeArray[1]);
                _this.lines.push({
                    time: time,
                    text: text
                });
            });
        });
        this.lines.sort(function (a, b) {
            return a.time - b.time;
        });
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].index = i;
        }
    }
    LrcParser.prototype.play = function (currentTime, callback) {
        var _this = this;
        if (this.hasTimeLine === false) {
            console.warn('Cannot play lyric with no time line.');
            return;
        }
        if (currentTime === undefined) {
            this.currentTime = 0;
        }
        else {
            this.currentTime = currentTime;
        }
        if (this._intervalIndex !== 0) {
            window.clearInterval(this._intervalIndex);
        }
        var startTime = Date.now();
        this.isPlaying = true;
        this._intervalIndex = window.setInterval(function () {
            var currentUnixTime = Date.now();
            var timeFlies = currentUnixTime - startTime;
            var playedTime = _this.currentTime + timeFlies / 1000;
            for (var i = 0; i < _this.lines.length; i++) {
                var isLast = i === _this.lines.length - 1;
                if (_this.lines[i].time < playedTime) {
                    if (isLast === true || _this.lines[i + 1].time > playedTime) {
                        if (_this._currentIndex === i) {
                            return;
                        }
                        _this._currentIndex = i;
                        break;
                    }
                }
            }
            if (_this._currentIndex === -1) {
                return;
            }
            if (callback) {
                callback(_this.lines[_this._currentIndex]);
                return;
            }
            if (_this.playHandler) {
                _this.playHandler(_this.lines[_this._currentIndex]);
                return;
            }
            console.warn('No handler fired.');
        }, 100);
    };
    LrcParser.prototype.pause = function () {
        if (this.hasTimeLine === false) {
            console.warn('Cannot pause lyric with no time line.');
            return;
        }
        this.isPlaying = false;
        this._currentIndex = -1;
        this._intervalIndex && window.clearInterval(this._intervalIndex);
        this._intervalIndex = 0;
    };
    LrcParser.prototype.fireHandler = function () {
        if (this._currentIndex === -1) {
            console.warn('current no index, nothing I can do.');
            return;
        }
        if (!this.playHandler) {
            console.warn('Do you forget setting handler?');
            return;
        }
        this.playHandler(this.lines[this._currentIndex]);
    };
    return LrcParser;
}());
module.exports = LrcParser;
