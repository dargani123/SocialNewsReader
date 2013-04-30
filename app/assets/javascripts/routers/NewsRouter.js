FR.Routers.NewsRouter = Backbone.Router.extend ({
	initialize: function ($rootEl) {
		var that = this;
		that.$rootEl = $rootEl;
		that.entryView = new FR.Views.NewEntryView();

		that.$rootEl.html(that.entryView.render().$el);
	},

	routes: {
		"": "feedIndex",
		"entries": "feedEntriesIndex",
	}
})
	

// 	feedEntriesIndex: function (id) {
// 		console.log("index")
// 		var that = this; 
// 		var request = "http://api.embed.ly/1/extract?key=f2e77f3d830e4cb28df18b29e0d07084&url=";
// 		var embedly_entries = [];

// 		that.model.get("entries").fetch({
// 			success: function (collection, response, options) { 
// 				console.log("entries");
// 				console.log(that.model.get("entries"));
				
// 				that.model.get(entries).each(function (entry){
// 					$.ajax({
// 						dataType: "JSONP",
// 						url: request+escape(entry.get('link')),
// 						success: function(embedly_data) {
// 							//console.log(embedly_data)
// 							embedly_entries.push(embedly_data);
// 							// console.log(embedly_data.title);
// 						},
// 						// complete: [function(){
// 						// 	console.log(embedly_entries[0]);
// 						// 	var renderedContent = JST["entries/list"]({
// 						// 		entries: embedly_entries
// 						// 	});
// 						// 	that.$el.html(renderedContent);
// 						// }, function() { 
// 						// 	that.createEntriesView();
// 						// }] 
// 					});
// 				});


				

// 			}	
// 		});
// 	},

// 	createEntriesView: function() {
// 		console.log("create entrires");
// 		var feed_entries_view = new FR.Views.FeedEntries({
// 			model: FR.Store.Feeds.get(id)
// 		});
// 		that.$rootEl.html(feed_entries_view.render().$el);
// 	}

// });

		// that.model.get("entries").fetch({
		// 	success: function () { 
		// 		console.log("entries");
		// 		console.log(that.model.get("entries"));

		// 		that.model.get("entries").each (function (entry) {
		// 			//console.log(request+escape(entry.get('link')));
		// 			$.ajax({
		// 					dataType: "JSON",
		// 					url: request+escape(entry.get('link')),
		// 					success: function(embedly_data) {
		// 						//console.log(embedly_data)
		// 						embedly_entries.push(embedly_data);
		// 						// console.log(embedly_data.title);
		// 					},
		// 					complete: function(){
		// 						console.log(embedly_entries[0]);
		// 						var renderedContent = JST["entries/list"]({
		// 							entries: embedly_entries
		// 						});
		// 						that.$el.html(renderedContent);
		// 					}
		// 			});
		// 		});
		// 	}
		// });