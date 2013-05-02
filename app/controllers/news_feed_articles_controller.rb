class NewsFeedArticlesController < ApplicationController

	def index 
		current_user.updateFacebookFeedStories
		render :json => current_user.news_feed_articles
	end

end
