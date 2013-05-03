class AddTypeToNewsFeedArticle < ActiveRecord::Migration
  def change	
  	add_column :news_feed_articles, :type, :string
  end
end
