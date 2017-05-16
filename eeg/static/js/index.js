'use strict';

function type(d, i, columns) {
  for (var i = 0, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}

// ########
// Buttons to toggle channels
// ########

var channels = ['Fp1', 'Fz', 'F3', 'F7', 'FT9', 'FC5', 'FC1', 'C3', 'T7', 'CP5', 
                'CP1', 'Pz', 'P3', 'P7', 'O1', 'Oz', 'O2', 'P4', 'P8', 'TP10', 'CP6',
                'CP2', 'Cz', 'C4', 'T8', 'FT10', 'FC6', 'FC2', 'F4', 'F8', 'Fp2', 'AF7', 
                'AF3', 'AFz', 'F1', 'F5', 'FT7', 'FC3', 'FCz', 'C1', 'C5', 'TP7', 'CP3',
                'P1', 'P5', 'PO7', 'PO3', 'POz', 'PO4', 'PO8', 'P6', 'P2', 'CPz', 'CP4',
                'TP8', 'C6', 'C2', 'FC4', 'FT8', 'F6', 'F2'
                ];

for (var i=0; i<channels.length; i++) {
  $("#channel_toggle_buttons").append("<button class='channel_button' id=" + channels[i] + "-button>" + channels[i] + "</button>");

}

$(".channel_button").click(function() {
  console.log("Channel button clicked...");


  // Get id of clicked elemented to get channel name
  var channelName = $(this).attr("id");
  channelName = channelName.substring(0, channelName.indexOf("-"))
  var htmlId = channelName + '_chart';
  console.log("Channel: " + channelName);
  // Append svg to overview_plots div. We will draw plot on this svg.
  // Height was 80
  $("#overview_plots").append("<svg id=" + htmlId + " width='1800' height='500'></svg>")
  drawSubplot(channelName, htmlId);
});

function drawSubplot(channelName, htmlId) {
  // Get channel index
  var channelIndex = channels.indexOf(channelName);
  var jsonUrl = "http://127.0.0.1:5000/draw_overview_plot/" + channelIndex;

  queue()
    .defer(d3.json, jsonUrl)
    .await(ready);

  function ready(error, data) {
    if (error) throw error;

    var svg = d3.select("#" + htmlId);
    var margin = {top: 30, right: 20, bottom: 150, left: 40};
    var margin2 = {top: 320, right: 20, bottom: 30, left: 40};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var height2 = +svg.attr("height") - margin2.top - margin2.bottom;

    var x = d3.scaleTime().range([0, width]);
    var x2 = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var y2 = d3.scaleLinear().range([height2, 0]);

    var xAxis = d3.axisBottom(x),
    var xAxis2 = d3.axisBottom(x2),
    var yAxis = d3.axisLeft(y);

    var line = d3.line()
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.data[0]); });

    var line2 = d3.line()
      .x(function(d) { return x2(d.time); })
      .y(function(d) { return y2(d.data[0]); });
  }

  // ########
  // Code below will be removed later
  var svg = d3.select("#" + htmlId),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
      .rangeRound([0, width]);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  // Line for the plot.
  // We use d.data[0] because d.data is an array with one element.
  var line = d3.line()
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.data[0]); });

  d3.json(jsonUrl, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain(d3.extent(data, function(d) { return d.data; }));
    
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(0)
          .tickSizeOuter(0))
      .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y)
          .ticks(0)
          .tickSizeOuter(0))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "translate(-5, 20)")
        .attr("text-anchor", "end")
        .text(channelName);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
  });
}