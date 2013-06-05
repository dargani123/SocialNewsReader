class AddSinceIdColumnForUser < ActiveRecord::Migration
	def change 
	  	add_column :users, :since_id_twitter, :integer
	end 
end
