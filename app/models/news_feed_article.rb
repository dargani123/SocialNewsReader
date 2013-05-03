class NewsFeedArticle < ActiveRecord::Base

  attr_accessible :time, :url, :user_id, :profile_image_url, :name, :author_id, :text, :score, :score_criteria, :link_id, :image_url, :type

  validates :url, :presence => true
end

class FacebookArticle < NewsFeedArticle

end 

class TwitterArticle < NewsFeedArticle

end 