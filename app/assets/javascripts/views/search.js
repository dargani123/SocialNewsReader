FR.Views.Search = Backbone.View.extend ({ 

	initialize: function() {
		var that = this;
		var $input = $("<input class='add-follower-input todo-search' id='follower-add' type='text' value='' placeholder='Search'>");	
		that.$el.html($input);



		$input.autocomplete({
			source: "/user_profiles?term-name",
			minLength: 2,
			select: function(event, ui) {
				that.id = (ui.item.id);
			}
	 	});

	},

	events: {
		"keyup .add-follower-input" : "UserEntered",
		"click a.ui-corner-all": "UserClicked"
	},

	render: function() {
		var that = this;	
		return that;
	},

	UserEntered: function(event) {
		console.log(this.id);
		if (event.keyCode == 13) {
			console.log($(event.target).val());

			if (this.id === window.user_id){
				Backbone.history.navigate("", {trigger: true});
				console.log("id's are equal")
			}
			else 
				Backbone.history.navigate("#/user_profiles/"+this.id, {trigger:true, replace:true});
		};	
	},

})

