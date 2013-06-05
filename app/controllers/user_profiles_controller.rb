class UserProfilesController < ApplicationController

	def show 
		user = User.find(params[:id])
		render :json => {entries: user.entries, username: user.name} 	
	end 

	def index
		users = []
		User.all.each do |user|
			users << {label: user.name, value: user.name, id: user.id}
		end
		render :json => users
	end

end
#### Fix the above, change up on the client side