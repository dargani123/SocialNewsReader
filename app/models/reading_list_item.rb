class ReadingListItem < ActiveRecord::Base
  attr_accessible :article_type, :user_id, :article_id

  validates :article_id, :uniqueness => { :scope => :article_type } 
  validates :article_type, :presence => true 
  validates :user_id, :presence => true

  belongs_to :user
end
