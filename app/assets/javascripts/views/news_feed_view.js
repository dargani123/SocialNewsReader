FR.Views.NewsFeedView = Backbone.View.extend({
	initialize: function() {
		var that = this; 
		that.request = "http://api.embed.ly/1/extract?key=4127ab7d942e43cf8e15bc5d79802973&url=";
		that.page = 0; 
		that.rendering = false;
		// console.log(($(window).scrollTop() + $(window).height() == $(document).height()));
		
		var throttled = _.throttle(function() {

	   		if (($(window).scrollTop() + $(window).height() > $(document).height())) {
	   			that.render(); 
	   		}
		}, 50);

		$(window).scroll(throttled);
		that.$socialFeed = $("<div class='SocialFeed'>");
		that.collection.on('add-reading-list', that.render, that);
	},

	events: {
		"click .add-reading-list": "addToReadingList"
	},

	addToReadingList: function(ev) {	
		var listButton = new FR.Views.ReadingListButtonView();
		listButton.addToReadingList(ev);
	},

	render: function() {
		var that = this; 
		
		collection = new FR.Collections.Articles(that.collection.slice((that.page*10),(that.page*10+10)));

		var renderedContent = JST['news_feed_articles/list']({
			articles: new FR.Collections.Articles(that.collection.slice((that.page*10),(that.page*10+10)))
		});
		that.page++;

		that.$el.append(renderedContent); 
		return that;
	},

	_addFollowingsArticle: function($rootEl) {
		var that = this; 

		$.ajax({url: "/following_articles", 
			type: 'GET',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			success: function(entries) {
				var followingEntries = new FR.Collections.Entries(entries);
				var content = JST['entries/list']({
					entries: followingEntries
				});
				
				that.$socialFeed.html(content);		
				$rootEl.append(that.$socialFeed);	
			}
		});	

	},

	_cleanse: function(callback) {
		var that = this;
		that.collection.each(function(article) { 
				// console.log(article.get('title') === null);
			if (article.get('type') === "TwitterArticle" && article.get('title') === null) {
		
				$.ajax({
					dataType: "JSONP",
					url: that.request+article.get('url'),
					success: function(embedly_data) {
						if (embedly_data.type !== "error"){
							console.log(that.request+article.get('url'));
							that._setThatEntryAttributes(embedly_data, article);
						}
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
			object.save();
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