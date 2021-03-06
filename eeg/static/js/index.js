'use strict';

// List of channel names
var channels = ['F3','F4','C3','C4','O1','O2'];

// var channels = ['Fp1', 'Fz', 'F3', 'F7', 'FT9', 'FC5', 'FC1', 'C3', 'T7', 'CP5', 
//                 'CP1', 'Pz', 'P3', 'P7', 'O1', 'Oz', 'O2', 'P4', 'P8', 'TP10', 'CP6',
//                 'CP2', 'Cz', 'C4', 'T8', 'FT10', 'FC6', 'FC2', 'F4', 'F8', 'Fp2', 'AF7', 
//                 'AF3', 'AFz', 'F1', 'F5', 'FT7', 'FC3', 'FCz', 'C1', 'C5', 'TP7', 'CP3',
//                 'P1', 'P5', 'PO7', 'PO3', 'POz', 'PO4', 'PO8', 'P6', 'P2', 'CPz', 'CP4',
//                 'TP8', 'C6', 'C2', 'FC4', 'FT8', 'F6', 'F2'
//                 ];

// Create channel buttons
for (var i=0; i<channels.length; i++) {
  $("#channel_toggle_buttons").append("<button class='btn btn-default channel_button' id=" + channels[i] + "-button>" + channels[i] + "</button>");
}

// Click event for channel buttons
$(".channel_button").click(function() {
  console.log("Channel button clicked...");

  // Get id of clicked elemented to get channel name
  var channelName = $(this).attr("id");
  channelName = channelName.substring(0, channelName.indexOf("-"))
  var htmlId = channelName + '_chart';
  console.log("Channel: " + channelName);
  // Append svg to overview_plots div. We will draw plot on this svg.
  $("#overview_plots").append("<h3>" + channelName + "</h3>");
  $("#overview_plots").append("<svg id=" + htmlId + " width='960' height='500'></svg>");
  drawSubplot(channelName, htmlId);
  $("#overview_plots").append("<svg id=spindles_" + htmlId + " width='960' height='100'></svg>");
  drawSpindlePlot(channelName, htmlId);
});

// Draw subplot when a channel button is clicked
function drawSubplot(channelName, htmlId) {
  // Get channel index
  var channelIndex = channels.indexOf(channelName);
  var jsonUrl = "http://127.0.0.1:5000/draw_overview_plot/" + channelIndex;

  // d3 queue - https://github.com/d3/d3-queue
  queue()
    .defer(d3.json, jsonUrl)
    .await(ready);

  function ready(error, data) {
    if (error) throw error;

    var svg = d3.select("#" + htmlId);
    var margin = {top: 30, right: 20, bottom: 150, left: 40};
    var margin2 = {top: 370, right: 20, bottom: 80, left: 40};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var height2 = +svg.attr("height") - margin2.top - margin2.bottom;

    var x = d3.scaleLinear().range([0, width]);
    var x2 = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var y2 = d3.scaleLinear().range([height2, 0]);

    var xAxis = d3.axisBottom(x);
    var xAxis2 = d3.axisBottom(x2);
    var yAxis = d3.axisLeft(y).ticks(0)
      .tickSizeOuter(0);

    var line = d3.line()
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.data[0]); });

    var line2 = d3.line()
      .x(function(d) { return x2(d.time); })
      .y(function(d) { return y2(d.data[0]); });

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    // Focus should be the zoomed part on top
    var focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .append("text") // Add axis text label
      .attr("fill", "#000")
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 100) + ")")
      .attr("text-anchor", "end")
      .text("Time (ms)");

    // Context should be the 'minimap' below
    var context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
      .append("text") // Add axis text label
      .attr("fill", "#000")
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .attr("text-anchor", "end")
      .text("Time (s)");
      
    var leftHandle = 0;
    var rightHandle = 1140;
    
    var currentExtent = [0,0]
    
    var brush = d3.brushX()
      .extent([[leftHandle, 0], [rightHandle, height2]])
      .on("brush start", updateCurrentExtent)
      .on("brush end", brushed);
    
    var zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on("zoom", zoomed);

    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain(d3.extent(data, function(d) { return d.data[0]; }));
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

    focus.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    focus.append("g")
          .attr("class", "axis axis--y")
          .call(yAxis);

    context.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line2);

    context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

    context.append("g")
            .attr("class", "brush")
            .on("click", brushed)
            .call(brush)
            .call(brush.move, [0, 180000].map(x));
  
    // Zoom box in minimap
    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function updateCurrentExtent() {
      currentExtent = d3.brushSelection(this);
    }

    function brushed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") {
        return;
      }
      var s = d3.event.selection;
      
      var p = currentExtent;
      var xTime = x2(180000);
      var left;
      var right;
      
      if (d3.event.selection && s[1] - s[0] >= xTime) {
        if (p[0] == s[0] && p[1] < s[1]) { // case where right handle is extended
          if (s[1] >= width) {
            left = width - xTime
            right = width
            s = [left, right];
          }
          else {
            left = s[1] - xTime/2
            right = s[1] + xTime/2
            s = [left, right];
          }
        }
        else if (p[1] == s[1] && p[0] > s[0]) { // case where left handle is extended
          if (s[0] <= 0) {
            s = [0, xTime];
          }
          else {
            s = [s[0] - xTime/2, s[0] + xTime/2]
          }
        }
      }
      
      if (!d3.event.selection) { // if no selection took place and the brush was just clicked
        var mouse = d3.mouse(this)[0];
        if (mouse < xTime/2) {
          s = [0,xTime];
        }
        else if (mouse + xTime/2 > width) {
          s = [width-xTime, width];
        }
        else {
          s = [d3.mouse(this)[0]-xTime/2, d3.mouse(this)[0]+xTime/2];
        }
      }
      
      x.domain(s.map(x2.invert, x2));
      focus.select(".line").attr("d", line);
      focus.select(".axis--x").call(xAxis);
      svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                         .scale(width / (s[1] - s[0]))
                         .translate(-s[0], 0));
    }

    function zoomed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") {
        return; // ignore zoom-by-brush
      }
      var t = d3.event.transform;
      x.domain(t.rescaleX(x2).domain());
      focus.select(".line").attr("d", line);
      focus.select(".axis--x").call(xAxis);
      context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }
  }

}


function drawSpindlePlot(channelName, htmlId) {
  // Get channel index
  var channelIndex = channels.indexOf(channelName);
  var jsonUrl = "http://127.0.0.1:5000/json/spindle1.json";
  var svg = d3.select("#spindles_" + htmlId),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleLinear().rangeRound([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  d3.json(jsonUrl, function(error, data) {
    if (error) throw error;

    x.domain([0, 1800]);
    y.domain(d3.extent(data, function(d) { return d["Amplitude"]; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(0)
          .tickSizeOuter(0))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d["Onset"]); })
        .attr("y", function(d) { return y(d["Amplitude"]); })
        .attr("fill", "steelblue")
        .attr("width", 3)
        .attr("height", function(d) { return height - y(d["Amplitude"]); });
  });
}