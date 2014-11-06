# coding utf-8

ENV['RACK_ENV'] = 'test'
 
require 'bundler/setup'
require 'rack/test'

require_relative File.join('..', 'app')
 
RSpec.configure do |config|
  include Rack::Test::Methods
 
  def app
    AgriApp
  end
end
