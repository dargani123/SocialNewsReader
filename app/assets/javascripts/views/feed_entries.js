FR.Views.FeedEntries = Backbone.View.extend ({
	render: function () {
		var that = this; 


		//  var request = "http://api.embed.ly/1/extract?key=f2e77f3d830e4cb28df18b29e0d07084&url=";
		// // var url = escape("http://dealbook.nytimes.com/2013/04/24/down-payment-rules-are-at-heart-of-mortgage-debate/")
		
		// // $.ajax({
		// // 	dataType: "JSON",
		// // 	url: request+url,
		// // 	success: function(data) {
		// // 		console.log(data);
		// // 	}
		// // });
		
		// var embedly_entries = [];

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
		


		return that; 
	},



});
