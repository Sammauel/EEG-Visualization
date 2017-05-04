'use strict';

// ##########
// Draw graph
// ##########

// Overview chart
var overviewChart = d3.select("#overview_chart"),
    marginOverview = {top: 20, right: 80, bottom: 80, left: 110},
    widthOverview = overviewChart.attr("width") - marginOverview.left - marginOverview.right,
    heightOverview = overviewChart.attr("height") - marginOverview.top - marginOverview.bottom,
    gOverview = overviewChart.append("g").attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");

// set the ranges
var xOverview = d3.scaleLinear().range([0, widthOverview]),
    yOverview = d3.scaleLinear().range([heightOverview, 0]),
    zOverview = d3.scaleOrdinal(d3.schemeCategory10);

// define the line
var lineOverview = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return xOverview(d.time); })
    .y(function(d) { return yOverview(d.val); });


// Mini chart 1
var miniChart1 = d3.select("#mini_chart1"),
    margin = {top: 20, right: 80, bottom: 80, left: 110},
    width = miniChart1.attr("width") - margin.left - margin.right,
    height = miniChart1.attr("height") - margin.top - margin.bottom,
    gMiniChart1 = miniChart1.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the ranges
// var x = d3.scaleLinear().range([0, width]),
//     y = d3.scaleLinear().range([height, 0]),
//     z = d3.scaleOrdinal(d3.schemeCategory10);

// define the line
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.val); });


// Mini chart 2
var miniChart2 = d3.select("#mini_chart2"),
    margin = {top: 20, right: 80, bottom: 80, left: 110},
    width = miniChart2.attr("width") - margin.left - margin.right,
    height = miniChart2.attr("height") - margin.top - margin.bottom,
    gminiChart2 = miniChart2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the ranges
// var x = d3.scaleLinear().range([0, width]),
//     y = d3.scaleLinear().range([height, 0]),
//     z = d3.scaleOrdinal(d3.schemeCategory10);

// define the line
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.val); });

// Get the data for initial graphs
d3.csv("http://127.0.0.1:5000/csv/suj28_l2nap_day1_100ms.csv", type, function(error, data) {
  if (error) {
    throw error;
  }

  // Log data to console
  console.log("typeof data...");
  console.log(typeof data);
  console.log(data);

  // Graph overview chart
  var channelsOverview = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {time: d.time, val: d[id]};
      })
    };
  });

  // Scale the range of the data
  xOverview.domain(d3.extent(data, function(d) { return d.time; }));
  yOverview.domain([
    d3.min(channelsOverview, function(c) { return d3.min(c.values, function(d) { return d.val; }); }),
    d3.max(channelsOverview, function(c) { return d3.max(c.values, function(d) { return d.val; }); })
  ]);

  // Draw x axis
  gOverview.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + heightOverview + ")")
      .call(d3.axisBottom(xOverview));

  // Draw text label for x-axis
  gOverview.append("text")             
      .attr("transform",
            "translate(" + (widthOverview/2) + " ," + 
                           (heightOverview + marginOverview.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Time (ms)");

  // Draw y axis
  gOverview.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(yOverview))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("");

  // Draw text label for y-axis
  gOverview.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - marginOverview.left)
      .attr("x",0 - (heightOverview / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value");

  // Add line path
  var channelOverview = gOverview.selectAll(".channel")
    .data(channelsOverview)
    .enter().append("g")
      .attr("class", "channel");

  channelOverview.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return lineOverview(d.values); })
      .style("stroke", function(d) { return zOverview(d.id); });

  channelOverview.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + xOverview(d.value.time) + "," + yOverview(d.value.val) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
});

function type(d, i, columns) {
  for (var i = 0, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}

// ########
// Buttons to toggle channels
// ########

let channels = ['Fp1', 'Fz', 'F3', 'F7', 'FT9', 'FC5', 'FC1', 'C3', 'T7', 'CP5', 
                'CP1', 'Pz', 'P3', 'P7', 'O1', 'Oz', 'O2', 'P4', 'P8', 'TP10', 'CP6',
                'CP2', 'Cz', 'C4', 'T8', 'FT10', 'FC6', 'FC2', 'F4', 'F8', 'Fp2', 'AF7', 
                'AF3', 'AFz', 'F1', 'F5', 'FT7', 'FC3', 'FCz', 'C1', 'C5', 'TP7', 'CP3',
                'P1', 'P5', 'PO7', 'PO3', 'POz', 'PO4', 'PO8', 'P6', 'P2', 'CPz', 'CP4',
                'TP8', 'C6', 'C2', 'FC4', 'FT8', 'F6', 'F2'
                ];

for (let i=0; i<channels.length; i++) {
  $("#channel_toggle_buttons").append("<button>" + channels[i] + "</button>");

}



