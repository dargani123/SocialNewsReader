FR.Views.EntryItemView = Backbone.View.extend({

	initialize: function() {
		var that = this;
		$("button.format").click(function() {
			var text = $("button.format").text(); 
			console.log(text);
			if (text === "List View")
				that.$el.removeClass('content-box');
			else {
				that.$el.addClass('content-box');
			}
			that.render(); 
		});
	},

	render: function() { 
		var that = this;
		var renderedContent; 

		if ($("button.format").text() === "List View") { 
			renderedContent = JST['entries/single_entry_list']({
				entry: that.model
			});
		} else {			
			renderedContent = JST['entries/single_entry_tile']({
				entry: that.model
			});
		}

		that.$el.html(renderedContent);
		if ($("button.format").text() === "Tile View") { 
			that.$el.addClass('content-box');
		}
		return that;
	}

}); 
