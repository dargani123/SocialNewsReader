	FR.Views.ProfileEntryView = Backbone.View.extend ({ 

	initialize: function() {
		var that = this;
		that.priorURL = "";
		
		that.request = "http://api.embed.ly/1/extract?key=282f981be6bc44a18574f9adf009c1f3&url=";
		that.$entryDetailEl = $('<div class=entry-detail> </div>');
		that.$inputNavBar = $("<div class='input-nav-bar'>");
		that.$inputNavBar.prepend(JST['entry-input']());


		that.$el.prepend(that.$inputNavBar);
		that.$root = $("button.format").text() === "List View" ? $("<div>") : $("<div class='masonrycontainer2 span12'>");
		that.$el.append(that.$root);

		console.log(window.email);
		console.log(window.gmail_access_token);
		$.ajax({
			url: "https://www.google.com/m8/feeds/contacts/" + window.email +"/full?access_token=" + window.gmail_access_token + "&alt=json",
			dataType: "JSONP",
			// beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			success: function(contacts_data){
					console.log(contacts_data);
			}
		});
		
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
		"click img.submit-tweet": "sendTweet",
		"click img.submit-fb": "sendFB",
		"click button.batch-share": "batchShare",
		"click button.format": "clearInputBar",
		"click input.entry-input": "clearIfTextExists",
		"click .entry-article": "addToBatchShare",
		"click .delete": "deletePressed",
		"keyup .batch-enter-email": "submitTag",
		"click .submit-batch-share": "askForPasswordConfirmation",
		"click button.confirm-password": "sendBatchEmail",
		"click .add-reading-list": "addToReadingList"
	},

	addToReadingList: function(ev) {	
		var listButton = new FR.Views.ReadingListButtonView();
		listButton.addToReadingList(ev);
	},

	sendBatchEmail: function(){
		var that = this;
		var password = $('input.batch-password').attr('value');
		var email_text = $('.batch-input').attr('value');
		var emails = $('.tag').clone().children().remove().end().text();

		if(emails === ''){
			that._insertTooltip('.batch-enter-email', "Uh Oh. Who is this going to?");
		} else if (email_text.length  < 30) {
			that._insertTooltip('.batch-instructions-title', "You are not sharing any articles!");
		} else {
			$.ajax({url: "/send_mails", 
				type: 'POST',
				beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
				data: {
					password: password,
					email_text: email_text,
					emails: emails
				},
				success: function(data) {
					$('.batch-container').remove();
						that.$inputNavBar.prepend(JST["batch-message"]({
							message: "Message Successfully Sent"
						})
					);
				},
				error: function(obj){
					var message = jQuery.parseJSON(obj.responseText).errors;
						that.$inputNavBar.prepend(JST["batch-message"]({
							message: message
						})
					);
				}
			});	
		}
	},

	_insertTooltip: function(selector, message){
		$(JST['tooltip']({
			message: message
		})).insertAfter(selector);
	},

	askForPasswordConfirmation: function(){
		$($('.batch-instructions-container')[1]).append(JST['batch-password-field']());
		$('.row.batch-submit').remove();
	},

	deletePressed: function(ev){
		console.log("pressed");
		$(ev.target).parents('.delete-me').remove();
	},

	submitTag: function(ev){
		if(ev.keyCode === 13){
			var email = $('input.batch-enter-email').attr('value');
			$('input.batch-enter-email').attr('value', "");	
			$('.tags-list').append("<span class='tag delete-me'>" + email + "<span class='delete'>  x</span> </span>")
		}
	},

	addToBatchShare: function(ev){
		console.log("addToBatchShare called");
		if($('.batch-instructions-container').length > 0){
			var id = $(ev.target).parents('.entry-article').attr('article-id');
			var entry = this.collection.get(id); 
			var currentText = $('.batch-input').attr('value');
			$('.batch-input').attr('value', currentText + "\n" + entry.get('title') + "\n" + entry.get('url') + "," + "\n");
		}
	},

	batchShare: function(){
		console.log("batch share pressed");
		if($('.batch-container').length == 0)
			this.$inputNavBar.prepend(JST['entries/batchShareInstructions']());
		else 
			$('.batch-container').remove();
	},

	clearIfTextExists: function(){
		if($('input.entry-input').val() != ""){
			$('input.entry-input').val("");
			this.$entryDetailEl.empty();
			this.$entryDetailEl.remove();
		}
	},

	clearInputBar: function(){
		console.log('clearInputBar called');
		$('input.entry-input').val("");
		$('submit-post').remove();
		this._removeMasonryAndStyling(this.$entryDetailEl, "masonrycontainer span12 masonry");
		this.$entryDetailEl.empty();
		this.$entryDetailEl.remove();
		this._reloadIfTileView();
	},

	_removeMasonryAndStyling: function($el, classes) { //global helper method. 
		$el.masonry();
		$el.masonry('destroy');
		$el.removeClass(classes);
		$el.removeAttr('style');
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
			that._addEntry(entry, FR.Store.username);
		});

		return that;
	},

	_addEntry: function(entry, name) { // Make Global
		var that = this;

		var entryView = new FR.Views.EntryItemView({
			model: entry, 
			name: name
		});
		
		that.$root.prepend(entryView.render().$el);
		
		that._reloadIfTileView();

	}, 

	showLinkAttributes: function(){
		var that = this;
		var url = $('input.entry-input').val();

		if (that.priorURL != "" && url.length > 0) {
			that.clearIfTextExists();
			that.priorURL = "";
		}
		else {
			that.priorURL = url; 
			if(url.length > 0)
				that._showEmbedlyDisplay(url);
			else{
				that.entry = new FR.Models.Entry();
				that.$entryDetailEl.empty();
				$('.submit-post').remove();
			}			
		}		

		that._reloadIfTileView();
	},

	postEntry: function() {	
		var that = this;
		that.entry.set({post: $('.Post').val()});
		
		that.entry.save({}, {
			success: function() {
				that.collection.add(that.entry);
				that._addEntry(that.entry, FR.Store.username);
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
					model: that._setThatEntryAttributes(embedly_data),
					name: FR.Store.username
				});
				that.$entryDetailEl.append(entryView.render().$el);

				that._setEntryDetailBackgroundColor();
				that.$root.prepend(that.$entryDetailEl);
				that._appendSubmitButton();
				that._reloadIfTileView();
			}
		});
	},

	_appendSubmitButton: function(){
		if(this._buttonText() == "List View")
			this.$entryDetailEl.find('.post').append($("<button class='submit-post'> Post </button>"));
		else 
			this.$entryDetailEl.find('.content-box').append($("<button class='submit-post'> Post </button>"));
	},

	_setEntryDetailBackgroundColor: function(){
		this.$entryDetailEl.find('.panel').css('background-color', '#ECF0F1');
		this.$entryDetailEl.find('.text-content').css('background-color', '#ECF0F1');
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