class Entry < ActiveRecord::Base
  attr_accessible :post, :title, :description, :image, :provider_url, :url, :comment


  belongs_to :user
  belongs_to :feed 

  # validates :entry_id, :uniqueness => { scope => :user_id }
end
	


