/*global module, require, setInterval*/
const cmd          = require('node-cmd');
const { snapshot } = require("process-list");

const priv = {
    compositor: {},
    mic: {},
    vol: {
        regex: /.*?\[(.*?)%\] \[on\]$/
    },
    state: {
        compositor: false,
        vol: false,
        mic: { muted: false }
    }
};

const pub  = {
    events: {
        compositor: {},
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

pub.events.compositor.up = (cb) => {
    priv.compositor.up = () => {
        console.log('compositor: up');
        cb();
    };
};

pub.events.compositor.down = (cb) => {
    priv.compositor.down = () => {
        console.log('compositor: down');
        cb();
    };
};

priv.doCompositor = (bool) => {
    if (priv.state.compositor === bool) { return; }
    priv.state.compositor = bool;
    if (bool) {
        priv.compositor.up();
    } else {
        priv.compositor.down(bool);
    }
};

priv.doMic = (line) => {
    if (line.indexOf('	Mute: yes') !== -1) {
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
    const lines = data.split('\n');
    for (const [ i, line ] of lines.entries()) {
        // if (line.indexOf('  Front Left: Playback') === 0) {
        //     priv.doVolume(line);
        // }

        if (line.indexOf('	Description: HD Webcam C615 Analog Mono') === 0) {
            priv.doMic(lines[i+5]);
        }
    }
};

priv.psHandler = (tasks) => {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].name.indexOf('compton') === 0) {
            priv.doCompositor(true);
            return;
        }
    }
    priv.doCompositor(false);
    return;
};

pub.init = () => {
    if (!priv.state.running) {
        setInterval(() => {
            // console.time('cmd took');
            cmd.get('pactl list', priv.amixerHandler);
            snapshot('name').then(priv.psHandler);
        }, 1000);
    }
    priv.state.running = true;
};

module.exports = pub;
