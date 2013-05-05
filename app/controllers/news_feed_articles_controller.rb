class NewsFeedArticlesController < ApplicationController
	
	def index 
		current_user.updateTwitterFeedStories if current_user.linkedTwitter?
		current_user.updateFacebookFeedStories if current_user.linkedFacebook?
		render :json => current_user.news_feed_articles.sort_by(&:score).reverse
		### NEED TO LOOK AT THIS SORT BY AND DO IT SMARTER. 12 hours, then by score. 
	end

	def update
		article = NewsFeedArticle.find(params[:id])
		article.update_attributes(params[:news_feed_article]);
		render :json => article
	end


end
