class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
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
	authentications.build(
                       :provider => omni['provider'],
                       :uid => omni['uid'],
                       :token => omni['credentials'].token,
                       :token_secret => omni['credentials'].secret)
	end

	# def password_required?
	# 	p "password required called"
	# 	p (authentications.empty? || !password.blank?) && super
	# 	(authentications.empty? || !password.blank?) && super
	# end

	# def update_with_password(params, *options)
	#  if encrypted_password.blank?
	# 	 update_attributes(params, *options)
	#  else
	# 	 super
	#  end
	# end

	# def self.find_or_create_by_facebook_oauth(auth)
	# 	user = User.where(:provider => auth.provider, :uid => auth.uid).first

	# 	unless user
	# 		user = User.create!(
	# 		provider: auth.provider,
	# 		uid: auth.uid,
	# 		email: auth.info.email,
	# 		password: Devise.friendly_token[0,20]
	# 		)
	# 	end
	# 	user
	# end

end
