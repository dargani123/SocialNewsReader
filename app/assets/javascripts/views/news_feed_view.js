FR.Views.NewsFeedView = Backbone.View.extend({

	initialize: function() {
		var that = this; 
		that.request = "http://api.embed.ly/1/extract?key=282f981be6bc44a18574f9adf009c1f3&url=";
		that.page = 0; 
		that.rendering = false;
		that.addedArticles = [];
		that._startPageDownListener();

		that.$root = $("button.format").text() === "List View" ? $("<div>") : $("<div class='masonrycontainer2 span12'>");
		that.$el.append(that.$root); 
		that.$root.attr('id', 'display-list');
		that.$socialFeed = $("<div class=SocialFeed>");
		that.$socialFeed.attr('id', 'display-list');

		that._initializeFormatButtonListener();
		that._startFetchingArticles();
	},

	events: {
		"click .add-reading-list": "addToReadingList",
		"click button.insert": "removeInsertButton"
	},

	removeInsertButton: function(){
		console.log("remove pressed");
		$('button.insert').remove();
		this.prependArticles(this.addedArticles);
		this.addedArticles = [];
	},


	_startFetchingArticles: function() {
		var that = this;
		window.setInterval(function() {
			that.fetchArticles()
		}, 60000);
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

	_appendArticleView: function(articleView) { /// CHANGED TO PREPEND
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

	fetchArticles: function(){
		console.log("articles fetched");
		var that = this;
		var last_id = this.collection.length;
		that.collection.fetch({ // rails does not matter here, need to sort it in the client side
			success: function(articles){
				that.addedArticles = that.addedArticles.concat(
					_.filter(articles.models, function(a) { 
						return parseInt(a.get('id')) > last_id; 
					})
				);
				$('.loading').remove();
				that._cleanse();
				if (that.addedArticles.length > 0)
					that._addInsertButton(that.addedArticles.length);	
			}, 
		});
	},

	_addInsertButton: function(num_articles){ 
		if($('.insert').length === 0) {
			var $button = $("<button class='insert span8 offset2'>" + num_articles + " new articles</button>");
			this.$el.prepend($button);
		} else 
			$('.insert').text(num_articles + " new articles");		
	},

	prependArticles: function(articles) { 
		var that = this;
		_(articles).each(function(article){
			that._prependArticle(article);
		});
		that._reloadIfTileView();
	},

	_prependArticle: function(article){
		var that = this;
		var text = $("button.format").text(); 
		var articleView = that._newArticleView(article);
	
		if (text === "Tile View"){
			var $content = articleView.render().$el;

			that.$root.imagesLoaded(function(){ 
				that.$root.prepend($content);
				that._reloadIfTileView();
			});

		} else {
			that.$root.imagesLoaded(function(){ 
				that.$root.prepend(articleView.render().$el)
			});
		}
	},

	_cleanse: function(callback) { // gets twitter articles pics and links from embedly 
		console.log("cleanse called")
		var that = this;
		that.collection.each(function(article) { 
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