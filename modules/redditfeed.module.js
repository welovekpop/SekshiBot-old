function RedditFeed(bot) {
    this.bot = bot;

    bot.config.set("redditfeed:subreddit", "kpop");
    bot.config.save();
}

RedditFeed.prototype.name = "RedditFeed";
RedditFeed.prototype.author = "schrobby";
RedditFeed.prototype.version = "0.1";
RedditFeed.prototype.description = "Announces new submissions from a configurable list of subreddits.";

module.exports = RedditFeed;