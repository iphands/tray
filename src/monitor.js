/*global module, require, setInterval*/
const cmd  = require('node-cmd');

const priv = {
    mic: {},
    vol: {},
    state: {
        vol: false,
        mic: { muted: false }
    }
};

const pub  = {
    events: {
        mic: {},
        vol: {}
    }
};

pub.events.mic.onMute = (cb) => {
    priv.mic.onMute = () => {
        console.log('mic: mute');
        priv.state.mic.muted = true;
        cb();
    };
};

pub.events.mic.onUnMute = (cb) => {
    priv.mic.onUnMute = () => {
        console.log('mic: unmute');
        priv.state.mic.muted = false;
        cb();
    };
};

pub.events.vol.onMute = (cb) => {
    priv.vol.onMute = () => {
        console.log('vol: mute');
        cb();
    };
};

pub.events.vol.onChange = (cb) => {
    priv.vol.onChange = (num) => {
        console.log(`vol: ${num}`);
        cb(num);
        priv.state.vol = num;
    };
};

priv.doMic = (line) => {
    if (line.indexOf('[off]') !== -1) {
        if (priv.mic.onMute && priv.state.mic.muted === false) {
            priv.mic.onMute();
        }
    } else {
        if (priv.mic.onUnMute && priv.state.mic.muted === true) {
            priv.mic.onUnMute();
        }
    }
};

priv.doVolume = (line) => {
    if (line.indexOf('[off]') !== -1) {
        priv.vol.onMute();
    } else {
        const pct = line.match(/.*?\[(.*?)%\] \[on\]$/)[1];
        if (priv.state.vol !== pct) {
            priv.vol.onChange(pct);
        }
    }
};

priv.handler = (err, data, stderr) => {
    // console.timeEnd('cmd took');
    for (const line of data.split('\n')) {
        if (line.indexOf('  Front Left: Playback') === 0) {
            priv.doVolume(line);
        }

        if (line.indexOf('  Mono: Capture') === 0) {
            priv.doMic(line);
        }
    }
};

pub.init = () => {
    if (!priv.state.running) {
        setInterval(() => {
            // console.time('cmd took');
            cmd.get('amixer -n', priv.handler);
        }, 500);
    }
    priv.state.running = true;
};

module.exports = pub;
