class NewsFeedTextToString < ActiveRecord::Migration
	def change
		change_column :news_feed_articles, :text, :text, :limit => nil
		change_column :news_feed_articles, :description, :text, :limit => nil		
	end
end
