class ReadingListItem < ActiveRecord::Base
  attr_accessible :article_type, :user_id, :article_id, :url

  # validates :article_id, :uniqueness => { :scope => :article_type } # must remove this because of article type bookmarklet
  validates :article_type, :presence => true 
  validates :user_id, :presence => true

  belongs_to :user
end
