class FollowingArticlesController < ApplicationController

	def index 
		render :json => current_user.followings.map(&:user).map(&:entries).flatten
	end
end
