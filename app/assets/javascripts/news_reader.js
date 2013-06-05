window.FR = {

	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Store: {},

	initialize: function ($content, feedsData, entriesData, followersData, articlesData, readingListData, $navbar, name){	
		FR.Store.Feeds = {};
		FR.Store.Entries = new FR.Collections.Entries(entriesData);
		FR.Store.Followers = new FR.Collections.Followers(followersData);
		FR.Store.Articles = new FR.Collections.Articles(articlesData);
		FR.Store.ReadingList = new FR.Collections.ReadingList(readingListData);
		FR.Store.username = name;

		new FR.Routers.NewsRouter($content);
		this.installNavbar($navbar);
		Backbone.history.start();
	},

	installSidebar: function ($sidebar) {
		var that = this; 
		var sidebarView = new FR.Views.SidebarView();

		$sidebar.html(sidebarView.render().$el);
	},

	installNavbar: function($navbar) {
		var that = this; 
		var navbar = new FR.Views.NavbarView(); 
		$navbar.append(navbar.render().$el);
	}
};