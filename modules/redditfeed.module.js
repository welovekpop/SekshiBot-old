var Snoocore = require("snoocore");
var when = require("when");

function RedditFeed(bot) {
    this.bot = bot;

    bot.config.defaults({
        "subreddits": [],
        "interval": 300,
        "format": "%feed | %title by %submitter | %link"
    });

    this.timer = {};
    this.settings = this.bot.config.get();
    this.reddit = new Snoocore({ userAgent: "RedditFeed v" + this.version + "by /u/schrobby" });
    this.lastPost = "";

    if (this.areSettingsValid())
    	this.runTimer();
}

RedditFeed.prototype.name = "RedditFeed";
RedditFeed.prototype.author = "schrobby";
RedditFeed.prototype.version = "0.1";
RedditFeed.prototype.description = "Announces new submissions from a configurable list of subreddits.";

RedditFeed.prototype.runTimer = function() {
	var subs = this.settings["subreddits"];
	var promises = [];
	var posts = [];
	var reqs = [];
	var chunk = 50;

	for (var i=0, j=subs.length; i<j; i+=chunk) {
		reqs.push(subs.slice(i, i+chunk).join('+'));
	}

	reqs.forEach(function(uri) {
		var promise = reddit("/r/$subreddits/new").listing({
			$subreddits: uri,
			before: this.lastPost,
			limit: 100
		}).then(function(result) {
			posts.concat(results.children);
		});

		promises.push(promise);
	}.bind(this));

	when.all(promises).then(function() {
		if (!this.lastPost) return;

		/*@TODO: post listing to chat*/
	}.bind(this))

	if (posts.length > 0)
		this.lastPost = posts[0].data.name; 
	/*@TODO: find a way to reliably get the most recent post */
}

RedditFeed.prototype.areSettingsValid = function(settings) {
	settings = settings || this.settings;
	var valid = true;

	Object.keys(this.settings).forEach(function(key) {
		if (this.settings[key] instanceof Array && this.settings[key].join('').length === 0)
			valid = false;
		else if (typeof this.settings[key] === "string" && this.settings[key].length === 0)
			valid = false;
		else if (typeof this.settings[key] === "number" && this.settings[key] <= 0)
			valid = false;
	}.bind(this));

	return valid;
}

module.exports = RedditFeed;