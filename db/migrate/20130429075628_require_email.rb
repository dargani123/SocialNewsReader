class RequireEmail < ActiveRecord::Migration
  def change 
  	change_column :users, :encrypted_password, :string, :null => false 
  end 
end
