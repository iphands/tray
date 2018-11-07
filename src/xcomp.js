/*global require, setInterval*/
const SysTray  = require('systray').default;
const utils    = require('./utils');
const monitor  = require('./monitor.js');

const icons = {
    on:  utils.getBaseSixtyFour('./assets/xcomp_on.png'),
    off: utils.getBaseSixtyFour('./assets/xcomp_off.png')
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

monitor.events.xcomp.up(() => {
    utils.menuIconUpdate(item, menu, icons.on);
});

monitor.events.xcomp.down(() => {
    utils.menuIconUpdate(item, menu, icons.off);
});

monitor.init();
