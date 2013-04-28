class ChangeEntryAttributes < ActiveRecord::Migration
	def change 
		add_column :entries, :image, :string 
		add_column :entries, :provider_url, :string 
		add_column :entries, :url, :string 
		add_column :entries, :post_text, :string
		remove_column :entries, :link
		remove_column :entries, :comments
		remove_column :entries, :guid
		remove_column :entries, :pubDate  
	end 
end
