class AddUserForTestBookmarklet < ActiveRecord::Migration
def change 
	add_column :test_bookmarklets, :user_id, :integer 
end 
end
