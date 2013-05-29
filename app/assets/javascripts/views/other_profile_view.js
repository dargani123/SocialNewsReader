FR.Views.OtherProfile = Backbone.View.extend({
	
	initialize: function() {
		var that = this; 
		this.id = parseInt(document.URL.substring(document.URL.lastIndexOf('/') + 1));

		var $button = $("<button class=follow></button>");	
		$button.text(this._FollowButtonText());
		this.$el.append($button);

		that.$root = $("button.format").text() === "List View" ? $("<div>") : $("<div class='masonrycontainer2 span12'>");
		that.$el.append(that.$root);

		that._initializeFormatButtonListener();
	},

	_initializeFormatButtonListener: function() {
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
		$masonryEl.imagesLoaded(function(){
	        $masonryEl.masonry({
	          itemSelector : '.content-box',
	          columnWidth : 380,
	          isAnimated: true
	        });
		});
	},

	_FollowButtonText: function(){
		return (this._isFollowing() ? "UnFollow" : "Follow");
	},

	_isFollowing: function() {
		var that = this; 
		return ( 
				FR.Store.Followers.where({
					following_id: that.id
				}).length > 0); 
	},

	events: {
		"click .follow": "follow",
		"click .add-reading-list": "addReadingList"
	},	

	addReadingList: function(ev){
		var listButton = new FR.Views.ReadingListButtonView();
		listButton.addToReadingList(ev, this.collection);
	},

	render: function() {
		var that = this;

		that.collection.each(function(entry) {
			that._addEntry(entry);
		});

		return that;
	},

	_addEntry: function(entry) {
		var text = $("button.format").text();

		var entryView = new FR.Views.EntryItemView({
			model: entry
		});

		this.$root.prepend(entryView.render().$el);
	}, 

	follow: function() { 
		var that = this; 

		if (!that._isFollowing()) {
			var following = new FR.Models.Follower({
				following_id: this.id, user_id: window.id
			});

			following.save({},{
				success: function(big_data) {
					following.id = big_data.id;
					FR.Store.Followers.add(following);
				}
			});
			$(".follow").text("UnFollow");
		} else {
			var following = FR.Store.Followers.findWhere({following_id: this.id});
			following.destroy({
				success: function() {
					$(".follow").text("Follow");
				} 
			});
		} 
	}

});

