class CreateFeeds < ActiveRecord::Migration
  def change
    create_table :feeds do |t|
      t.string :guid, :uniqueness => :true
      t.string :title
      t.string :link
      t.string :description
      t.string :comments
      t.date :pubDate

      t.timestamps
    end
  end
end
