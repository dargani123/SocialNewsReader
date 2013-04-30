class FollowerController < ApplicationController
responds_to :json 

	def index 
		followers = current_user.followers
		p "SHOULD NOT BE GETTING TO FOLLOWERS CONTROLLER RIGHT NOW"
		fail 
	end 
end
