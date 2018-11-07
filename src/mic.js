/*global require, setInterval*/
const SysTray  = require('systray').default;
const utils    = require('./utils');

const icons = {
    on:  utils.getBaseSixtyFour('./assets/mic_green.png'),
    off: utils.getBaseSixtyFour('./assets/mic_red.png')
};

const menu = {
    icon: icons.on,
    title: 'mic',
    tooltip: '',
    items: [{
        title: '',
        tooltip: '',
        checked: false,
        enabled: true
    }]
};

const item = new SysTray({ menu: menu, debug: false });

const monitor = require('./monitor.js');

monitor.events.mic.onMute(() => {
    utils.menuIconUpdate(item, menu, icons.off);
});

monitor.events.mic.onUnMute(() => {
    utils.menuIconUpdate(item, menu, icons.on);
});

monitor.init();
