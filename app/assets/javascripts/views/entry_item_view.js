FR.Views.EntryItemView = Backbone.View.extend({

	initialize: function(vars) {
		var that = this;
		that.name = vars.name;
		that.$el.addClass("entry-article");
		that.$el.attr("article-id", that.model.get('id'));
		
		$("button.format").click(function() {
			var text = $("button.format").text(); 
			if (text === "List View")
				that.$el.removeClass('content-box');
			else 
				that.$el.addClass('content-box');
			that.render(); 
		});
	},

	render: function() { 
		var that = this;
		var renderedContent; 

		if ($("button.format").text() === "List View") { 
			renderedContent = JST['entries/single_entry_list']({
				entry: that.model,
				name: that.name
			});
		} else {	
		console.log(that.name);		
			renderedContent = JST['entries/single_entry_tile']({
				entry: that.model,
				name: that.name
			});
		}

		that.$el.html(renderedContent);
		if ($("button.format").text() === "Tile View") { 
			that.$el.addClass('content-box');
		}
		return that;
	}

}); 
