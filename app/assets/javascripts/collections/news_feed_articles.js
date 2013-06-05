FR.Collections.Articles = Backbone.Collection.extend({
	model: FR.Models.NewsFeedArticle,
	url: "/news_feed_articles",
	sort_key: 'link_id', 
	comparator: function(item) {
		return -item.get(this.sort_key)
	},
	
	sortByField: function(fieldName) {
        this.sort_key = fieldName;
        this.reverseSortBy(fieldName);
    }
})