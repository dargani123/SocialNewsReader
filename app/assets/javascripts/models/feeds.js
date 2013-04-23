FR.Models.Feed = Backbone.RelationalModel.extend({ 

	relations: [{
		type: Backbone.HasMany,
		key: 'entries',
		relatedModel: 'Entry',
		collectionType: 'EntryCollection',
		reverseRelation: {
			key: 'feed'
			includeinJSON: 'id'
		}
	}]

	





});