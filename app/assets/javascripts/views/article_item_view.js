FR.Views.ArticleItemView = Backbone.View.extend({
	initialize: function() {
		var that = this; 
		$("button.format").click(function() {
			var text = $("button.format").text(); 
			if (text === "List View")
				that.$el.removeClass('content-box');
			else 
				that.$el.addClass('content-box');
			that.render(); 
		});

		that.model.on("change", that.render, that);
	},

	render: function() { 
		var that = this;
		var renderedContent; 
		if ($("button.format").text() === "List View") { 
			renderedContent = JST['news_feed_articles/single_article_list']({
				article: that.model
			});
		} else {			
			renderedContent = JST['news_feed_articles/single_article_tile']({
				article: that.model
			});
		}

		that.$el.html(renderedContent);
		return that;
	}

});