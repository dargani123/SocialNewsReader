class CreateNewsFeedArticles < ActiveRecord::Migration
  def change
    create_table :news_feed_articles do |t|
		t.string :like_count
		t.string :comment_count
		t.string :time
		t.string :link_id
		t.string :url
		t.references :user

      t.timestamps
    end
  end
end
