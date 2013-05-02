class Follower < ActiveRecord::Base
  attr_accessible :type, :uid, :user_id, :name 
  belongs_to :user
end

