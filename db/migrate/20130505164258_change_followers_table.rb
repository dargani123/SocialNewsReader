class ChangeFollowersTable < ActiveRecord::Migration
	def change 
		add_column :followers, :following_id, :integer
	end 
end
