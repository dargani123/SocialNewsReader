FR.Views.NewsFeedView = Backbone.View.extend({
	initialize: function() {
		this.request = "http://api.embed.ly/1/extract?key=f2e77f3d830e4cb28df18b29e0d07084&url=";
	},

	render: function() {
		var that = this; 
		that.$el.html("loading")
		that.collection.fetch({
			success: function(){
				console.log("success function of that.collection");
				console.log(that.collection);
				that._cleanse(function() {
					var renderedContent = JST['news_feed_articles/list']({
						articles: FR.Store.Articles
					});
					that.$el.html(renderedContent);
				});
			}
		});
		return that;
	},

	_cleanse: function(callback) {
		console.log("called");
		var that = this;
		that.collection.each(function(article) {
			if (article.get('type') === "TwitterArticle") {
				$.ajax({
						dataType: "JSONP",
						url: that.request+article.get('url'),
						success: function(embedly_data) {
							that._setThatEntryAttributes(embedly_data, article);
							callback();
						}
				});
			}
		});
	},

	_setThatEntryAttributes: function(embedly_data, object){
		var that = this;
			object.set({title: embedly_data.title});
			object.set({description: embedly_data.description}); 
			object.set({image_url: that._largestPictureUrl(embedly_data)}); 
		return that.entry
	},

	_largestPictureUrl: function(embedly_data){
		console.log(embedly_data);
		var array_pics = embedly_data.images;

		var url = "";

		if(array_pics.length === 0)
			url = embedly_data.favicon_url
		else {
			var maxSize = 0; 
			_(array_pics).each(function(pic) {
				if (pic.size > maxSize){
					maxSize = pic.size; 
					url = pic.url;
				}
			});
		}
		return url;
	}
 });