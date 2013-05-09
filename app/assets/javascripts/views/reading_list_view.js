FR.Views.ReadingListView = Backbone.View.extend({ 

	initialize: function() { 
		var that = this; 
		this.collection.on('change', that.render, that);
	},

	render: function() 
	{
		var that = this; 
		console.log("that.collection inside render", that.collection);
		that.collection.each(function(article) {
			if ((article.get('article_type') === "TwitterArticle") || (article.get('article_type') === "FacebookArticle")) {
				var articleView = new FR.Views.NewsFeedView({
					collection: new FR.Collections.Articles([article])
				});

				that.$el.append(articleView.render().$el);
			}
		}); 
		return that;
	},


	_setEmbedly: function(url) {
		var that = this;
		$.ajax({
			dataType: "JSONP",
			url: that.request+escape(url),
			success: function(embedly_data) {

				var renderedContent = JST["entries/entry_to_add"]({
					entry: that._setThatEntryAttributes(embedly_data)
				});

				that.$entryDetailEl.html(renderedContent);
				that.$entryDetailEl.insertAfter('input.entry-input');
			}
		});
	},

	_setThatEntryAttributes: function(embedly_data){
		var that = this;
		that.entry = new FR.Models.Entry({
			title: embedly_data.title,
			description: embedly_data.description, 
			image: that._largestPictureUrl(embedly_data), 
			provider_url: embedly_data.provider_url,
			url: embedly_data.original_url
		});
		return that.entry
	},

	_largestPictureUrl: function(embedly_data){
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


})