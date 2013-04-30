class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :validatable,
         :recoverable, :rememberable, :trackable
  devise :omniauthable, :omniauth_providers => [:facebook, :twitter]

  
  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  attr_accessible :provider, :uid


	has_many :entries
	has_many :feeds
	has_many :authentications

	has_many :followings, :class_name => "Follower"


	def apply_omniauth(omni)
	authentications.build(
                       :provider => omni['provider'],
                       :uid => omni['uid'],
                       :token => omni['credentials'].token,
                       :token_secret => omni['credentials'].secret)
	end

	def password_required?
		p "password required called"
		p (authentications.empty? || !password.blank?) && super
		(authentications.empty? || !password.blank?) && super
	end

	def update_with_password(params, *options)
	 if encrypted_password.blank?
		 update_attributes(params, *options)
	 else
		 super
	 end
	end

	def facebook_token 
		authentications.where(provider: "facebook").first.token
	end

	def twitter_token
		authentications.where(provider: "twitter").first.token
	end

	def secret_twitter_token 
		authentications.where(provider: "twitter").first.token_secret
	end

	def facebook_friends 
		graph = Koala::Facebook::API.new(facebook_token)
		graph.get_object("me")
		graph.get_connections("me", "friends")
	end 

	def tweet(params)
		client = Twitter::Client.new(
			:consumer_key => "ndRglMyRouyQRbxOrGuHdw",
			:consumer_secret => "7iEAecdYUVyPpyOtB2IxISmJGCbJy9XVWkt1TEbyEY",
			:oauth_token => twitter_token,
			:oauth_token_secret => secret_twitter_token
		)

		client.update("#{params['post']} #{params['url']}")
	end

	def updatedFollowings
		facebook_friends.each do |friend| 
			Follower::FacebookFollower.create!(user_id: self.id, name: friend['name'], uid: friend['id'])
		end 
		return followings
	end

	def post(params)
		graph = Koala::Facebook::API.new(facebook_token)
		p "URL!!!!!!!"
		p params['url']
		graph.put_connections("me", "links", :link => params['url'], :message => params['post'])
	end 

end
