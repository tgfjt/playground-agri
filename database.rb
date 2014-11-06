# coding utf-8

$LOAD_PATH.unshift File.dirname(__FILE__)

require 'bundler/setup'
require 'dm-core'
require 'dm-migrations'
require 'agri.rb'

class Database
  def connect
    DataMapper.setup(:default, ENV['DATABASE_URL'] || 'sqlite3:db.sqlite3')
    self
  end
  def migrate
    DataMapper.auto_migrate!
    self
  end
end
