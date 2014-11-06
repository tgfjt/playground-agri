# coding utf-8

require 'bundler/setup'
require 'dm-core'

class Agri
  include DataMapper::Resource
  property :id, Serial
  property :temp, String
  property :hum, String
  property :created_at, DateTime
end
