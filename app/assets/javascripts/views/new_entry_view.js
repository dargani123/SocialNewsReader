FR.Views.NewEntryView = Backbone.View.extend ({ 
	// break into separate views? 
	// 

	initialize: function() {
		var that = this;
		this.request = "http://api.embed.ly/1/extract?key=f2e77f3d830e4cb28df18b29e0d07084&url=";
		this.$entryDetailEl = $('<div class=entry-detail> </div>');
		FR.Store.Entries.on('add', that.render, that);
	},

	events: {
		"input input.entry-input": "showLinkAttributes",
		"click button.submit-post": "postEntry",
		"click img.share-facebook": "askForFacebookText",
		"click img.share-twitter": "askForTweetText",
		"click button.share": "batchShare",
		"click button.submit-tweet": "sendTweet",
		"click button.submit-fb": "sendFB"
	},

	askForTweetText: function(ev) {
		var that = this;
		var entry_id = $(ev.target).attr('data-twt');
		that.entry = FR.Store.Entries.get(entry_id);

		if ($(".twitter-input").length > 0){
			$('button.submit-tweet').remove();
			$('.twitter-input').remove();
		}
		else {
			$("<textarea class='twitter-input'> </textarea>").insertAfter($(ev.target));
			$('.twitter-input').val(that.entry.get('post'))	; 
			$("<button class='submit-tweet'> Tweet Now! </button>").insertAfter($('.twitter-input'));	
		}		
	},

	sendTweet: function() {
		var that = this; 
		that.entry.set({post: $('.twitter-input').val()})
		$.ajax({url: "/twitter_tweets", 
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			data: that.entry.toJSON(),
			success: function() {
				$('button.submit-tweet').remove();
				$('.twitter-input').remove();
			}
		});			

	},

	askForFacebookText: function(ev) { 	
		var that = this;
		var entry_id = $(ev.target).attr('data-fb');
		that.entry = FR.Store.Entries.get(entry_id);

		if ($(".fb-input").length > 0){
			$('button.submit-fb').remove();
			$('.fb-input').remove();
		}
		else {
			$("<textarea class='fb-input'> </textarea>").insertAfter($(ev.target));
			$('.fb-input').val(that.entry.get('post')); 
			$("<button class='submit-fb'> Share Now! </button>").insertAfter($('.fb-input'));
		}	
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
				$('.fb-input').remove();
			}
		});	
	},

	render: function() {
		var that = this;
		var renderedContent = JST['entries/list']({
			entries: FR.Store.Entries
		});

		that.$el.html(renderedContent);

		that.$el.prepend($("<div><input class='entry-input' type='text' value='' placeholder='Share article here'></div>"));	
		return that;
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
		}
	},

	postEntry: function() {
		var that = this;
		that.entry.set({post: $('.Post').val()});
		
		that.entry.save({}, {
			success: function() {
				FR.Store.Entries.add(that.entry);
			}
		});
	},

	_showEmbedlyDisplay: function(url) {
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

}); 