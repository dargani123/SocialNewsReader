class UpdateColumnsNewsFeedTable < ActiveRecord::Migration
	def change
		remove_column :news_feed_articles, :like_count
		remove_column :news_feed_articles, :comment_count
		remove_column :news_feed_articles, :link_id
		add_column :news_feed_articles, :profile_image_url, :string 
		add_column :news_feed_articles, :name, :string 
		add_column :news_feed_articles, :author_id, :integer
		add_column :news_feed_articles, :text, :string
		add_column :news_feed_articles, :score, :integer
		add_column :news_feed_articles, :score_criteria, :string
		add_column :news_feed_articles, :link_id, :integer
		add_column :news_feed_articles, :image_url, :string
	end
end
