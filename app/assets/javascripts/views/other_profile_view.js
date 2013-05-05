FR.Views.OtherProfile = Backbone.View.extend({
	render: function(){

		var renderedContent = JST['entries/list']({
			entries: this.collection
		});

		this.$el.html(renderedContent);
		return this; 
	}
});