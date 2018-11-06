/*global require, module, Buffer*/
const fs = require('fs');
const pub = {};

pub.getBaseSixtyFour = (file) => {
    return new Buffer(fs.readFileSync(file)).toString('base64');
};

module.exports = pub;
