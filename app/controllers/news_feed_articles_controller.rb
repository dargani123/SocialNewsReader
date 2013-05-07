class NewsFeedArticlesController < ApplicationController
	
	def index 
		current_user.updateTwitterFeedStories if current_user.linkedTwitter?
		current_user.updateFacebookFeedStories if current_user.linkedFacebook?
		start = 5 * params[:page].to_i
		render :json => current_user.news_feed_articles
									.sort_by(&:time)
									.reverse[start..start+5]

		### NEED TO LOOK AT THIS SORT BY AND DO IT SMARTER. 12 hours, then by score. 
	end

	def update
		article = NewsFeedArticle.find(params[:id])
		article.update_attributes(params[:news_feed_article]);
		render :json => article
	end


end
