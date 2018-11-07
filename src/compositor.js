/*global require, setInterval*/
const SysTray  = require('systray').default;
const utils    = require('./utils');
const monitor  = require('./monitor.js');

const icons = {
    on:  utils.getBaseSixtyFour('./assets/compositor_on.png'),
    off: utils.getBaseSixtyFour('./assets/compositor_off.png')
};

const menu = {
    icon: icons.off,
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

monitor.events.compositor.up(() => {
    utils.menuIconUpdate(item, menu, icons.on);
});

monitor.events.compositor.down(() => {
    utils.menuIconUpdate(item, menu, icons.off);
});

monitor.init();
