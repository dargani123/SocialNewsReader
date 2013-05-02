FR.Views.FollowerView = Backbone.View.extend ({ 

	render: function() {
		var that = this; 
		//var renderedContent = JST["followers/followers_to_add"]
		console.log("Follower View Achieved");
		console.log(FR.Store.Followers);
		that.$el.html("success");
		return that;
	}

})