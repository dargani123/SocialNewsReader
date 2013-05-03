class AddDescriptionAndTextForFacebook < ActiveRecord::Migration
	def change 
		add_column :news_feed_articles, :description, :string 
		add_column :news_feed_articles, :title, :string
	end
end
