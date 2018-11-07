/*global require, module, Buffer*/
const fs = require('fs');
const rm = require('rimraf');
const pub = {};

pub.menuIconUpdate = (item, menu, icon) => {
    rm('/tmp/systray_*', () => {
        menu.icon = icon;
        item.sendAction({
            type: 'update-menu',
            menu: menu
        });
    });
};

pub.getBaseSixtyFour = (file) => {
    return new Buffer(fs.readFileSync(file)).toString('base64');
};

module.exports = pub;
