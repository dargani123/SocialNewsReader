FR.Views.FollowingNews = Backbone.View.extend({
	initialize: function(){	
		this.$el = $("button.format").text() === "List View" ? $("<div>") : $("<div class='masonrycontainer2 span12'>");
		this._initializeFormatButtonListener();
		console.log("inside Following News");
	},

	events: {
		"click .add-reading-list": "addToReadingList"
	},

	addToReadingList: function(ev) {	
		var listButton = new FR.Views.ReadingListButtonView();
		listButton.addToReadingList(ev);
	},


	render: function(){ 
		var that = this; 
		var text = $("button.format").text(); 
		$.ajax({url: "/following_articles", 
			type: 'GET',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			success: function(entries) {
				console.log(entries);
				var followingEntries = new FR.Collections.Entries(entries);
				followingEntries.each(function(entry) {
					that._addEntry(entry, entry.get('user').name);
				});
			}
		});
		return that;
	},

	_addEntry: function(entry, name) { // Make Global, 
		var that = this;

		var entryView = new FR.Views.EntryItemView({
			model: entry, 
			name: name
		});
		
		that.$el.prepend(entryView.render().$el);
		
		that._reloadIfTileView();

	}, 

	_reloadIfTileView: function() {
		var text = $("button.format").text();
		var that = this;
		if (text === "Tile View") {
			that.$el.imagesLoaded(function(){ 
				that.$el.masonry('reload');
			});
		}
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


});