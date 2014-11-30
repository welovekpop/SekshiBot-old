var nconf = require("nconf");
var config = new nconf.Provider();

function ConfigWrapper() {

}

ConfigWrapper.prototype.defaults = function(options) {
    var obj = {};
    obj[this.defaults.caller.name.toLowerCase()] = options;

    config.defaults(obj);
};

ConfigWrapper.prototype.overrides = function(options) {
    var obj = {};
    obj[this.overrides.caller.name.toLowerCase()] = options;

    config.overrides(obj);
};

ConfigWrapper.prototype.file = function(file) {
    config.file(file);
};

ConfigWrapper.prototype.set = function(option) {
    var key = this.set.caller.name.toLowerCase();

    config.set(key + ':' + option);
};

ConfigWrapper.prototype.get = function(option) {
    var key = this.get.caller.name.toLowerCase();

    return config.get(option ? option : key);
};

module.exports = ConfigWrapper;
