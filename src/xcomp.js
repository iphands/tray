/*global require, setInterval*/
const SysTray  = require('systray').default;
const utils    = require('./utils');
const monitor  = require('./monitor.js');

const icons = {
    on:  utils.getBaseSixtyFour('./assets/xcomp_on.png'),
    off: utils.getBaseSixtyFour('./assets/xcomp_off.png')
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

monitor.events.xcomp.up(() => {
    menu.icon = icons.on;
    item.sendAction({
        type: 'update-menu',
        menu: menu
    });
});

monitor.events.xcomp.down(() => {
    menu.icon = icons.off;
    item.sendAction({
        type: 'update-menu',
        menu: menu
    });
});

monitor.init();
