FR.Views.NavbarView = Backbone.View.extend ({ 

	

	render: function() {
		var that = this; 
		var renderedContent = JST['navbar'](); 

		that.$el.html(renderedContent);
		return that; 
	}



}); 