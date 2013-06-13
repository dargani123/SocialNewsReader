class ChangeIdsFromIntegerToString < ActiveRecord::Migration
	def change
		change_column :reading_list_items, :article_id, :string
		change_column :news_feed_articles, :link_id, :string 
		change_column :followers, :uid, :string
	end
end
