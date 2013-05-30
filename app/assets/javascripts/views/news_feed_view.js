FR.Views.NewsFeedView = Backbone.View.extend({

	initialize: function() {
		var that = this; 
		that.request = "http://api.embed.ly/1/extract?key=282f981be6bc44a18574f9adf009c1f3&url=";
		that.page = 0; 
		that.rendering = false;
		
		that._startPageDownListener();

		that.$root = $("button.format").text() === "List View" ? $("<div>") : $("<div class='masonrycontainer2 span12'>");
		that.$el.append(that.$root); 
		that.$root.attr('id', 'display-list');
		that.$socialFeed = $("<div class=SocialFeed>");
		that.$socialFeed.attr('id', 'display-list');

		that._initializeFormatButtonListener();
	},

	events: {
		"click .add-reading-list": "addToReadingList",
	},

	_startPageDownListener: function(){
		var that = this;
		var throttled = _.throttle(function() {
	   		if (that._atBottom() && !that.rendering) {
	   			that.render();
	   			// that._reloadIfTileView();
	   		}
		}, 100);

		$(window).scroll(throttled);		
	},

	_atBottom: function(){
		return ($(window).scrollTop() + $(window).height() > $(document).height());
	},

	_initializeFormatButtonListener: function() { // This method is different from profile view one, has add following articles, and has two elements instead of one 
		var that = this;
		$("button.format").click(function() { 	
			that._flipFormatButton();
			text = $("button.format").text(); 

			if (text === "Tile View") {
				that._startMasonry(that.$root, "masonrycontainer2 span12");
				that._startMasonry(that.$socialFeed, "masonrycontainer span12");
			} else {
				that._removeMasonryAndStyling(that.$root, "masonrycontainer2 span12 masonry");
				that._removeMasonryAndStyling(that.$socialFeed, "masonrycontainer2 span12 masonry");
			}

			that._addFollowingsArticle(function(){}); 
		});
	},

	_flipFormatButton: function()
	{
		var text = $("button.format").text(); 
		$("button.format").text(text === "List View" ? "Tile View" : "List View");
	},

	_removeMasonryAndStyling: function($el, classes) {
		$el.masonry();
		$el.masonry('destroy');
		$el.removeClass(classes);
		$el.removeAttr('style');
	},

	_startMasonry: function($masonryEl, classes){
		$masonryEl.addClass(classes);
		$masonryEl.masonry();
		$masonryEl.imagesLoaded(function(){
	        $masonryEl.masonry({
	          itemSelector : '.content-box',
	          columnWidth : 380,
	          isAnimated: true
	        });
			$('.masonrycontainer2').masonry('reload');
		});
	},

	addToReadingList: function(ev) {	
		var listButton = new FR.Views.ReadingListButtonView();
		listButton.addToReadingList(ev);
	},

	render: function() {
		var that = this; 
		that.rendering = true; 
		console.log("render called");

		var articles = new FR.Collections.Articles(that.collection.slice((that.page*10),(that.page*10+10)));

		if (articles.length === 0) { // remember to set rendering to false in any helper methods here. 
			that._addLoadingMessage();
			that.rendering = false;
			return that;
		} else {
		
			articles.each(function(article) {
				that._appendArticleView(that._newArticleView(article));
			});

			that.rendering = false;
			that.page++;
			return that;
		}
	},

	_addLoadingMessage: function() {
		var that = this;
		if (that._noArticlesLeft() && $('.end').length == 0)
			that.$el.append("<div class='end'> no more articles </div>");
		else if (!that._noArticlesLeft())  
			that.$el.append("<div class='loading'>loading . . .</div>");
	},

	_noArticlesLeft: function() {
		if (this.page === 0)
			return false; 
		else 
			return this.page * 10 + 10 > this.collection.length;
	},

	_newArticleView: function(article) {
		var text = $("button.format").text(); 
		var articleView = new FR.Views.ArticleItemView({
			model: article,
			el: text === "List View" ? $("<div>") : $("<div class='content-box'>")
		});
		return articleView;
	},

	_appendArticleView: function(articleView) {
		var that = this;
		var text = $("button.format").text(); 
	
		if (text === "Tile View"){
			var $content = articleView.render().$el;

			that.$root.imagesLoaded(function(){ 
				that.$root.append($content);
				that.$root.masonry('appended', $content, 'isAnimatedFromBottom');
			});

		} else {
			that.$root.imagesLoaded(function(){ 
				that.$root.append(articleView.render().$el)
			});
		}	
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

				that.$socialFeed.html("");
				followingEntries.each(function(entry) {
					var entryView = new FR.Views.EntryItemView({
						model: entry
					});

					that.$socialFeed.append(entryView.render().$el)
				});
				
				that.$el.prepend(that.$socialFeed);	
			}
		}).done(
			callback()
		)

	},

	_cleanse: function(callback) { // gets twitter articles pics and links from embedly 
		console.log("cleanse called")
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

	_reloadIfTileView: function() {
		var text = $("button.format").text();
		var that = this;
		if (text === "Tile View") {
			that.$root.imagesLoaded(function(){ 
				that.$root.masonry('reload');
			});
		}
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