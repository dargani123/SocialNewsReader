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
		"news_feed": "newsFeed",
		"user_profiles/:id": "otherProfilePage"
	}, 

	profilePage: function() {
		console.log("profile page");
		var that = this; 
		var entryView = new FR.Views.NewEntryView({

		});
		var search = new FR.Views.Search(); 
		that.$rootEl.html(search.render().$el);
		that.$rootEl.append(entryView.render().$el);
	},

	requestFollowers: function() {
		var that = this;
		var search = new FR.Views.Search(); 
		that.$rootEl.html(search.render().$el);
	},

	newsFeed: function() {
		console.log("arrived at news feed method in router");
		var that = this; 
		var search = new FR.Views.Search(); 
		that.$rootEl.html(search.render().$el);
		var newsFeedView = new FR.Views.NewsFeedView({
			collection: FR.Store.Articles
		}); 
		that.$rootEl.append(newsFeedView.render().$el);
	},

	otherProfilePage: function(id) {
		var that = this;
		var search = new FR.Views.Search(); 
		that.$rootEl.html(search.render().$el);

		var otherProfilePageView; 

		$.getJSON(
			"/user_profiles/" + id, 
			function(entries) {
				//console.log(entries);
				otherProfilePageView = new FR.Views.OtherProfile({
					collection: new FR.Collections.Entries(entries)
				});
			}
		).done(
			function(){
				that.$rootEl.append(otherProfilePageView.render().$el);
			}
		);


	}




})
	
