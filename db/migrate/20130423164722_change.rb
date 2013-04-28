class Change < ActiveRecord::Migration
  def change 
  	remove_column :entries, :pubDate
	add_column :entries, :pub_date, :date
  end 
end
