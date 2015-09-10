var t;
var r;
var elapsed;      /* Idle time */
var was_correct;  /* Did the student guess the character on the first try? */

/* Play characters */
function play_letters(letter_list, letter_index, mt, context, errors) {
  var letter = letter_list[letter_index];
  var paused = true;
  var max_time = mt;
  was_correct = true;
  elapsed = 0;

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
  }

  var replay_letter = function() {
    was_correct = false;
    show_letter(letter, false);
    play_letter();
    elapsed = 0;
  }

  var new_letter = function() {
    window.clearInterval(r);
    graduate();
    letter = letter_list[choose_letter(letter_list)];
    play_letter();
    r = window.setInterval(replay_letter, max_time + offset(letter.character));
    elapsed = 0;
  }

  $('html').keydown(function(e) {

    /* Handle pausing/resuming, toggle on spacebar press */
    if (e.which == 32) {
      if (paused) {
        paused = false;
        update_pause('pause');
        play_letter();
        t = window.setInterval(increment_elapsed, 10);
        r = window.setInterval(replay_letter, max_time + offset(letter.character));
      } else {
        paused = true;
        update_pause('resume');
        window.clearInterval(t);
        window.clearInterval(r);
      }

    }

    /* Handle character scoring */
    /* If correct character pressed after the entire thing was heard and before
     * the max_time
     */
    if (letter.ascii_code == e.which &&
        10*elapsed < max_time + offset(letter.character) &&
        10*elapsed - offset(letter.character) > 0) {   
      if (was_correct) {
        letter.score(true);             
        max_time = new_wait_time(max_time, 10*elapsed);
      } else {
        letter.score(false);
        was_correct = true;                 /* Correct this time, reset */
      }
      show_letter(letter, true);
      new_letter();
      /* TODO: Recaulculate max_time based on previous response */
    }
  });

}

/* Update pausing information */
function update_pause(pause_action) {
  var p = '<h3>Press spacebar to ' + pause_action + '.</h3>';
  $('h3').remove();
  $('#labelling').append(p);
}

/* Make audio */
// Caveat: Changing the src and player.load()/player.play() leads to playback
//         issues in Chrome, so we do the stupid thing and recreate the player
//         each time.
function make_audio(letter) {
  var player = document.getElementById('morse-player');
  if (player) 
    player.parentNode.removeChild(player);

  fragment = '<audio src="' + letter.wav + '" id="morse-player" type="audio/wav"></audio>';
  document.body.insertAdjacentHTML('beforeend', fragment);
  player = document.getElementById('morse-player');
  player.play();
}

/* Print last letter played */
function show_letter(letter, correct) {
  css_class = (correct ? "correct" : "incorrect");
  $('#letter').remove();
  var l = '<div id="letter" class="' + css_class + '">' + letter.character + '</div>';
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

