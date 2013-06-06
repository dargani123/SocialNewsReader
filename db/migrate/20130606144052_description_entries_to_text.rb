class DescriptionEntriesToText < ActiveRecord::Migration
	def change
		change_column :entries, :description, :text, :limit => nil	
	end
end
