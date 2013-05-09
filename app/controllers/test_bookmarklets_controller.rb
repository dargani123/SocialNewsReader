class TestBookmarkletsController < ApplicationController

	def create 
		p "I am in the show"
		fail
	end 	

	def index 
		TestBookmarklet.create!(field: "successful!");
		if !current_user 
			render :index
		else
			render :nothing => true 
		end
	end

end
