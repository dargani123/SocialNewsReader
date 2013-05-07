class CreateReadingListItems < ActiveRecord::Migration
  def change
    create_table :reading_list_items do |t|
      t.string :article_type
      t.integer :user_id

      t.timestamps
    end
  end
end
