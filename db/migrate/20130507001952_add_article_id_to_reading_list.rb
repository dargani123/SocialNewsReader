class AddArticleIdToReadingList < ActiveRecord::Migration
  def change
  	add_column :reading_list_items, :article_id , :integer
  end
end
