class UserProfilesController < ApplicationController

	def show 
		user = User.find(params[:id])
		render :json => user.entries
	end 

	def index
		users = []
		User.all.each do |user|
			users << {label: user.name, value: user.name, id: user.id}
		end
		render :json => users
	end

end
