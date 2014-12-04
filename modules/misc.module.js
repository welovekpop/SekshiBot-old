function Misc(bot) {
	this.bot = bot;

	this.permissions = {
		"dc": bot.USERROLE.NONE
	};
	this.positionList = {};

	/*@TODO: only init positions once the bot is connected to a room*/
	this.initPositions();
	this.bot.on(bot.ADVANCE, this._onAdvance.bind(this));
}

Misc.prototype.name = "Misc";
Misc.prototype.author = "schrobby";
Misc.prototype.version = "0.1";
Misc.prototype.description = "Miscellaneous user and mod commands.";

Misc.prototype.dc = function(user) {
	if (this.positionList.hasOwnProperty(user.id) && this.positionList[user.id]) {
		if (!this.bot.isWaitlistLocked()) {
			this.bot.moveDJ(user.id, this.positionList[user.id].pos, function(err) {
				if (err)
					this.bot.sendChat([
						'@', user.username, " Error while moving you to position ", this.positionList[booth.dj], ": ", err
						].join(''));
			});
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

	if (this.positionList.hasOwnProperty(booth.dj) && this.positionList[booth.dj]) {
		delete this.positionList[id];
		/*@TODO: properly delete user from list*/
	}	

	this.clearOldPositions();
	console.info(this.positionList);
}

Misc.prototype.initPositions = function() {
	var time = Date.now();

	this.bot.getWaitlist().forEach(function (id, pos) {
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