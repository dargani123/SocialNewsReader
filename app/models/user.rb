require 'Thread'

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
	has_many :news_feed_articles
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
		graph.get_connections("me", "friends")
	end 

	def facebook_friend_ids 
		friend_ids = facebook_friends.raw_response['data'].map { |d| d["id"] }.map(&:to_i)
	end

	def tweet(params)
		client = Twitter::Client.new(
			:consumer_key => "SGgdy9uvxEHy9Ke7FMllg",
			:consumer_secret => "48clrGvF9lTocZSVgLGoyguQqOKgnXjpGHHBFFhNQ",
			:oauth_token => twitter_token,
			:oauth_token_secret => secret_twitter_token
		)

		client.update("#{params['post']} #{params['url']}")
	end

	def followingOnTwitter(ids=[])
		client = Twitter::Client.new(
			:consumer_key => "SGgdy9uvxEHy9Ke7FMllg",
			:consumer_secret => "48clrGvF9lTocZSVgLGoyguQqOKgnXjpGHHBFFhNQ",
			:oauth_token => twitter_token,
			:oauth_token_secret => secret_twitter_token
		)
		full = client.friends
		f = client.friends(:skip_status => 1)
		p "THIS IS THE FRIENDS OUTPUT"
		p full
		p "THIS IS THE HOMETIMELINE OUTPUT!!!!!"
		p client.home_timeline(:count => 200, :include_entities => true)
	end

	def updateTwitterFollowings 
		unless authentications.where(provider: "twitter").empty?
			followingOnTwitter.each do |friend| 
				TwitterFollower.create!(user_id: self.id, name: friend[:name], uid: friend[:id])
			end
		end
	end 

	def updateFacebookFollowings
		graph = Koala::Facebook::API.new(facebook_token)
		unless authentications.where(provider: "facebook").empty?
			facebook_friends.each do |friend| 
				FacebookFollower.create!(user_id: self.id, name: friend['name'], uid: friend['id'])
			end 
		end
#graph.fql_query("SELECT url, owner, like_info, comment_info, created_time FROM link WHERE owner IN () AND created_time > (now() - 86400/2) ORDER BY created_time DESC")
	end


	def updateFacebookFeedStories
		graph = Koala::Facebook::API.new(facebook_token)
		friend_ids = facebook_friend_ids
		threads = []
		0.upto(20) do |i| 
			threads << Thread.new { 
					p "i: #{i}"
					ids = []
					index = (i*10)
					1.upto([10, friend_ids.count - index].min)  { |j| ids << friend_ids[j+index] } 
					query = "SELECT url, link_id, owner, like_info, comment_info, created_time FROM link WHERE owner IN (#{ids.join(",")}) AND created_time > (now() - 86400/2) ORDER BY created_time DESC"				
					graph.fql_query(query) { |results| insertNewsFeedEntryifValid(results) }
			}
		end

		threads.each { |aThread| aThread.join }

	end

	def post(params)
		graph = Koala::Facebook::API.new(facebook_token)
		graph.put_connections("me", "links", :link => params['url'], :message => params['post'])
	end 


	private 
		def insertNewsFeedEntryifValid(results)
			p "insert News"
			p results
			## must add news check here 
			results.each do |result|
			NewsFeedArticle.create!(
				url: result['url'],
				like_count: result['like_info']['like_count'],
				comment_count: result['comment_info']['comment_count'],
				time: result['created_time'],
				link_id: result['link_id'],
				user_id: self.id
			)
			end

		end

end
