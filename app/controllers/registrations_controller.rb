class RegistrationsController < Devise::RegistrationsController

	def build_resource(*args)
		super
		if session[:omniauth]
			@user.apply_omniauth(session[:omniauth])
			@user.email = session[:email] if session[:email]
			@user.valid?
			# @user.name = session[:omniauth].info.name
		end
	end

	def create
		super
		session[:omniauth] = nil unless @user.new_record?
	end

	def new
		if session[:omniauth] && User.find_by_email(session[:email])
			session[:omniauth] = nil;
			session[:email] = nil;
			flash[:notice] = "Someone already used that gmail account!"
			redirect_to new_user_session_url 
		else 
			super
		end
	end

end
