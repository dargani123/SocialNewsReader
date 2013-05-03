class Entry < ActiveRecord::Base
  attr_accessible :post, :title, :description, :image, :provider_url, :url, :comment
attr_accessible :time, :url, :user_id, :profile_image_url, :name, :author_id, :text, :score, :score_criteria, :link_id, :image_url, :type


  belongs_to :user
  belongs_to :feed 

  # validates :entry_id, :uniqueness => { scope => :user_id }
end
	


