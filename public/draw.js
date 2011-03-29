var grey_blue = "#4878A8";
var sky_blue = "#A8D8F0";
var orange = "#F07830";
var rouge = "#781800";
var grey_teal = "#487890";
var graph_bar_colors = [grey_blue, sky_blue, orange, rouge];

var character_order = "Q7ZG098O1JPWLRAM6BXDYCKN23FU45VHSITE";
var cw_chars = new Array();
var error_rate = 0;

$(document).ready(function()  {
  initialize_character_arrays();

  var example = document.getElementById("bargraph");
  var context = example.getContext('2d');
  var letter_index = 0;

  redraw_graph(context);
 
  $('#press_me>p').text(cw_chars[letter_index].character);

  $('*').keydown(function(event) {
    for (i in cw_chars) {
      if (cw_chars[i].ascii_code == event.which) {
        var passed = cw_chars[letter_index].score(event.which);
        error_rate = update_score(error_rate, passed);

        /* Accelerate character decay rate if the error rate is low */
        if (error_rate < 0.1)
          cw_chars[letter_index].score(event.which);

        /* Graduate if necessary and redraw */
        graduate();
        redraw_graph(context);

        /* Only change the chosen letter if guessed correctly. */ 
        if (passed) {
          letter_index = choose_letter();
          $('audio').remove();
          var a = '<audio src="' +  cw_chars[letter_index].wav + '" autoplay="true"></audio>';
          $('body').append(a);
          $('#press_me>p').text(cw_chars[letter_index].character);
        }


        break;
      }
    }
  });
});

/* Update score */
function update_score(current_score, passed) {
  return 0.875*current_score + (passed ? 0 : 0.125)
}

/* Initialize a morse character object */
function morse_character(character, level, visible) {
  this.character = character;
  this.ascii_code = character.charCodeAt(0);
  this.level = level;
  this.visible = visible;
  this.wav = 'sounds/' + character + '.wav'
  this.make_visible = function() { this.visible = true; };

  this.score = function(c) {
    var passed = (c == this.ascii_code)
    this.level = update_score(this.level, passed);
    return passed;
  }
}

/* Initialze the cw_chars and ascii_characters arrays */
function initialize_character_arrays() {
  for (c in character_order) {
    cw_chars.push(new morse_character(character_order[c], 1.0, false)); 
  }

  /* Make the first 3 characters visible. */
  for (i=0;i<3;i=i+1) { cw_chars[i].make_visible(); }
}


/* Redraw the graph to show all visible characters */
function redraw_graph(context) {
  context.clearRect(0, 0, 800, 350);
  for (i in cw_chars) {
    context.fillStyle = graph_bar_colors[i%4];
    if (cw_chars[i].visible) {
      var height = cw_chars[i].level*300;
      var ybase = 300 - cw_chars[i].level*300;
      context.fillRect(28*i + 20, ybase, 18, height);
      context.font = "bold 18px sans-serif";
      context.textBaseline = 'top';
      context.fillText(cw_chars[i].character, 28*i+22, 305);
    }
  }
}

/* Choose a letter weighted by knowledge of letter */
function choose_letter() {
  var sum = 0.0;

  for (i in cw_chars) {
    if (cw_chars[i].visible)
      sum = sum + cw_chars[i].level;
  }

  sum = sum * Math.random();

  for (i in cw_chars) {
    if (cw_chars[i].visible) {
      sum = sum - cw_chars[i].level;

      if (sum < 0) 
        return i;
     }
   
  }
}

function graduate() {
  if (error_rate > 0.3)
    return;
  else {
    for (i in cw_chars) {
      if (cw_chars[i].visible && cw_chars[i].level > 0.4) return;
      else if (!cw_chars[i].visible) {
        cw_chars[i].make_visible();
        return;
      }
    }
  }
}
