source 'https://rubygems.org'

ruby '2.1.2'

gem 'sinatra'
gem 'data_mapper'
gem 'dm-core'

group :test, :development do
  gem 'rspec'
  gem 'dm-sqlite-adapter'
  gem 'sqlite3'
end

group :test do
  gem 'rack-test'
end
  
group :production do
  gem 'pg'
end
