class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable, :validatable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable
  devise :omniauthable, :omniauth_providers => [:facebook, :twitter]

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  attr_accessible :provider, :uid

	has_many :entries
	has_many :feeds
	has_many :authentications


	def apply_omniauth(omni)
		Authentication.create(
			:user_id => self.id,
			:provider => omni['provider'],
			:uid => omni['uid'],
			:token => omni['credentials'].token,
			:token_secret => omni['credentials'].secret)
	end

	def password_required?
		(authentications.empty? || !password.blank?) && super
	end

	def update_with_password(params, *options)
	 if encrypted_password.blank?
		 update_attributes(params, *options)
	 else
		 super
	 end
end

end