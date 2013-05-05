class Follower < ActiveRecord::Base
  attr_accessible :type, :uid, :user_id, :name, :following_id
end

