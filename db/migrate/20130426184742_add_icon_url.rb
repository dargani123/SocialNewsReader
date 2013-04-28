class AddIconUrl < ActiveRecord::Migration
	def change 
		add_column :feeds, :icon_url, :string
	end
end
