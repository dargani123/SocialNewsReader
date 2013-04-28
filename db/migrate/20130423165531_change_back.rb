class ChangeBack < ActiveRecord::Migration
  def change 
  	add_column :entries, :pubDate, :date
	remove_column :entries, :pub_date
  end 

end
