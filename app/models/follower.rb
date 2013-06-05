class Follower < ActiveRecord::Base
  attr_accessible :type, :uid, :user_id, :name, :following_id

  belongs_to :user, :foreign_key => :following_id, :primary_key => :id
  has_many :entries, :through => :user 

  validates :user_id, :uniqueness => { :scope => :following_id } 


end

