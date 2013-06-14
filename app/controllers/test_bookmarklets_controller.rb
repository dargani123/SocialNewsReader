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
# <a href="javascript:

#   console.log('loaded');
#   var iframe = document.createElement('iframe');
#   iframe.src = 'http://localhost:3000/test_bookmarklets?url=' + document.location;
#   iframe.style = 'z-index: 2147483000';
#   document.getElementsByTagName('body')[0].appendChild(iframe);  

# ">Add to Reading List</a>