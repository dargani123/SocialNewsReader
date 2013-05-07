class RemakeFeedAttributes < ActiveRecord::Migration
	def change 
		remove_column :feeds, :uri, :uri 
		#add_column :feeds, :description, :string
	end 
end
