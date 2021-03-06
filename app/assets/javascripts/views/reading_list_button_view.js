FR.Views.ReadingListButtonView = Backbone.View.extend({



	events: {
		"click .add-reading-list" : "addToReadingList"
	},

	render: function() {
		console.log("render called: reading list button view");
		return this;
	},

	_onReadingList: function(link_id, type) {
		return FR.Store.ReadingList.where({article_id: link_id, article_type: type}).length > 0
	},

	addToReadingList: function(ev, entry_collection) {	
		var link_id = $(ev.target).attr('data-article-id');
		var type = $(ev.target).attr('data-type'); // Follower: Any user on the site including you. Clean up semantics here. 
		var that = this;

		if (!that._onReadingList(link_id, type)) {
			var list_item = new FR.Models.ReadingListItem({
				article_id: link_id,
				article_type: type,
				user_id: window.id
			});

			list_item.save({},{
				success: function(item) {
					list_item.id = item.id;
					FR.Store.ReadingList.add(list_item);
				}
			});

			$(ev.target).text("On Reading List");
		} else {
			var item = FR.Store.ReadingList.where({article_id: link_id, article_type: type})[0];
			item.destroy({
				success: function() {
					$(ev.target).text("Add Reading List");	
				} 
			});


		} 	

	},

}); 