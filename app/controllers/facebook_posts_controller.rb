class FacebookPostsController < ApplicationController
	before_filter :authenticate_user!
	def create
		p "Made it to fb post controller"
		current_user.post(params) ## Dont pass all this in!! 
		render :json => current_user
	end

end
	
	