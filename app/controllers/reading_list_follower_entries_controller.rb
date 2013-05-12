class ReadingListFollowerEntriesController < ApplicationController
	
	def index 
		render :json => Entry.find(params[:article_id])
	end

end	