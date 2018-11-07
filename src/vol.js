/*global require, setInterval*/
const SysTray  = require('systray').default;
const utils    = require('./utils');
const priv     = {};

const icons = {
    full: utils.getBaseSixtyFour('./assets/vol_full.png'),
    med:  utils.getBaseSixtyFour('./assets/vol_med.png'),
    low:  utils.getBaseSixtyFour('./assets/vol_low.png'),
    mute: utils.getBaseSixtyFour('./assets/vol_mute.png')
};

const menu = {
    icon: icons.mute,
    title: 'vol',
    tooltip: '',
    items: [{
        title: '',
        tooltip: '',
        checked: false,
        enabled: true
    }]
};

const item = new SysTray({ menu: menu, debug: false });
item.onError(err => {
    console.log(err);
});

const monitor = require('./monitor.js');

monitor.events.vol.onMute(() => {
    menu.icon = icons.mute;
    item.sendAction({ type: 'update-menu', menu: menu });
});

priv.getIcon = (num) => {
    if (num < 10) { return 'mute'; }
    if (num < 35) { return 'low'; }
    if (num < 75) { return 'med'; }
    return 'full';
};

monitor.events.vol.onChange((num) => {
    const key = priv.getIcon(num);
    console.log(key);
    utils.menuIconUpdate(item, menu, icons[key]);
});

monitor.init();
