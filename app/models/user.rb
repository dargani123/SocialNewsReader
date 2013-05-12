# require 'Thread'
require 'json'

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :validatable,
         :recoverable, :rememberable, :trackable
  devise :omniauthable, :omniauth_providers => [:facebook, :twitter]

  
  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me

  # after_save :updateTwitterFollowings	

  	has_many :authentications
	has_many :entries
	has_many :feeds
	has_many :database_authenticatableions
	has_many :news_feed_articles
	has_many :followings, :class_name => "Follower"
	has_many :reading_list_items
	


	def apply_omniauth(omni)
	authentications.build(
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

	def facebook_friends 
		graph = Koala::Facebook::API.new(facebook_token)
		graph.get_connections("me", "friends")
	end 

	def facebook_friend_ids 
		friend_ids = facebook_friends.raw_response['data'].map { |d| d["id"] }.map(&:to_i)
	end

	def tweet(params)
		client = getTwitterClient
		client.update("#{params['post']} #{params['url']}")
	end

	def followingOnTwitter(ids=[])
		client = getTwitterClient
		return client.friend_ids
	end

	def updateTwitterFeedStories 
		if news_feed_articles.where(type: "TwitterArticle").empty? || Time.now - 86400/2 > news_feed_articles.where(type: "TwitterArticle").last.created_at
			client = getTwitterClient
			timeline = client.home_timeline(:count => 400, :include_entities => true)
			timeline.each do |status|
				insertTwitterArticle(status)
			end
		end
	end

	def getTwitterClient
		return Twitter::Client.new(
			:consumer_key => "48wDtsMN0T8yITXKsKFbQ",
			:consumer_secret => "eH4P4Nny7FutPTRmAGpZFoDYMumbpnr46CSskETxeyA",
			:oauth_token => twitter_token,
			:oauth_token_secret => secret_twitter_token
		)
	end

	def updateTwitterFollowings 
		if linkedTwitter?
			followingOnTwitter.each do |friend| 
				TwitterFollower.create!(user_id: self.id, uid: friend)
			end
		end
	end 

	def updateFacebookFollowings
		graph = Koala::Facebook::API.new(facebook_token)
		if linkedFacebook?
			facebook_friends.each do |friend| 
				FacebookFollower.create!(user_id: self.id, name: friend['name'], uid: friend['id'])
			end 
		end
	end


	def updateFacebookFeedStories ## move this to a background job.
		if news_feed_articles.where(type: "FacebookArticle").empty? || Time.now - 86400/2 > news_feed_articles.where(type: "FacebookArticle").last.created_at 
			graph = Koala::Facebook::API.new(facebook_token)
			friend_ids = facebook_friend_ids
			threads1, threads2, threads3, results = [], [], [], []

			0.upto(30) do |i| 
				threads1 << Thread.new { 
						ids = []
						index = (i*10) 
						1.upto([10, friend_ids.count - index].min)  { |j| ids << friend_ids[j+index] } 
						query = "SELECT comment_info, created_time, like_info, link_id, owner, title, owner_comment, picture, url, summary FROM link WHERE owner IN (#{ids.join(",")}) AND created_time > (now() - 86400/2) ORDER BY created_time DESC"
						p query 
						graph.fql_query(query) {|result| results << result unless result.empty? }
				}
			end

			threads1.each { |aThread| aThread.join }

			(31).upto(60) do |i| 
				threads2 << Thread.new { 
						ids = []	
						index = (i*10) 
						1.upto([10, friend_ids.count - index].min)  { |j| ids << friend_ids[j+index] } 
						query = "SELECT comment_info, created_time, like_info, link_id, owner, title, owner_comment, picture, url, summary FROM link WHERE owner IN (#{ids.join(",")}) AND created_time > (now() - 86400/2) ORDER BY created_time DESC"
						p query 
						graph.fql_query(query) {|result| results << result unless result.empty? }
				}
			end

			threads2.each { |aThread| aThread.join }

			(61).upto(90) do |i| 
				threads3 << Thread.new { 
						ids = []	
						index = (i*10) 
						1.upto([10, friend_ids.count - index].min)  { |j| ids << friend_ids[j+index] } 
						query = "SELECT comment_info, created_time, like_info, link_id, owner, title, owner_comment, picture, url, summary FROM link WHERE owner IN (#{ids.join(",")}) AND created_time > (now() - 86400/2) ORDER BY created_time DESC"
						p query 
						graph.fql_query(query) {|result| results << result unless result.empty? }
				}
			end

			threads3.each { |aThread| aThread.join }

			
			results.each { |result| insertFacebookArticle(result) }

		end
	end 

	def post(params)
		graph = Koala::Facebook::API.new(facebook_token)
		graph.put_connections("me", "links", :link => params['url'], :message => params['post'])
	end 

	def linkedFacebook?
		authentications.where(provider: "facebook").count > 0
	end

	def linkedTwitter? 
		p "LINKED TWITTER CALLED"
		authentications.where(provider: "twitter").count > 0
	end

	private 
		def insertFacebookArticle(results)
			results.each do |result|
			FacebookArticle.create!( ## Missing profile_image_url and name 
				author_id: result['owner'],
				text: result['owner_comment'],
				score: (result['like_info']['like_count'] + result['comment_info']['comment_count']),
				score_criteria: { like_count: result['like_info']['like_count'], comment_count: result['comment_info']['comment_count'] }.to_json,
				time: result['created_time'],
				url: result['url'],
				link_id: result['link_id'],
				user_id: self.id,
				image_url: result['picture'],
				title: result['title'],
				description: result['summary'],
				name: facebook_friends.raw_response['data'].select { |f| f["id"] == result['owner'].to_s }.first['name']
			)
			end
		end

		def insertTwitterArticle(status) ## missing image_url
		 	if status.urls.size > 0
				TwitterArticle.create( 
					profile_image_url: status.profile_image_url,
					name: status.user.name,
					author_id: status.user.id,
					text: status.text,
					score: (status.retweet_count + status.favorite_count),
					score_criteria: {retweet: status.retweet_count, favorites: status.favorite_count}.to_json,
					time: status.created_at,
					url: status.urls.first.expanded_url, 
					link_id: status.id,
					user_id: self.id
					# type: "TwitterArticle"
				)
			end
		end

		def isValidUrl?(url)
			url.size > 0
		end

		def facebook_token 
			authentications.where(provider: "facebook").first.token if linkedFacebook?
		end

		def twitter_token
			authentications.where(provider: "twitter").first.token if linkedTwitter?
		end

		def secret_twitter_token 
			authentications.where(provider: "twitter").first.token_secret if linkedTwitter?
		end
end
		# graph.batch do |api|
		# 	1.upto([5, friend_ids.count - index].min)  do |j| 
		# 		graph.get_connections(friend_ids[j], "links") { |result| results << result}
		# 	end	 
		# end
