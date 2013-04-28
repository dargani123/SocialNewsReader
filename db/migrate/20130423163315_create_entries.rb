class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.string :guid, :uniqueness => :true
      t.string :title
      t.string :link
      t.string :description
      t.string :comments
      t.date :pubDate
      t.integer :feed_id

      t.timestamps
    end
  end
end
