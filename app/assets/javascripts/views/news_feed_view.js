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

		that.$root = $("button.format").text() === "List View" ? $("<div>") : $("<div class='masonrycontainer2 span12'>");
		that.$el.append(that.$root); 

		$("button.format").click(function() { 
		
			var text = $("button.format").text(); 
			$("button.format").text(text === "List View" ? "Tile View" : "List View");
			text = $("button.format").text(); 

			if (text === "Tile View") {
				that.$root.addClass("masonrycontainer2 span12");
				that.$socialFeed.addClass("masonrycontainer span12");

				var $container = $('.masonrycontainer2');
				    $container.imagesLoaded(function(){
				        $container.masonry({
				          itemSelector : '.content-box',
				          columnWidth : 380,
				          isAnimatedFromBottom: true, 
				           animationOptions: {
						    duration: 350,
						    easing: 'linear',
						    queue: true
						  }
				        });
				});

			} else {
				that.$root.masonry('destroy');
				that.$root.removeClass("masonrycontainer2 span12 masonry");
				that.$socialFeed.masonry('destroy');
				that.$socialFeed.removeClass("masonrycontainer span12 masonry");
				// that.$root.html("<div>");
				// that.render(); 
			}

			that._addFollowingsArticle(function(){}); 


		});

		that.$socialFeed = $("<div class=SocialFeed>");
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
		
		// var collection = new FR.Collections.Articles(that.collection.slice((that.page*10),(that.page*10+10)));

		var renderedContent;

		var articles = new FR.Collections.Articles(that.collection.slice((that.page*10),(that.page*10+10)));
		var text = $("button.format").text(); 


		articles.each(function(article) {
			var articleView = new FR.Views.ArticleItemView({
				model: article,
				el: text === "List View" ? $("<div>") : $("<div class='content-box'>")
			});
			if (text === "Tile View"){
				that.$root.append(articleView.render().$el);
			} else {
				that.$root.append(articleView.render().$el)
			}
		});
	
		if (text === "Tile View")
			that.$root.imagesLoaded(function(){ that.$root.masonry('reload') });
	
		that.page++;

		

		// that.$el.append(renderedContent); 
		return that;
	},

	_addFollowingsArticle: function(callback) {
		var that = this; 
		var text = $("button.format").text(); 
		$.ajax({url: "/following_articles", 
			type: 'GET',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			success: function(entries) {
				var followingEntries = new FR.Collections.Entries(entries);
				var content;

				// if ($("button.format").text() === "List View") { 
				// 	content = JST['entries/list_list_format']({
				// 		entries: followingEntries
				// 	});
				// } else {
				// 	content = JST['entries/list']({
				// 		entries: followingEntries
				// 	});
				// }
				that.$socialFeed.html("");
				followingEntries.each(function(entry) {
					var entryView = new FR.Views.EntryItemView({
						model: entry
					});

					if (text === "Tile View")
						that.$socialFeed.append(entryView.render().$el);
					else 
						that.$socialFeed.append(entryView.render().$el)
				});
				
				// that.$socialFeed.html(content);		
				that.$el.prepend(that.$socialFeed);	
			}
		}).done(
				callback()
		)

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
		// console.log(embedly_data); FIX THIS _largestPictureUrl
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