FR.Views.NewsFeedView = Backbone.View.extend({
	
	render: function() {
		$.ajax({url: "/news_feed_articles", 
			type: 'GET',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			success: function(data) {
				console.log(data);
				console.log("success function");
			}
		});
		this.$el.html = $("loaded news feed view");
		return this;
	}

})