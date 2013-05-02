class FollowerController < ApplicationController
responds_to :json 

	def index 
		followers = current_user.followers
		"SHOULD NOT BE GETTING TO FOLLOWERS CONTROLLER RIGHT NOW"
		render :json => followers 
	end 
end
