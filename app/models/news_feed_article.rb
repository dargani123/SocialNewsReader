class NewsFeedArticle < ActiveRecord::Base

  attr_accessible :time, :url, :user_id, :profile_image_url, :name, :author_id, :text, :score, :score_criteria, :link_id, :image_url, :type, :title, :description 

  validates :url, :presence => true
  validates :url, :uniqueness => true

  def as_json(options = {})
  	hash = super(options)
  	hash["type"] = type
  	hash
  end
end

class FacebookArticle < NewsFeedArticle

end 

class TwitterArticle < NewsFeedArticle

end 