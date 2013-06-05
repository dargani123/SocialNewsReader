class RegistrationsController < Devise::RegistrationsController

	def build_resource(*args)
		super
		if session[:omniauth]
			@user.apply_omniauth(session[:omniauth])
			@user.valid?
			# @user.name = session[:omniauth].info.name
		end
	end

	def create
		super
		session[:omniauth] = nil unless @user.new_record?
	end

end
		