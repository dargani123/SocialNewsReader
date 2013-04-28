FR.Views.SidebarView = Backbone.View.extend({
	initialize: function() { 
		var that = this;
		that.choice = "feeds";
		that.request = "http://api.embed.ly/1/extract?key=f2e77f3d830e4cb28df18b29e0d07084&url=";
		that.$linkDetailEl = $('<div class=link-detail> </div>');
		FR.Store.Feeds.on("add", that.render, that);

	},

	buttonChoices: {
		"feeds": "Feeds", 
		"entries": "Entries",
	},

	events: {
		"click button.feeds": "renderFeeds",
		"click button.entries": "renderEntries",
		"input input.feed-input": "showLinkAttributes",
		"click button.submit-feed": "saveToFeed"
	},

	saveToFeed: function() {
		var that = this; 
		that.feed.save({}, {
			success: function() {
				FR.Store.Feeds.add(that.feed);
			}
		});
		//	that.feed = new FR.Models.Feed();
	},


	showLinkAttributes: function(){
		var that = this;
		var url = $('input.feed-input').val();

		if(url.length > 0) {
			that._showEmbedlyDisplay(url);
		}
		else{
			that.feed = new FR.Models.Feed();
			that.$linkDetailEl.empty();
		}
	},

	_showEmbedlyDisplay: function(url) {
		var that = this;
		$.ajax({
			dataType: "JSONP",
			url: that.request+escape(url),
			success: function(embedly_data) {

				var renderedContent = JST["side/feed_to_add"]({
					embedly_data: that._setThatFeedAttributes(embedly_data)
				});

				that.$linkDetailEl.html(renderedContent);
				that.$linkDetailEl.insertAfter('input.feed-input');
			}
		});
	},

	_setThatFeedAttributes: function(embedly_data){
		var that = this;
		that.feed = new FR.Models.Feed({
			icon_url: embedly_data.favicon_url,
			title:  embedly_data.title, 
			description: embedly_data.description,
			url: embedly_data.original_url 

		});
		return that.feed
	},

	render: function (){ 
		var that = this;
		var list_content; 

		if(that.choice == "feeds"){ 
			var list_content = JST["feeds/list"]({
				feeds: FR.Store.Feeds
			});
		}
		else if(that.choice == "entries"){
			var list_content = JST["entries/list"]({
				entries: FR.Store.Entries
			});	
		}

		var renderedContent = JST["side/sidebar"]({
			listContent: list_content,
			title: that.choice
		});

		that.$el.html(renderedContent); 

		return that;
	},

	renderFeeds: function (){
		var that = this;
		that.choice = "feeds";
		that.render();
	},

	renderEntries: function (){
		var that = this;
		that.choice = "entries";
		that.render();
	},

	renderNewFeed: function() {
		var that = this; 
		that.choice = "new";
		that.render();
	}


});