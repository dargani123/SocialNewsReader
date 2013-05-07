class ReadingListItemsController < ApplicationController

	def index 
		render :json => current_user.reading_list_items
	end

	def create
		current_user.reading_list_items.create!(user_id: current_user.id, article_type: params['article_type'], article_id: params['article_id'])
		render :json => current_user.reading_list_items.last
	end 

	def destroy 
		render :json => ReadingListItem.delete(params[:id].to_i);
	end 
end
