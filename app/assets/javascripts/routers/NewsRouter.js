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

		var entryView = new FR.Views.NewEntryView({
			collection: FR.Store.Entries
		});

		var search = new FR.Views.Search(); 
		that.$rootEl.html(search.render().$el);
		that.$rootEl.append(entryView.render().$el);

		var $container = $('.masonrycontainer');
		console.log("here");
	      $container.imagesLoaded(function(){
	        $container.masonry({
	          itemSelector : '.content-box',
	          columnWidth : 380,
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

		console.log("news feed view collection" , newsFeedView.collection);
		console.log("page #", newsFeedView.page);

		FR.Store.Articles.fetch({ // rails or	]der does not matter here, need to sort it in the client side
			success: function(articles){
				newsFeedView._cleanse();
				newsFeedView.page++; 
			}
		});


		newsFeedView._addFollowingsArticle(that.$rootEl);

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

				var $container = $('.masonrycontainer');
				$container.imagesLoaded(function(){
					$container.masonry({
						itemSelector : '.content-box',
						columnWidth : 380,
						isAnimated: true
					});
				});
			}
		);


	},

	readingList: function() {
		var that = this;

		var readingListView = new FR.Views.ReadingListView({
			collection: FR.Store.ReadingList
		});
		
		that.$rootEl.html(readingListView.render().$el);
	}






})
	
