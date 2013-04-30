class TwitterTweetsController < ApplicationController

	def create
		current_user.tweet(params)
		render :json => current_user
	end

end
