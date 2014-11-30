function RedditFeed(bot) {
    this.bot = bot;

    bot.config.defaults({
        "subreddits": "",
        "interval": 300,
        "format": "%feed | %title by %submitter | %link"
    });

    this.timer = {};
    this.settings = bot.config.get("redditfeed");

    console.info(this.settings);
}

RedditFeed.prototype.startTimer = function() {

}

RedditFeed.prototype.name = "RedditFeed";
RedditFeed.prototype.author = "schrobby";
RedditFeed.prototype.version = "0.1";
RedditFeed.prototype.description = "Announces new submissions from a configurable list of subreddits.";

module.exports = RedditFeed;