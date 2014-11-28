function SysMod(sekshi) {
    this.sekshi = sekshi;

    this.permissions = {
        "moduleinfo": sekshi.USERROLE.COHOST,
        "listmodules": sekshi.USERROLE.COHOST
    };
}

SysMod.prototype.name = "System Module";
SysMod.prototype.author = "Sooyou";
SysMod.prototype.version = "0.1.1";
SysMod.prototype.description = "Base Module";

SysMod.prototype.moduleinfo = function(user, modulename) {
    for(var i = 0, l = this.sekshi.modules.length; i < l; i++) {
        if(this.sekshi.modules[i].module.name === modulename) {
            this.sekshi.sendChat([
                '@', user.username, " module information about : ", this.sekshi.modules[i].module.name,
                " version: ", this.sekshi.modules[i].module.version,
                " author: ", this.sekshi.modules[i].module.author,
                " description: ", this.sekshi.modules[i].module.description
                ].join(''));
            return;
        }
    }

    this.sekshi.sendChat(["no module called '", modulename, "' found."].join(''));
};

SysMod.prototype.listmodules = function(user) {
    var mods = [];

    for(var i = 0, l = this.sekshi.modules.length; i < l; i++)
        mods.push(this.sekshi.modules[i].module.name);

    this.sekshi.sendChat(mods.join("; "));
};

SysMod.prototype.disablemodule = function(user, modulename) {
    for(var i = 0, l = this.sekshi.modules.length; i < l; i++) {
        if(this.sekshi.modules[i].info.name === modulename)
            this.sekshi.modules[i].enabled = false;
    }
};

module.exports = SysMod;