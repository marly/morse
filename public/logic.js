var t;
var r;
var elapsed;

/* Play characters */
function play_letters(letter_list, letter_index, mt, context, errors) {
  var letter = letter_list[letter_index];
  var paused = false;
  var max_time = mt;
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
    make_audio(letter);
    elapsed = 0;
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
    r = window.setInterval(replay_letter, max_time + offset(letter.character));
  }

  t = window.setInterval(increment_elapsed, 1);
  r = window.setInterval(replay_letter, max_time + offset(letter.character));

  $('html').keydown(function(e) {

    /* Handle pausing/resuming */
    if (e.which == 32) {
      if (paused) {
        paused = false;
        t = window.setInterval(increment_elapsed, 1);
        r = window.setInterval(replay_letter, max_time + offset(letter.character));
      } else {
        paused = true;
        window.clearInterval(t);
        window.clearInterval(r);
      }

    }

    if (letter.ascii_code == e.which && elapsed < max_time + offset(letter.character)) {
      max_time = new_wait_time(max_time, elapsed);
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

/* Calculate a new timeout based on the previous time required to answer. */
function new_wait_time(last_max, time_used) {
  var new_max = 0.875*last_max + 0.25*(time_used);
  return ( new_max > 6000 ? 6000 : new_max);
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

/* Return ms offset for this character */
function offset(letter) {
  /* dit time is 60 ms + 60 ms silence  = 120 ms (at 20 WPM) */
  /* dah time is 180 ms + 60 ms silence = 240 ms (at 20 WPM) */
  switch(letter) {
    /* 1 dot */
    case 'E': return 120;

    /* 1 dash, 2 dots */
    case 'T': case 'I': return 240;

    /* 1 dot 1 dash, 3 dots */
    case 'A': case 'N': case 'S': return 360;
    
    /* 2 dashes, 2 dots 1 dash, 4 dots */
    case 'M': case 'D': case 'R': case 'U': case 'H': return 480;

    /* 2 dashes 1 dot, 3 dots 1 dash, 5 dots */
    case 'G': case 'K': case 'W': case 'B': case 'L': case 'V': case 'F': case '5':
      return 600;

    /* 3 dashes, 2 dots 2 dashes, 4 dots 1 dash */
    case 'O': case 'C': case 'P': case 'X': case 'Z': case '4': case '6':
      return 720;

    /* 3 dashes 1 dot, 2 dashes 3 dots */
    case 'J': case 'Q': case 'Y': case '3': case '7': return 840;

    /* 3 dashes 2 dots */
    case '2': case '8': return 960;

    /* 4 dashes 1 dot */
    case '1': case '9': return 1080;

    /* 5 dashes */
    default: return 1200;
  }

}

