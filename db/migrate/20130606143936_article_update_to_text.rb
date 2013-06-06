class ArticleUpdateToText < ActiveRecord::Migration
	def change
		change_column :news_feed_articles, :description, :text, :limit => nil		
	end
end
