/*global module, require, setInterval*/
const cmd  = require('node-cmd');

const priv = {
    state: { muted: false }
};

const pub  = {
    events: {}
};

pub.events.onMute = (cb) => {
    priv.onMute = () => {
        console.log('mute');
        priv.state.muted = true;
        cb();
    };
};

pub.events.onUnMute = (cb) => {
    priv.onUnMute = () => {
        console.log('unmute');
        priv.state.muted = false;
        cb();
    };
};

priv.handler = (err, data, stderr) => {
    // console.timeEnd('cmd took');
    for (const line of data.split('\n')) {
        if (line.indexOf('  Mono: Capture') === 0) {
              if (line.indexOf('[off]') !== -1) {
                if (priv.onMute && priv.state.muted === false) {
                    priv.onMute();
                }
            } else {
                if (priv.onUnMute && priv.state.muted === true) {
                    priv.onUnMute();
                }
            }
        }
    }
};

pub.init = () => {
    if (!priv.state.running) {
        setInterval(() => {
            // console.time('cmd took');
            cmd.get('amixer -n', priv.handler);
        }, 300);
    }
    priv.state.running = true;
};

module.exports = pub;
