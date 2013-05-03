// FR.Models.Feed = Backbone.RelationalModel.extend({ 
// 	urlRoot: "/feeds",
// 	relations: [{
// 		type: Backbone.HasMany,
// 		key: 'entries',
// 		relatedModel: 'FR.Models.Entry',
// 		collectionType: 'FR.Collections.FeedEntries',
// 		reverseRelation: {
// 			key: 'feed'
// 		},

// 		collectionOptions: function (feed) {
// 			return {feed: feed};
// 		}
// 	}],

// 	schema: {
// 		uri: "Text"
// 	}

// });