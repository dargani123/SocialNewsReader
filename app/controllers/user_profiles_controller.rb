class UserProfilesController < ApplicationController

	def show 
		user = User.find(params[:id])
		render :json => user.entries
	end 

	def index 
		render :json => User.all
	end

end
