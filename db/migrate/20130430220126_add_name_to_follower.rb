class AddNameToFollower < ActiveRecord::Migration
  def change
  	add_column :followers, :name, :string
  end
end
