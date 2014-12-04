var Snoocore = require("snoocore");
var when = require("when");
var util = require("util");

function RedditFeed(bot) {
    this.bot = bot;

    bot.config.defaults({
        "subreddits": [],
        "interval": 300000,
        "format": "%feed | %title by %submitter | %link"
    });

    this.timer = {};
    this.settings = this.bot.config.get();
    this.reddit = new Snoocore({ userAgent: "RedditFeed v" + this.version + "by /u/schrobby" });
    this.lastPost = "";

    if (this.areSettingsValid())
        this.timer = setTimeout(this.runTimer.bind(this), 0);
}

RedditFeed.prototype.destroy = function() {
    if (this.timer)    
        clearTimeout(this.timer);
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
        var promise = this.reddit("/r/$subreddit/new").listing({
            $subreddit: uri,
            before: this.lastPost,
            limit: 100
        }).then(function(result) {
            posts = posts.concat(result.children);
        }).catch(function(error) {
            console.error(error);
        });

        promises.push(promise);
    }.bind(this));

    when.all(promises).then(function() {
        if (this.lastPost) {
            /*@TODO: post listing to chat*/
            //console.info(posts);
        }

        if (posts.length > 0)
            /*@TODO: find a way to reliably get the most recent post */
            this.lastPost = posts[0].data.name;

        this.timer = setTimeout(this.runTimer.bind(this), this.settings["interval"]);
    }.bind(this))
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