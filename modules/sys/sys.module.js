function SysMod(sekshi) {
    this.sekshi = sekshi;

    this.permission = {
        "moduleinfo": sekshi.USERROLE.COHOST,
        "listmodules": sekshi.USERROLE.COHOST
    };
}

SysMod.prototype.moduleinfo = function(user, modulename) {
    for(var i = 0, l = this.sekshi.modules.length; i < l; i++) {
        if(this.sekshi.modules[i].info.name === modulename) {
            this.sekshi.sendChat([
                '@', user.username, " module information about : ", this.sekshi.modules[i].info.name,
                " version: ", this.sekshi.modules[i].info.version,
                " author: ", this.sekshi.modules[i].info.author,
                " description: ", this.sekshi.modules[i].info.description
                ].join(''));
            return;
        }
    }

    this.sekshi.sendChat(["no module called '", modulename, "' found."].join(''));
};

SysMod.prototype.listmodules = function(user) {
    var mods = [];

    console.log(this.sekshi.modules.length);

    for(var i = 0, l = this.sekshi.modules.length; i < l; i++)
        mods.push(this.sekshi.modules[i].info.name);

    this.sekshi.sendChat(mods.join("; "));
};

SysMod.prototype.disablemodule = function(user, modulename) {
    for(var i = 0, l = this.sekshi.modules.length; i < l; i++) {
        if(this.sekshi.modules[i].info.name === modulename)
            this.sekshi.modules[i].enabled = false;
    }
};

module.exports = SysMod;