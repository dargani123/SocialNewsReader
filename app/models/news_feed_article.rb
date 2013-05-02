class NewsFeedArticle < ActiveRecord::Base
  attr_accessible :like_count, :comment_count, :time, :link_id, :url, :user_id

  validates :url, :presence => true
end
