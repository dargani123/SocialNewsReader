class FollowersController < ApplicationController

	def index 
		followings = current_user.followings
		"SHOULD NOT BE GETTING TO FOLLOWERS CONTROLLER RIGHT NOW"
		render :json => followings 
	end 

	def create
		current_user.followings.create(user_id: params[:id], following_id: current_user.id)
		render :json => current_user.followings
	end 
end
