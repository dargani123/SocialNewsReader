class CreateTests < ActiveRecord::Migration
  def change
    create_table :test_bookmarklets do |t|
      t.string :field

      t.timestamps
    end
  end
end
