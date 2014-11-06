# coding utf-8

ENV['RACK_ENV'] ||= 'development'

$LOAD_PATH.unshift File.dirname(__FILE__)

require 'bundler'

require 'sinatra/base'
require 'data_mapper'
require 'dm-migrations'
require 'json'

require 'agri.rb'

DataMapper.setup(:default, ENV['DATABASE_URL'] || 'sqlite3:db.sqlite3')
DataMapper.finalize

class AgriApp < Sinatra::Base
  set :root, File.dirname(__FILE__)

  get '/' do
    erb :index
  end

  get '/all' do
    content_type :json

    @agris = Agri.all(
      order: [:id.desc],
      limit: 10
    )

    @agris.to_json
  end

  # health check ping
  get '/status' do
    status 200
    body 'Status: 200'
  end

  before '/create/?' do
    params[:temp] ||= '/'
    params[:hum] ||= '/'
  end

  get '/create/?' do
    @agri = Agri.create(
      temp: params[:temp],
      hum: params[:hum],
      created_at: Time.now
    )

    erb :create
  end

  post '/create/?' do
    content_type :json

    @agri = Agri.create(
      temp: params[:temp],
      hum: params[:hum],
      created_at: Time.now
    )

    @agri.to_json
  end

  get '/remove/:id' do
    unless params[:id].empty?
      @agri = Agri.get(params[:id])

      if @agri.nil?
        '削除対象がありません。'
      else
        @agri.destroy
        erb :remove
      end
    end
  end
end
