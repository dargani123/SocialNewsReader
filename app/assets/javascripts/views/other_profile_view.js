FR.Views.OtherProfile = Backbone.View.extend({
	
	initialize: function() {
		var that = this; 
		var $button = $("<button class=follow></button>");	
		this.id = parseInt(document.URL.substring(document.URL.lastIndexOf('/') + 1));
		$button.text(this._FollowButtonText());
		this.$el.html($button);

		// // // var listButton = new FR.Views.ReadingListButtonView();
		// that.$el.append(listButton.render().$el);
	},

	_FollowButtonText: function(){
		return (this._isFollowing() ? "UnFollow" : "Follow");
	},

	_isFollowing: function() {
		var that = this; 
		return ( 
				FR.Store.Followers.where({
					following_id: that.id
				}).length > 0); 
	},

	events: {
		"click .follow": "follow",
		"click .add-reading-list": "addReadingList"
	},	

	addReadingList: function(ev){
		var listButton = new FR.Views.ReadingListButtonView();
		listButton.addToReadingList(ev, this.collection);
	},

	render: function(){

		var renderedContent = JST['entries/list']({
			entries: this.collection
		});

		this.$el.append(renderedContent);

		var $container = $('.masonrycontainer');
	      $container.imagesLoaded(function(){
	        $container.masonry({
	          itemSelector : '.content-box',
	          columnWidth : 380,
	          isAnimated: true
	        });
	    });

		return this; 
	}, 

	follow: function() { 
		var that = this; 

		if (!that._isFollowing()) {
			var following = new FR.Models.Follower({
				following_id: this.id, user_id: window.id
			});

			following.save({},{
				success: function(big_data) {
					following.id = big_data.id;
					FR.Store.Followers.add(following);
				}
			});
			$(".follow").text("UnFollow");
		} else {
			var following = FR.Store.Followers.findWhere({following_id: this.id});
			following.destroy({
				success: function() {
					$(".follow").text("Follow");
				} 
			});
		} 
	}

});

