

var gameCount = 20;
var rankGraphPadding = 3;

var gameHistoryLength = [];
for (var i = 1; i <= gameCount; i++) {
    gameHistoryLength.push(i);
}

var maxDataPointsForDots = 50,
	transitionDuration = 1000;

var svg = null,
	yAxisGroup = null,
	xAxisGroup = null,
	dataCirclesGroup = null,
	dataLinesGroup = null;

function draw() {
	var w = $(document).width() -200,
    	h = $(document).height() / 2;
	var data = getData();
	var rankrange = rankChange();
	var margin = 40;
	var max = (rankrange.biggest + rankGraphPadding);
	var min = (rankrange.smallest - rankGraphPadding);
	var pointRadius = 4;
	var x = d3.time.scale().range([0, w - margin * 2]).domain([data[0].date, data[data.length - 1].date]);
	var y = d3.scale.linear().range([h - margin * 2, 0]).domain([min, max]);

	var xAxis = d3.svg.axis().scale(x).tickSize(h - margin * 2).tickPadding(10).ticks(7);
	var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-w + margin * 2).tickPadding(10);
	var t = null;

	svg = d3.select('#user-chart').select('svg').select('g');
	if (svg.empty()) {
		svg = d3.select('#user-chart')
			.append('svg:svg')
				.attr('width', w)
				.attr('height', h)
				.attr('class', 'viz')
			.append('svg:g')
				.attr('transform', 'translate(' + margin + ',' + margin + ')');
	}

	t = svg.transition().duration(transitionDuration);

	// y ticks and labels
	if (!yAxisGroup) {
		yAxisGroup = svg.append('svg:g')
			.attr('class', 'yTick')
			.call(yAxis);
	}
	else {
		t.select('.yTick').call(yAxis);
	}

	// x ticks and labels
	if (!xAxisGroup) {
		xAxisGroup = svg.append('svg:g')
			.attr('class', 'xTick')
			.call(xAxis);
	}
	else {
		t.select('.xTick').call(xAxis);
	}

	// Draw the lines
	if (!dataLinesGroup) {
		dataLinesGroup = svg.append('svg:g');
	}

	var dataLines = dataLinesGroup.selectAll('.data-line')
			.data([data]);

	var line = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d,i) { 
			return x(d.date); 
		})
		.y(function(d) { 
			return y(d.value); 
		})
		.interpolate("linear");

	var garea = d3.svg.area()
		.interpolate("linear")
		.x(function(d) { 
			// verbose logging to show what's actually being done
			return x(d.date); 
		})
            	.y0(h - margin * 2)
		.y1(function(d) { 
			// verbose logging to show what's actually being done
			return y(d.value); 
		});

	dataLines
		.enter()
		.append('svg:path')
            	.attr("class", "area")
            	.attr("d", garea(data));

	dataLines.enter().append('path')
		 .attr('class', 'data-line')
		 .style('opacity', 0.3)
		 .attr("d", line(data));

	dataLines.transition()
		.attr("d", line)
		.duration(transitionDuration)
			.style('opacity', 1)
                        .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.value) + ")"; });

	dataLines.exit()
		.transition()
		.attr("d", line)
		.duration(transitionDuration)
                        .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(0) + ")"; })
			.style('opacity', 1e-6)
			.remove();

	d3.selectAll(".area").transition()
		.duration(transitionDuration)
		.attr("d", garea(data));

	// Draw the points
	if (!dataCirclesGroup) {
		dataCirclesGroup = svg.append('svg:g');
	}

	var circles = dataCirclesGroup.selectAll('.data-point')
		.data(data);

	circles
		.enter()
			.append('svg:circle')
				.attr('class', 'data-point')
				.style('opacity', 1e-6)
				.attr('cx', function(d) { return x(d.date) })
				.attr('cy', function() { return y(0) })
				.attr('r', function() { return (data.length <= maxDataPointsForDots) ? pointRadius : 0 })
			.transition()
			.duration(transitionDuration)
				.style('opacity', 1)
				.attr('cx', function(d) { return x(d.date) })
				.attr('cy', function(d) { return y(d.value) });

	circles
		.transition()
		.duration(transitionDuration)
			.attr('cx', function(d) { return x(d.date) })
			.attr('cy', function(d) { return y(d.value) })
			.attr('r', function() { return (data.length <= maxDataPointsForDots) ? pointRadius : 0 })
			.style('opacity', 1);

	circles
		.exit()
			.transition()
			.duration(transitionDuration)
				// Leave the cx transition off. Allowing the points to fall where they lie is best.
				//.attr('cx', function(d, i) { return xScale(i) })
				.attr('cy', function() { return y(0) })
				.style("opacity", 1e-6)
				.remove();

      $('svg circle').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          var d = this.__data__;
	  var pDate = d.date;
          return 'Date: ' + pDate.getDate() + " " + pDate.getMonth() + " " + pDate.getFullYear() + '<br/>Rank: ' + d.value + '<br/>Result:' + d.result + '<br/>Opponent: ' + d.opponent; 
        }
      });
}

function rankChange() {
	var rankrange = [];
	var data = getData();

	for (var key in data) {
		var obj = data[key];
		for (var prop in obj) {
	      // console.log(prop + " = " + obj[prop]);
	      if(prop == 'value') {
	      	var rank = obj[prop];

	      	if(biggest == undefined) {
	      		var biggest = rank;
	      	}
			if(smallest == undefined) {
				var smallest = rank;
			}

	      	if(rank > biggest) {
	      		var biggest = rank;
	      	}
	      	if(rank < smallest) {
	      		smallest = rank;
	      	}
	      }
	    }
	}

	rankrange = {"smallest" : smallest, "biggest" : biggest, "current" : rank.toFixed(2)};
	return rankrange;
}

function getData() {
	var resultsArray = [];

	// Fake data
	var opponents = ["conanbatt", "dp", "Smar", "vui30h"];
	var results = ["B+Resignation", "B+Resignation", "B+Nuclear Tesuji", "B+6.5"];
	var ranges = ["-1.3","-2.34","-3.67","-4.17","-5.68","-6.89","-7.33","-8.67","-9.12","-10.78"];
	

	for(x = gameCount; x >= 1; x--) {
		var date = new Date(); 													// Game Date
		var newrank = ranges[Math.floor(Math.random()*ranges.length)];			// New Rank
		var result 	= results[Math.floor(Math.random()*results.length)];		// Result
		var opponent = opponents[Math.floor(Math.random()*opponents.length)];	// Opponent

		date.setDate(date.getDate() - x);
		date.setHours(0, 0, 0, 0);

		resultsArray.push({'value' : (newrank-5), 'date' : date, 'result' : result, 'opponent' : opponent});
	}
	// End fake data

	return resultsArray;
}

function doProgressBar() {
	var rankchange = rankChange();
	var currank = String(rankchange.current);
	var progress = Number(currank.substr(currank.length -2));
	console.log(progress);
	$("#progressbar").progressbar({ value: progress });
	$("#progressbar-title span").html("");
	$("#progressbar-title span").append(progress + "% (" + rankchange.current + ")")
}

d3.select('#button').on('click', function() {
	draw();
	doProgressBar();
});
draw();
doProgressBar();
$(window).resize(function() { draw(); });

