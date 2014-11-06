require_relative '../spec_helper'

describe 'Root Path' do
  describe 'GET /' do
    before { get '/' }

    it 'is successful' do
      expect(last_response.status).to eq 200
    end
  end
end

describe 'Health Check Path' do
  describe 'GET /status' do
    before { get '/status' }

    it 'is successful' do
      expect(last_response.status).to eq 200
    end
  end
end
