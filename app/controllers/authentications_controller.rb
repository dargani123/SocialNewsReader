class AuthenticationsController < ApplicationController
  def index
    @authentications = Authentication.all
  end

  def create
    @authentication = Authentication.new(params[:authentication])
    if @authentication.save
      redirect_to authentications_url, :notice => "Successfully created authentication."
    else
      render :action => 'new'
    end
  end

  def destroy
    @authentication = Authentication.find(params[:id])
    @authentication.destroy
    redirect_to authentications_url, :notice => "Successfully destroyed authentication."
  end

  def twitter
    omni = request.env["omniauth.auth"]
    authentication = Authentication.find_by_provider_and_uid(omni['provider'], omni['uid'])
    if authentication
      authenticate(authentication)     
    elsif current_user
      add_other_account(omni['credentials'].token, omni['credentials'].secret)
    else
      user = User.new 
      # user.name = omni.info.name
      user.apply_omniauth(omni) 
      if user.save
       flash[:notice] = "Logged in."
       sign_in User.find(user.id) ## TWITTER ADD NEWS FEED STUFF STILL
       user.delay.updateTwitterFollowings
       redirect_to edit_user_registration_path
      else
       p "Twitter save false"
       session[:omniauth] = omni.except('extra')
       redirect_to new_user_registration_path
      end
    end 
  end

  def facebook
    omni = request.env["omniauth.auth"]
    authentication = Authentication.find_by_provider_and_uid(omni['provider'], omni['uid'])

    if authentication
      authenticate(authentication) # this thing never had the (authentication)?
    elsif current_user
      add_other_account(omni, omni['credentials'].token, omni['credentials'].secret)
    else
      user = User.new 
      user.email = omni['extra']['raw_info']['email']
      user.apply_omniauth(omni)  
      user.name = omni.info.name
      if user.save 
       flash[:notice] = "Logged in."
       sign_in user
       user.delay.updateFacebookFeedStories 
       redirect_to edit_user_registration_path
      else
       session[:omniauth] = omni.except('extra')
       redirect_to new_user_registration_path
      end
    end
  end

  def google_oauth2
    omni = request.env["omniauth.auth"]
    authentication = Authentication.find_by_provider_and_uid(omni['provider'], omni['uid'])
  
    if authentication
      authenticate(authentication)
    elsif current_user
      add_other_account(omni, omni['credentials'].token, omni['credentials'].secret)
    else
      user = User.new
      user.email = omni['uid']
      user.apply_omniauth(omni)
      if user.save 
       flash[:notice] = "Logged in."
       sign_in user
       redirect_to edit_user_registration_path
      else
       session[:omniauth] = omni
       session[:email] = omni['uid']
       redirect_to new_user_registration_path
      end
    end

  end
  
  def authenticate(authentication)
      flash[:notice] = "Logged in Successfully"
      sign_in_and_redirect User.find(authentication.user_id)
  end 

  def add_other_account(omni, token, token_secret)
      current_user.authentications.create!(:provider => omni['provider'], :uid => omni['uid'], :token => token, :token_secret => token_secret)
      flash[:notice] = "Authentication successful."
      sign_in_and_redirect current_user
  end

end
