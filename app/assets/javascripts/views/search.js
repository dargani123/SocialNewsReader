FR.Views.Search = Backbone.View.extend ({ 

	events: {
		"keyup .add-follower-input" : "UserEntered",
		"click a.ui-corner-all": "UserClicked"
	},

	render: function() {
		var that = this;

		that.$el.html($("<input class='add-follower-input todo-search' id='follower-add' type='text' value='' placeholder='Search'>"));


		 $(function() {
			function log( message ) {
				$( ".add-follower-input" ).val( message )
	    	}

	    	$( ".add-follower-input" ).autocomplete({
				source: "/user_profiles",
				minLength: 2,
				select: function(event, ui) {
					log( ui.item ? ui.item.name : "search");
				}
	     	});
    	});	











		// var availableTags = [];
		// 	$.getJSON(
		// 		"/user_profiles", 
		// 		function(users) {
		// 			_(users).each(function(user){ 
		// 				availableTags.push(user.name);
		// 				console.log(availableTags);
		// 			});
		// 		}
		// 	).done(
		// 		function() { 
		// 			$(".add-follower-input").autocomplete({
		// 				source: availableTags
		// 			});			
		// 		}
		// 	);
	

		return that;
	},

	UserEntered: function(event) {
		console.log(event.keyCode);
		if (event.keyCode == 13) {
			console.log($(event.target).val());
			// var following = new FR.Models.Follower({id: 1});
			// FR.Store.Followers.add(following);
			// following.save({},
			// 	success: function() {
			// 		console.log("success");
			// 	}); 	
			$.ajax({url: "/followers", 
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			data: {id: 4},
			success: function(data) {
				Backbone.history.navigate("#/user_profiles/"+4, {trigger:true})
			}
			// 	$.ajax({url: "/followers", 
			// type: 'POST',
			// beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			// data: {id: 4},
			// success: function(data) {
			// 	backbone.history.
			// }
		});	

		
		 }
	},

	UserClicked: function(event) {
		console.log("pressed");
		console.log(event.target.val());
	}

})

