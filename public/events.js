var character_order = "Q7ZG098O1JPWLRAM6BXDYCKN23FU45VHSITE";
var error_rate = 0;

$(document).ready(function()  {
  var cw_chars = initialize_character_arrays();

  var example = document.getElementById("bargraph");
  var context = example.getContext('2d');
  var letter_index = 0;

  redraw_graph(cw_chars, context);
  play_letters(cw_chars, 0, 5000, context, error_rate);
});

/* Initialze the cw_chars and ascii_characters arrays */
function initialize_character_arrays() {
  var cw_chars = new Array();
  for (c in character_order) {
    cw_chars.push(new morse_character(character_order[c], 1.0, false)); 
  }

  /* Make the first 3 characters visible. */
  for (i=0;i<3;i=i+1) { cw_chars[i].make_visible(); }
  return cw_chars;
}

/* Initialize a morse character object */
function morse_character(character, level, visible) {
  this.character = character;
  this.ascii_code = character.charCodeAt(0);
  this.level = level;
  this.visible = visible;
  this.wav = 'sounds/' + character + '.wav'
  this.make_visible = function() { this.visible = true; };

  /* update level and overall error rate based on pass/fail */
  this.score = function(passed) {
    error_rate = update_score(error_rate, passed);
    this.level = update_score(this.level, passed);
  }
}

/* Update score */
function update_score(current_score, passed) {
  return 0.875*current_score + (passed ? 0 : 0.125);
}

