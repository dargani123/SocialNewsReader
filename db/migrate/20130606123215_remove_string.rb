class RemoveString < ActiveRecord::Migration
	def change
		change_column :news_feed_articles, :link_id, :string, :limit => nil 
	end
end
