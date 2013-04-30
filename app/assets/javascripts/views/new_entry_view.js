FR.Views.NewEntryView = Backbone.View.extend ({ 

	initialize: function() {
		var that = this;
		this.request = "http://api.embed.ly/1/extract?key=f2e77f3d830e4cb28df18b29e0d07084&url=";
		this.$entryDetailEl = $('<div class=entry-detail> </div>');
		FR.Store.Entries.on('add', that.render, that);
	},

	events: {
		"input input.entry-input": "showLinkAttributes",
		"click button.submit-post": "postEntry",
		"click button.share-facebook": "shareFacebook",
		"click button.share-twitter": "tweet"
	},

	tweet: function(ev) {
		var entry_id = $(ev.target).attr('data-twt');
		console.log(entry_id);
		var entry = FR.Store.Entries.get(entry_id);
		console.log(entry);
		$.ajax({url: "/twitter_tweets", 
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			data: entry.toJSON() 
		});				
	},

	shareFacebook: function(ev) { 	
		var entry_id = $(ev.target).attr('data-fb');
		console.log(entry_id);
		var entry = FR.Store.Entries.get(entry_id);
		console.log(entry);
		$.ajax({url: "/facebook_posts", 
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			data: entry.toJSON() 
		});	
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

	render: function() {
		var that = this;
		var renderedContent = JST['entries/list']({
			entries: FR.Store.Entries
		});
		that.$el.html(renderedContent);
		return that;
	},

	showLinkAttributes: function(){
		var that = this;
		var url = $('input.entry-input').val();
		console.log(url);

		if(url.length > 0) {
			that._showEmbedlyDisplay(url);
		}
		else{
			that.entry = new FR.Models.Entry();
			that.$entryDetailEl.empty();
		}
	},

	_showEmbedlyDisplay: function(url) {
		var that = this;
		$.ajax({
			dataType: "JSONP",
			url: that.request+escape(url),
			success: function(embedly_data) {
				console.log(embedly_data);

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