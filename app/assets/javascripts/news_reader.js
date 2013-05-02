window.FR = {

	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Store: {},

	initialize: function ($content, feedsData, entriesData, followersData){	
		FR.Store.Feeds = new FR.Collections.Feeds(feedsData);
		FR.Store.Entries = new FR.Collections.Feeds(entriesData);
		FR.Store.Followers = new FR.Collections.Feeds(followersData);
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