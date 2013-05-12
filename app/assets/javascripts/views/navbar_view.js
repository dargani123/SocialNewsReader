FR.Views.NavbarView = Backbone.View.extend ({ 

	

	render: function() {
		var that = this; 
		var renderedContent = JST['navbar'](); 

		that.$el.html(renderedContent);
		// var search = FR.Views.Search();
		// that.$el.append(search.render().$el);

		return that; 
	}



}); 