
class Feed < ActiveRecord::Base
  attr_accessible :icon_url, :title, :description 

  has_many :entries
  belongs_to :user

  def last_entries(n)
  	entries[entries.length-n+1..-1]
  end


end
