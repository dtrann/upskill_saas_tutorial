class ProfilesController < ApplicationController
  
  # GET request to /users/:user_id/profile/new
  def new
    # Renger a blank details form
    @profile = Profile.new
  end
  
end