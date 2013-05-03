FR.Collections.Articles = Backbone.Collection.extend({
	model: FR.Models.NewsFeedArticle,
	url: "/news_feed_articles"
})