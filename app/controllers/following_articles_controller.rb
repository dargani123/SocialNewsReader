class FollowingArticlesController < ApplicationController

	def index 
		followings = current_user.followings.includes(:user)		
		# render :json => current_user.followings.map(&:user).map(&:entriesAndName)	
		# fail 
		render :json => current_user.followings_entries.to_json(:include => { :user => {:only => :name} } )
	end


end
