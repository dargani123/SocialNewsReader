# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130606144052) do

  create_table "authentications", :force => true do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "uid"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "token"
    t.string   "token_secret"
  end

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "entries", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.integer  "feed_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "image"
    t.string   "provider_url"
    t.string   "url"
    t.string   "post"
    t.integer  "user_id"
  end

  create_table "followers", :force => true do |t|
    t.integer  "user_id"
    t.integer  "uid"
    t.string   "type"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "name"
    t.integer  "following_id"
  end

  add_index "followers", ["user_id"], :name => "index_followers_on_user_id"

  create_table "news_feed_articles", :force => true do |t|
    t.string   "time"
    t.string   "url"
    t.integer  "user_id"
    t.datetime "created_at",        :null => false
    t.datetime "updated_at",        :null => false
    t.string   "profile_image_url"
    t.string   "name"
    t.integer  "author_id"
    t.text     "text"
    t.integer  "score"
    t.string   "score_criteria"
    t.string   "image_url"
    t.string   "type"
    t.text     "description"
    t.string   "title"
    t.string   "link_id"
  end

  create_table "reading_list_items", :force => true do |t|
    t.string   "article_type"
    t.integer  "user_id"
    t.integer  "article_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "url"
  end

  create_table "test_bookmarklets", :force => true do |t|
    t.string   "field"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "user_id"
  end

  create_table "users", :force => true do |t|
    t.datetime "created_at",                                            :null => false
    t.datetime "updated_at",                                            :null => false
    t.string   "email",                                 :default => "", :null => false
    t.string   "encrypted_password",     :limit => 128, :default => ""
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "name"
    t.string   "since_id_twitter"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
