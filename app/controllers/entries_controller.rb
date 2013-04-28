class EntriesController < ApplicationController
	before_filter :authenticate_user!

	def index 
		@entries = current_user.entries 
		respond_to do |format|
			format.json { render :json => @entries }
			format.html { render :index }
		end

	end 

	def create 
		entry = Entry.new(params[:entry])
		entry.user_id = current_user.id
		entry.save
		render :json => entry
	end 	
end
