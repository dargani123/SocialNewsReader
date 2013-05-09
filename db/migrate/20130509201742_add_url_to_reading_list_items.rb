class AddUrlToReadingListItems < ActiveRecord::Migration
  def change
  	add_column :reading_list_items, :url, :string

  end
end
