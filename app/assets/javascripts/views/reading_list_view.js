FR.Views.ReadingListView = Backbone.View.extend({ 

	initialize: function() { 
		var that = this; 
		that.request = "http://api.embed.ly/1/extract?key=282f981be6bc44a18574f9adf009c1f3&url=";
		
		that.collection.on("change", that.render, that);
		// that.$el = $("button.format").text() === "List View" ? $("<div>") : $("<div class='masonrycontainer2 span12'>");
		that.$el = $("<div>");
		that._initializeFormatButtonListener();
	},

	events: {
		"click .add-reading-list": "addReadingList"
	},	

	addReadingList: function(ev){
		var listButton = new FR.Views.ReadingListButtonView();
		listButton.addToReadingList(ev, this.collection);
	},

	_initializeFormatButtonListener: function() {
		var that = this;
		$("button.format").click(function() { 
			that._flipFormatButton();
			text = $("button.format").text(); 

			if (text === "Tile View") 
				that._startMasonry(that.$el, "masonrycontainer span12");
			else 
				that._removeMasonryAndStyling(that.$el, "masonrycontainer span12 masonry");
		});
	},

	_flipFormatButton: function(){
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


	render: function() 
	{
		var that = this; 
		that.collection.each(function(list_item) {
			var type = list_item.get('article_type');

			if (type === "TwitterArticle" || type === "FacebookArticle") {
				var article = FR.Store.Articles.where({type: list_item.get('article_type'), link_id: list_item.get('article_id')})[0];
				that.$el.append(that._newArticleView(article).render().$el);
			
			} else if (type === "follower"){
				$.ajax({
					dataType: "JSON",
					url: "/reading_list_follower_entries",
					data: {article_id: list_item.get('article_id')},
					success: function(entry_data) {
						var entry = new FR.Models.Entry(entry_data);
						
						var entryView = new FR.Views.EntryItemView({
							model: entry
						});

						that.$el.append(entryView.render().$el);
					}
				});
			} else if (type === "bookmarklet"){
				console.log(list_item);
				var url = list_item.get('url'); 
				that._setEmbedly(url);
			}

		}); 
		return that;
	},

	_newArticleView: function(article) {
		var text = $("button.format").text(); 
		var articleView = new FR.Views.ArticleItemView({
			model: article,
			el: text === "List View" ? $("<div>") : $("<div class='content-box'>")
		});
		return articleView;
	},

	_setEmbedly: function(url) { /// CHANGED THIS ONE COMPARED TO THE OTHER PAGES! 
		var that = this;
		$.ajax({
			dataType: "JSONP",
			url: that.request+escape(url),
			success: function(embedly_data) {
				var entryView = new FR.Views.EntryItemView({
					model: that._setThatEntryAttributes(embedly_data)
				});

				that.$el.append(entryView.render().$el);
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