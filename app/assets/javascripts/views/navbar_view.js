FR.Views.NavbarView = Backbone.View.extend ({ 

	render: function() {
		var that = this; 
		var renderedContent = JST['navbar'](); 

		that.$el.html(renderedContent);
		var search = new FR.Views.Search(); 
	    // that.$el.append(search.render().$el);
	    that.$el.find('.container').append(search.render().$el);

		return that; 
	}



}); 