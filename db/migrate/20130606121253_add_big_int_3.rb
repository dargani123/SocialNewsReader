class AddBigInt3 < ActiveRecord::Migration
	def change
		remove_column :news_feed_articles, :link_id
		add_column :news_feed_articles, :link_id, :integer, :limit => 8
	end
end
