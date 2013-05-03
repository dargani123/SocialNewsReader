FR.Routers.NewsRouter = Backbone.Router.extend ({
	initialize: function ($rootEl) {
		var that = this;
		that.$rootEl = $rootEl;
		console.log("initialize of the router");
		var entryView = new FR.Views.NewEntryView();
		that.$rootEl.html(entryView.render().$el);
		Backbone.history.navigate("#followers", {trigger: true});
	},

	routes: {
		"": "profilePage",
		"entries": "feedEntriesIndex",
		"followers": "requestFollowers",
		"news_feed": "newsFeed"
	}, 

	profilePage: function() {
		console.log("profile page");
		var that = this; 
		var entryView = new FR.Views.NewEntryView();
		that.$rootEl.html(entryView.render().$el);
	},

	requestFollowers: function() {
		var that = this;
		var followerView = new FR.Views.FollowerView(); 
		that.$rootEl.html(followerView.render().$el);
	},

	newsFeed: function() {
		console.log("arrived at news feed method in router");
		var that = this; 
		var newsFeedView = new FR.Views.NewsFeedView({
			collection: FR.Store.Articles
		}); 
		that.$rootEl.html(newsFeedView.render().$el);
	}




})
	
