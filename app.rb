require 'sinatra'
require 'haml'

get '/style.css' do
  sass :style
end

get '/' do
  haml :index
end
