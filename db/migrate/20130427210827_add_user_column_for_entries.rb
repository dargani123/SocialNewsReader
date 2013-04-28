class AddUserColumnForEntries < ActiveRecord::Migration
def change 
	add_column :entries, :user_id, :integer
	add_column :feeds, :user_id, :integer
end 
end
