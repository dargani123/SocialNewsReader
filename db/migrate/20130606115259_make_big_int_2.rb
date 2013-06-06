class MakeBigInt2 < ActiveRecord::Migration
	def change
		change_column :news_feed_articles, :link_id, :integer, :limit => 8
	end
end
