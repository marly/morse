require 'sinatra'
require 'haml'

get '/morse_style.css' do
  sass :morse_style
end

get '/morse' do
  haml :morse, :layout => :morse_layout
end
