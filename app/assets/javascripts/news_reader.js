window.FR = {

	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Store: {},

	initialize: function ($content, feedsData, entriesData, followersData, articlesData, readingListData){	
		FR.Store.Feeds = {};
		FR.Store.Entries = new FR.Collections.Entries(entriesData);
		FR.Store.Followers = new FR.Collections.Followers(followersData);
		FR.Store.Articles = new FR.Collections.Articles(articlesData);
		FR.Store.ReadingList = new FR.Collections.ReadingList(readingListData);
		// this.installSidebar($sidebar);

		new FR.Routers.NewsRouter($content);
		Backbone.history.start();
	},

	installSidebar: function ($sidebar) {
		var that = this; 
		var sidebarView = new FR.Views.SidebarView();

		$sidebar.html(sidebarView.render().$el);
	}
};