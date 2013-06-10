class SendMailsController < ApplicationController

	def index  
		gmail = Gmail.connect("dargani123@gmail.com", "chunkerThibs5683")
		fail
	end 

	def create
		p params
		p "emails: #{params[:emails]}"
		p "password length: #{params[:password].length}" 
		p "email text: #{params[:email_text]}"
		gmail = Gmail.connect("dargani123@gmail.com", params[:password])
		if gmail.signed_in? 
			deliverMail(gmail, params['emails'], params['email_text'])
			render :nothing => true, :status => 200
		else 	
			render :json => {:errors => "Wrong Password, Try Again"}, :status => 401
		end 
	end

	def deliverMail(gmail, to_emails, email_text)
		name = current_user.name 
		to_emails.split(" ").each do |email|
			gmail.deliver! do
			  to email
			  subject "#{name} has shared from Social News Reader" 
			  text_part do
			    body "#{email_text}"
			  end
			end
		end
	end 
end
