require 'sinatra'
require 'haml'

module Morse

  class App < Sinatra::Base
    get '/reset.css' do
      sass :reset
    end

    get '/morse_style.css' do
      sass :morse_style
    end

    get '/' do
      haml :morse, {:layout => :morse_layout}
    end

    get '/about' do
      haml :about, {:layout => :morse_layout}
    end
  end
end

if __FILE__ == $0
    Morse::App.run!
end
