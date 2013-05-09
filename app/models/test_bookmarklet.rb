class TestBookmarklet < ActiveRecord::Base
  attr_accessible :field, :user_id 
  belongs_to :user
end
