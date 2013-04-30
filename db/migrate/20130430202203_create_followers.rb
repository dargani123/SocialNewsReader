class CreateFollowers < ActiveRecord::Migration
  def change
    create_table :followers do |t|
      t.references :user
      t.integer :uid
      t.string :type

      t.timestamps
    end
    add_index :followers, :user_id
  end
end
