function Misc(bot) {
    this.bot = bot;

    this.permissions = {
        "dc": bot.USERROLE.NONE
    };
    this.positionList = {};

    /*@TODO: only init positions once the bot is connected to a room*/
    this.initPositions();
    this.bot.on(this.bot.ADVANCE, this._onAdvance.bind(this));
}

Misc.prototype.destroy = function() {
    this.bot.removeListener(this.bot.ADVANCE, this._onAdvance.bind(this));
}

Misc.prototype.name = "Misc";
Misc.prototype.author = "schrobby";
Misc.prototype.version = "0.1";
Misc.prototype.description = "Miscellaneous user and mod commands.";

Misc.prototype.dc = function(user) {
    if (this.positionList.hasOwnProperty(user.id) && this.positionList[user.id]) {
        if (!this.bot.isWaitlistLocked()) {
            if (this.bot.getWaitlist().indexOf(user.id) === -1)
                this.bot.addToWaitlist(user.id);

            this.bot.moveDJ(user.id, this.positionList[user.id].pos, function(err) {
                if (err)
                    this.bot.sendChat([
                        '@', user.username, " Error while moving you to position ", this.positionList[user.id].pos, ": ", err.message
                        ].join(''));
            }.bind(this));
        }
        else {
            this.bot.sendChat([
                '@', user.username, " The waitlist is currently locked. Try again at a later time"
                ].join(''));
        }
    }
    else {
        this.bot.sendChat(['@', user.username, " Your position in the waitlist has expired"].join(''));
    }
}

Misc.prototype._onAdvance = function(booth, now, prev) {
    var time = Date.now();

    booth.waitlist.forEach(function(id, pos) {
        var entry = {};
        entry.pos = pos;
        entry.time = time;

        this.positionList[id] = entry;
    }.bind(this));

    console.info("booth: " + booth.dj);
    if (this.positionList.hasOwnProperty(booth.dj) && this.positionList[booth.dj]) {
        delete this.positionList[booth.dj];
    }   

    this.clearOldPositions();
    console.info(this.positionList);
}

Misc.prototype.initPositions = function() {
    var time = Date.now();
    var waitlist = this.bot.getWaitlist();
    var dj = waitlist[0];

    waitlist.forEach(function (id, pos) {
        var entry = {};
        entry.pos = pos;
        entry.time = time;

        this.positionList[id] = entry;
    }.bind(this));   

    console.info(this.positionList);
}

Misc.prototype.clearOldPositions = function(age) {
    age = age || 600000;

    for (id in this.positionList) {
        if (this.positionList.hasOwnProperty(id) && this.positionList[id]) {
            if ((Date.now() - this.positionList[id].time) > age)
                delete this.positionList[id];
        }
    }
}

module.exports = Misc;