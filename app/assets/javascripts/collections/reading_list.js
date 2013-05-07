FR.Collections.ReadingList = Backbone.Collection.extend({
	model: FR.Models.ReadingListItem,
	url: "/reading_list_items"
})