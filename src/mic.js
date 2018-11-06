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
    tooltip: 'Tips',
    items: [{
        title: '',
        tooltip: '',
        checked: false,
        enabled: true
    }]
};

const item = new SysTray({ menu: menu, debug: false });

const monitor = require('./monitor.js');

monitor.events.onMute(() => {
    menu.icon = icons.off;
    item.sendAction({
        type: 'update-menu',
        menu: menu
    });
});

monitor.events.onUnMute(() => {
    menu.icon = icons.on;
    item.sendAction({
        type: 'update-menu',
        menu: menu
    });
});

monitor.init();
