FR.Routers.NewsRouter = Backbone.Router.extend ({
	initialize: function ($rootEl) {
		var that = this;
		that.$rootEl = $rootEl;
		console.log("initialize of the router")
		Backbone.history.navigate("#followers", {trigger: true});
	},

	routes: {
		"": "profilePage",
		"entries": "feedEntriesIndex",
		"followers": "requestFollowers"
	}, 

	profilePage: function() {
		var that = this; 
		var entryView = new FR.Views.NewEntryView();
		that.$rootEl.html(entryView.render().$el);
	},

	requestFollowers: function() {
		var that = this;
		var followerView = new FR.Views.FollowerView(); 
		that.$rootEl.html(followerView.render().$el);
	}


})
	
