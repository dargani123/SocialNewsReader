FR.Views.NewsFeedView = Backbone.View.extend({
	initialize: function() {
		var that = this; 
		that.request = "http://api.embed.ly/1/extract?key=f2e77f3d830e4cb28df18b29e0d07084&url=";
		that.page = 1; 
		that.rendering = false;
		console.log(($(window).scrollTop() + $(window).height() == $(document).height()) && !that.rendering);
		
		var throttled = _.throttle(function() {
	   		if (($(window).scrollTop() + $(window).height() == $(document).height()) && !that.rendering) {
		   		that.$el.append("<div class='load'>Loading</div>")
	   			that.render(); 
	   		}
		}, 50);

		$(window).scroll(throttled);

		that._addFollowingsArticle(); 

		that.$socialFeed = $("<div class='SocialFeed'>");
		that._insertSeedSocial();
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

		// CLEAN UP CODE HERE
		that.rendering = true;

		that.collection.fetch({ // rails or	]der does not matter here, need to sort it in the client side
			data: {page: that.page},
			success: function(articles){
				that._cleanse(function() {
					var renderedContent = JST['news_feed_articles/list']({
						articles: articles
					});
					that.$socialFeed.append(renderedContent);
				});

				that.page++; 
				that.rendering = false;
				$('.load').remove();
			}
		});
		return that;
	},

	_insertSeedSocial: function(){
		var that = this;
		that.$el.append(that.$socialFeed);
	},

	_addFollowingsArticle: function() {
		var that = this; 

		$.ajax({url: "/following_articles", 
			type: 'GET',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			success: function(entries) {
				var followingEntries = new FR.Collections.Entries(entries);
				var content = JST['entries/list']({
					entries: followingEntries
				});
				
				that.$el.prepend(content);			
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
							callback();
						}
					}		
				});
		    }
		});
		
		callback();
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