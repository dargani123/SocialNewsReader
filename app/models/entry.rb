class Entry < ActiveRecord::Base
  attr_accessible :comments, :description, :guid, :link, :pubDate, :title, :feed_id

  belongs_to :feed

  validates :guid, :uniqueness => { :scope => :feed_id}

end
	