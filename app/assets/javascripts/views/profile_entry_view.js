FR.Views.ProfileEntryView = Backbone.View.extend ({ 

	initialize: function() {
		var that = this;
		
		that.request = "http://api.embed.ly/1/extract?key=282f981be6bc44a18574f9adf009c1f3&url=";
		that.$entryDetailEl = $('<div class=entry-detail> </div>');
		that.$inputNavBar = JST['entry-input']();

		that.$el.prepend(that.$inputNavBar);
		that.$root = $("button.format").text() === "List View" ? $("<div>") : $("<div class='masonrycontainer2 span12'>");
		that.$el.append(that.$root);
		
		that._initializeFormatButtonListener();
		that._buttonListenerToClearInputBar();
	},

	_initializeFormatButtonListener: function() { // universal listener, extract it. 
		var that = this;
		$("button.format").click(function() { 
			that._flipFormatButton();
			text = $("button.format").text(); 

			if (text === "Tile View") 
				that._startMasonry(that.$root, "masonrycontainer span12");
			else 
				that._removeMasonryAndStyling(that.$root, "masonrycontainer span12 masonry");
		});
	},

	_buttonListenerToClearInputBar: function() {
		var that = this;
		$("button.format").click(function() {
			that.clearInputBar();
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

	events: {
		"input input.entry-input": "showLinkAttributes",
		"click button.submit-post": "postEntry",
		"click img.share-facebook": "askForFacebookText",
		"click img.share-twitter": "askForTweetText",
		"click button.share": "batchShare",
		"click img.submit-tweet": "sendTweet",
		"click img.submit-fb": "sendFB",
		"click button.batch-share": "batchShare",
		"click button.format": "clearInputBar"
	},

	clearInputBar: function(){
		console.log('clearInputBar called');
		$('input.entry-input').val("");
		this.$entryDetailEl.empty();
		$('submit-post').remove();
	},

	batchShare: function(){

	},

	askForTweetText: function(ev) {
		var entry_id = $(ev.target).attr('data-twt');
		this.entry = this.collection.get(entry_id);	
	},

	sendTweet: function() {
		var that = this; 
		that.entry.set({post: $('.twitter-input').val()})

		$.ajax({url: "/twitter_tweets", 
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			data: that.entry.toJSON(),
			success: function() {
				$('.twitter-input').val("");
			}
		});		

	},

	askForFacebookText: function(ev) { 	
		var that = this;
		var entry_id = $(ev.target).attr('data-fb');
		that.entry = that.collection.get(entry_id);	
	},	

	sendFB: function() {
		var that = this; 
		that.entry.set({post: $('.fb-input').val()})
		$.ajax({url: "/facebook_posts", 
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			data: that.entry.toJSON(), 
			success: function() {
				$('button.submit-fb').remove();
				$('.fb-input').val("");
			}
		});	
	},

	render: function() {
		var that = this;

		that.collection.each(function(entry) {
			that._addEntry(entry);
		});

		return that;
	},

	_addEntry: function(entry) {
		var that = this;
		
		var entryView = new FR.Views.EntryItemView({
			model: entry
		});
		
		$content = entryView.render().$el
		that.$root.prepend($content);
		
		that._reloadIfTileView();

	}, 

	showLinkAttributes: function(){
		var that = this;
		var url = $('input.entry-input').val();

		if(url.length > 0) {
			that._showEmbedlyDisplay(url);
		}
		else{
			that.entry = new FR.Models.Entry();
			that.$entryDetailEl.empty();
			that._reloadIfTileView();
			$('.submit-post').remove();
		}
	},

	postEntry: function() {	
		var that = this;
		that.entry.set({post: $('.Post').val()});
		
		that.entry.save({}, {
			success: function() {
				that.collection.add(that.entry);
				that._addEntry(that.entry);
				$('input.entry-input').val("");
				that.$entryDetailEl.empty();
				$('submit-post').remove();
				that._reloadIfTileView();
			}
		});
	},

	_showEmbedlyDisplay: function(url) {
		var that = this;
		$.ajax({
			dataType: "JSONP",
			url: that.request+escape(url),
			success: function(embedly_data) {

				var entryView = new FR.Views.EntryItemView({
					model: that._setThatEntryAttributes(embedly_data)
				});

				that.$entryDetailEl.append(entryView.render().$el);

				that.$entryDetailEl.find('.panel').css('background-color', 'rgb(253, 226, 117)');
				that.$entryDetailEl.find('.text-content').css('background-color', 'rgb(253, 226, 117)');


				that.$root.prepend(that.$entryDetailEl);
				if(that._buttonText() == "List View")
					that.$entryDetailEl.find('.post').append($("<button class='submit-post'> Post </button>"));
				else 
					that.$entryDetailEl.find('.content-box').append($("<button class='submit-post'> Post </button>"));

				that._reloadIfTileView();

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

	_buttonText: function(){
		return $("button.format").text();
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

}); 