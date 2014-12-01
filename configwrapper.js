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

ConfigWrapper.prototype.add = function(type, options) {
    config.add(this.add.caller.name.toLowerCase(), { type: type, store: options });
};

ConfigWrapper.prototype.remove = function() {
    config.remove(this.remove.caller.name.toLowerCase());
};

ConfigWrapper.prototype.file = function(file) {
    config.file(file);
};

ConfigWrapper.prototype.save = function(callback) {
    callback = callback || function() {};

    config.save(callback);
};

ConfigWrapper.prototype.set = function(key, value) {
    var space = this.set.caller.name.toLowerCase();

    config.set(space + ':' + key, option);
};

ConfigWrapper.prototype.get = function(key) {
    var space = this.get.caller.name.toLowerCase();

    return config.get(key ? key : space);
};

module.exports = ConfigWrapper;
