class SinceIdTwitterToString < ActiveRecord::Migration
	def change 
		change_column :users, :since_id_twitter, :string, :limit => nil
	end
end
