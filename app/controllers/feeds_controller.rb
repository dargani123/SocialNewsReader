class FeedsController < ApplicationController
	respond_to :json
	respond_to :html, :only => [:index]

	def index 
		@feeds = Feed.all 

		respond_to do |format|
			format.html {render :index }
			format.json {render :json => @tasks}
		end
	end 
end
