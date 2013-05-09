FR.Routers.NewsRouter = Backbone.Router.extend ({
	initialize: function ($rootEl) {
		var that = this;
		that.$rootEl = $rootEl;
		console.log("initialize of the router");
		var entryView = new FR.Views.NewEntryView({
			collection: FR.Store.Entries	
		});
		that.$rootEl.html(entryView.render().$el);
		Backbone.history.navigate("#followers", {trigger: true});
	},

	routes: {
		"": "profilePage",
		"entries": "feedEntriesIndex",
		"followers": "requestFollowers",
		"news_feed": "newsFeed",
		"user_profiles/:id": "otherProfilePage",
		"reading_list" : "readingList"
	}, 

	profilePage: function() {
		console.log("profile page");
		var that = this; 
		console.log(FR.Store.Entries);
		var entryView = new FR.Views.NewEntryView({
			collection: FR.Store.Entries
		});
		var search = new FR.Views.Search(); 
		that.$rootEl.html(search.render().$el);
		that.$rootEl.append(entryView.render().$el);

		var $container = $('.masonrycontainer');
	      $container.imagesLoaded(function(){
	        $container.masonry({
	          itemSelector : '.content-box',
	          columnWidth : 390,
	          isAnimated: true
	        });
	      });
	},

	requestFollowers: function() {
		var that = this;
		var search = new FR.Views.Search(); 
		that.$rootEl.html(search.render().$el);
	},

	newsFeed: function() {
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


	},

	readingList: function() {
		var that = this;
		FR.Store.ReadingList.fetch();

		var readingListView = new FR.Views.ReadingListView({
			collection: FR.Store.ReadingList
		});


		that.$rootEl.html(readingListView.render().$el);
	}






})
	
