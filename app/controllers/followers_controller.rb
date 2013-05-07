class FollowersController < ApplicationController
	
	def index 
		followings = current_user.followings
		"SHOULD NOT BE GETTING TO FOLLOWERS CONTROLLER RIGHT NOW"
		render :json => followings 
	end 

	def create
		current_user.followings.create(following_id: params[:following_id], user_id: current_user.id)
		render :json => current_user.followings.last
	end 

	def destroy 
		render :json => Follower.delete(params[:id]);
	end 
end
