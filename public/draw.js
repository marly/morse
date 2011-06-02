var outcast = "#e1e1e1";
var meadows = "#89ab88";
var taupe = "#b6a972";
var green_olive = "#676f23";

var colors = [green_olive, meadows, taupe];

/* Redraw the graph to show all visible characters */
function redraw_graph(characters, context) {
  context.clearRect(0, 0, 720, 200);   /* empty the graph */
  for (i in characters) {
    if (characters[i].visible) {
      context.fillStyle = colors[i%3];
    }
    else { context.fillStyle = outcast; }
    draw_bar(context, characters[i].level, i);
    label_bar(context, characters[i].character, i);
  }
}

/* Label a bar of the bargraph with the correct character */
function label_bar(context, character, place) {
  context.font = "bold 18px sans-serif";
  context.textBaseline = 'top';
  context.fillText(character, 28*place+22, 182);
}

/* Draw a bar in the bargraph, height based on score */
function draw_bar(context, score, place) {
  var height = score*180;
  var ybase = 180 - score*180;
  context.fillRect(28*place + 20, ybase, 18, height);
}
