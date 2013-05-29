FR.Routers.NewsRouter = Backbone.Router.extend ({
	initialize: function ($rootEl) {
		var that = this;
		that.$rootEl = $rootEl;
		
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
		console.log("profilePage");
		var that = this; 


		var $formatButton = $("<button class=format>List View</button>");
		that.$rootEl.html($formatButton);

		var profileView = new FR.Views.ProfileEntryView({
			collection: FR.Store.Entries
		});
		that.$rootEl.append(profileView.render().$el); 

		var $container = $('.masonrycontainer');
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
		var $formatButton = $("<button class=format>List View</button>");
		that.$rootEl.html($formatButton);

		var newsFeedView = new FR.Views.NewsFeedView({
			collection: FR.Store.Articles
		}); 

		newsFeedView._addFollowingsArticle(function() {
			FR.Store.Articles.fetch({ // rails does not matter here, need to sort it in the client side
				success: function(articles){
					$('.loading').remove();
					newsFeedView._cleanse();
					newsFeedView.render();
				}
			});
		});

		that.$rootEl.append(newsFeedView.render().$el);
		console.log(newsFeedView.page);
	},

	otherProfilePage: function(id) {
		var that = this;
		that.$rootEl.html($("<button class=format>List View</button>"));
		var otherProfilePageView; 

		$.getJSON(
			"/user_profiles/" + id, 
			function(entries) {
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
		that.$rootEl.html($("<button class=format>List View</button>"));

		FR.Store.ReadingList.fetch();

		var readingListView = new FR.Views.ReadingListView({
			collection: FR.Store.ReadingList
		});
		
		that.$rootEl.append(readingListView.render().$el);
	}






})
	
