# Morse

Learn morse code in your browser!

See it in action here: [Link](http://learnmorse.online)

An HTML5/Javascript rewrite of Ward Cunningham's morse teaching software:

  [Ward Cunningham's Morse on GitHub](http://github.com/WardCunningham/morse)

## Run it

    $ bundle install
    $ ruby app.rb

## Change WPM

    $ rake build_morse[wpm]  # replace wpm with words per minute

(Re)create sound files for testing at different speeds. Replace `wpm` with the
however many words per minute you'd like. The default is 20.

    $ rake                   # 20 words per minute
    $ rake build_morse[10]   # 10 words per minute

## TODO

1. Abandon jQuery
2. Save your status
3. IE compatibility
4. Variable wpm
