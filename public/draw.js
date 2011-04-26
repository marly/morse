var grey_blue = "#4878A8";
var sky_blue = "#A8D8F0";
var orange = "#F07830";
var rouge = "#781800";
var grey_teal = "#487890";
var colors = [grey_blue, sky_blue, orange, rouge];

/* Redraw the graph to show all visible characters */
function redraw_graph(characters, context) {
  context.clearRect(0, 0, 800, 350);   /* empty the graph */
  for (i in characters) {
    context.fillStyle = colors[i%4];
    if (characters[i].visible) {
      draw_bar(context, characters[i].level, i);
      label_bar(context, characters[i].character, i);
    }
  }
}

/* Label a bar of the bargraph with the correct character */
function label_bar(context, character, place) {
  context.font = "bold 18px sans-serif";
  context.textBaseline = 'top';
  context.fillText(character, 28*place+22, 305);
}

/* Draw a bar in the bargraph, height based on score */
function draw_bar(context, score, place) {
  var height = score*300;
  var ybase = 300 - score*300;
  context.fillRect(28*place + 20, ybase, 18, height);
}
