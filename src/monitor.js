/*global module, require, setInterval*/
const cmd          = require('node-cmd');
const { snapshot } = require("process-list");

const priv = {
    xcomp: {},
    mic: {},
    vol: {
        regex: /.*?\[(.*?)%\] \[on\]$/
    },
    state: {
        xcomp: false,
        vol: false,
        mic: { muted: false }
    }
};

const pub  = {
    events: {
        xcomp: {},
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

pub.events.xcomp.up = (cb) => {
    priv.xcomp.up = () => {
        console.log('xcomp: up');
        cb();
    };
};

pub.events.xcomp.down = (cb) => {
    priv.xcomp.down = () => {
        console.log('xcomp: down');
        cb();
    };
};

priv.doXcomp = (bool) => {
    if (priv.state.xcomp === bool) { return; }
    priv.state.xcomp = bool;
    if (bool) {
        priv.xcomp.up();
    } else {
        priv.xcomp.down(bool);
    }
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
        const pct = line.match(priv.vol.regex)[1];
        if (priv.state.vol !== pct) {
            priv.vol.onChange(pct);
        }
    }
};

priv.amixerHandler = (err, data, stderr) => {
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

priv.psHandler = (tasks) => {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].name.indexOf('xcomp') === 0) {
            priv.doXcomp(true);
            return;
        }
    }
    priv.doXcomp(false);
    return;
};

pub.init = () => {
    if (!priv.state.running) {
        setInterval(() => {
            // console.time('cmd took');
            cmd.get('amixer -n', priv.amixerHandler);
            snapshot('name').then(priv.psHandler);
        }, 500);
    }
    priv.state.running = true;
};

module.exports = pub;
