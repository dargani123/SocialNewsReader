class TestBookmarkletsController < ApplicationController

	def create 
		p "I am in the show"
		fail
	end 	

	def index 	
		if !current_user 
			render :index
		else
			ReadingListItem.create!(user_id: current_user.id, url: params[:url], article_type: "bookmarklet");
			render :nothing => true 
		end
	end

end
