class SinceIdTwitterToBigInt < ActiveRecord::Migration
	def change
		change_column :users, :since_id_twitter, :integer, :limit => 8
	end 

end
