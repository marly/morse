var character_order = "Q7ZG098O1JPWLRAM6BXDYCKN23FU45VHSITE";
var grey_blue = "#4878A8";
var sky_blue = "#A8D8F0";
var orange = "#F07830";
var rouge = "#781800";
var grey_teal = "#487890";

var graph_bar_colors = [grey_blue, sky_blue, orange, rouge];
var morse_characters = new Array();

$(document).ready(function()  {
  initialize_character_arrays();

  var example = document.getElementById("bargraph");
  var context = example.getContext('2d');
  var current_letter_index = 0;

  redraw_graph(context);
 
  $('#press_me>p').text(morse_characters[current_letter_index].character);

  $('body').keydown(function(event) {
    for (i in morse_characters) {
      if (morse_characters[i].ascii_code == event.which) {
        morse_characters[current_letter_index].score(event.which);
        redraw_graph(context);
        current_letter_index = choose_letter();
        $('#press_me>p').text(morse_characters[current_letter_index].character);
        break;
      }
    }
  });
});

/* Initialize a morse character object */
function morse_character(character, level, visible) {
  this.character = character;
  this.ascii_code = character.charCodeAt(0);
  this.level = level;
  this.visible = visible;
  this.make_visible = function() { this.visible = true; };
  this.score = function(c) {
    if (c == this.ascii_code)
      this.level = 0.875* this.level;
    else
      this.level = 0.875*this.level + 0.125;
  }
}

/* Initialze the morse_characters and ascii_characters arrays */
function initialize_character_arrays() {
  for (c in character_order) {
    morse_characters.push(new morse_character(character_order[c], 1.0, false)); 
  }

  /* Make the first 3 characters visible. */
  for (i=0;i<3;i=i+1) { morse_characters[i].make_visible(); }
}


/* Redraw the graph to show all visible characters */
function redraw_graph(context) {
  context.clearRect(0, 0, 800, 300);
  for (i in morse_characters) {
    context.fillStyle = graph_bar_colors[i%4];
    if (morse_characters[i].visible) {
      var height = morse_characters[i].level*300;
      var ybase = 300 - morse_characters[i].level*300;
      context.fillRect(28*i + 20, ybase, 18, height);
      context.font = "bold 18px sans-serif";
      context.textBaseline = 'top';
      context.fillText(morse_characters[i].character, 28*i+22, 305);
    }
  }
}

function choose_letter() {
  var sum = 0.0;

  for (i in morse_characters) {
    if (morse_characters[i].visible)
      sum = sum + morse_characters[i].level;
  }

  sum = sum * Math.random();

  for (i in morse_characters) {
    if (morse_characters[i].visible) {
      sum = sum - morse_characters[i].level;

      if (sum < 0) 
        return i;
     }
   
  }
}
