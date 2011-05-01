var t;
var r;
var elapsed;

/* Play characters */
function play_letters(letter_list, letter_index, max_time, context, errors) {
  var letter = letter_list[letter_index];
  var paused = false;
  elapsed = 0;
  make_audio(letter);

  var graduate = function() {
    if (errors > 0.3)
      return;
    else {
      for (i in letter_list) {
        if (letter_list[i].visible && letter_list[i].level > 0.4) return;
        else if (!letter_list[i].visible) {
          letter_list[i].make_visible();
          return;
        }
      }
    }
  }
  var increment_elapsed = function() { elapsed = elapsed + 1; }

  var play_letter = function() {
    redraw_graph(letter_list, context);
    elapsed = 0;
    make_audio(letter);
  }

  var replay_letter = function() {
    letter.score(false);
    show_letter(letter, false);
    play_letter();
  }

  var new_letter = function() {
    window.clearInterval(r);
    letter.score(true);
    graduate();
    letter = letter_list[choose_letter(letter_list)];
    play_letter();
    r = window.setInterval(replay_letter, max_time);
  }

  t = window.setTimeout(increment_elapsed, 1);
  r = window.setInterval(replay_letter, max_time);

  $('html').keydown(function(e) {

    /* Handle pausing/resuming */
    if (e.which == 32) {
      if (paused) {
        paused = false;
        t = window.setTimeout(increment_elapsed(), 1);
        r = window.setInterval(replay_letter, max_time);
      } else {
        paused = true;
        window.clearTimeout(t);
        window.clearInterval(r);
      }

    }

    if (letter.ascii_code == e.which && elapsed < max_time) {
      show_letter(letter, true);
      new_letter();
      /* TODO: Recaulculate max_time based on previous response */
    }
  });

}

/* Make audio */
function make_audio(letter) {
  $('audio').remove();
  var a = '<audio src="' +  letter.wav + '" autoplay="true"></audio>';
  $('body').append(a);
}

/* Print last letter played */
function show_letter(letter, correct) {
  css_class = (correct ? "correct" : "incorrect");
  $('#press_me>p').remove();
  var l = '<p class="' + css_class + '">' + letter.character + '</p>';
  $('#press_me').append(l);
}

/* Choose a letter weighted by knowledge of letter */
function choose_letter(letter_list) {
  var sum = 0.0;

  for (i in letter_list) {
    if (letter_list[i].visible)
      sum = sum + letter_list[i].level;
  }

  sum = sum * Math.random();

  for (i in letter_list) {
    if (letter_list[i].visible) {
      sum = sum - letter_list[i].level;

      if (sum < 0) 
        return i;
     }
   
  }
}

