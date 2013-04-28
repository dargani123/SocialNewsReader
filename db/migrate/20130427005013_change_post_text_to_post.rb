class ChangePostTextToPost < ActiveRecord::Migration
	def change 
		rename_column :entries, :post_text, :post
	end
end
