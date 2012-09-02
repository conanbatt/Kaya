$(document).ready(function() {
	$("#gamecount").keydown(function(event) {
		if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
		// Allow: Ctrl+A
		(event.keyCode == 65 && event.ctrlKey === true) ||
		// Allow: home, end, left, right
		(event.keyCode >= 35 && event.keyCode <= 39)) {
			return;
		} else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
				event.preventDefault();
				$('#gamecountwarn').fadeIn();
				setTimeout(function() {
					$('#gamecountwarn').fadeOut('slow');
				}, 3000);
			}
		}
	});
	$(function() {
		$(".datepicker").datepicker();
	});

	$(".datepicker").focus(function() {
		$("#datepicked").fadeIn().html('<br />Clear dates');
	});
	$("#datepicked").click(function() {
		$(this).html('').hide();
		$(".datepicker").val('');
	});
});

//For Ie
if (!window.console) {
	window.console = {
		log: function(str) {
			//alert(str);
		}
	};
}

function graphSettings(e) {
	gamecountsubmit = $("input[name='gamecount']").val();
	usernamesubmit = $("input[name='username']").val();
	console.log(gamecountsubmit);
	console.log(usernamesubmit);
	$("#user-chart").html('');
	if (gamecountsubmit.length > 0 || usernamesubmit.length > 0) {
		var gamecount = gamecountsubmit;
		var username = usernamesubmit;
	}
	var graph_widget = new rankgraph(gamecount, username);
	graph_widget.draw();
	e.preventDefault();
};

var rankgraph = function(gamecount, username) {

		var gameCount = gamecount || 20; // Defaults
		var userName = username || 'Smar'; // Defaults
		var rankGraphPadding = 3;

		var w = $("#user-chart").width(),
			h = $(document).height() / 2;

		var maxDataPointsForDots = ($("#user-chart").width() / 6),
			transitionDuration = 1000;

		var svg = null,
			yAxisGroup = null,
			xAxisGroup = null,
			dataCirclesGroup = null,
			dataLinesGroup = null;

		function getData() {
			var resultsArray = [];
			if(userName == 'conanbatt') {
	 			data = [{"id":"4354","black_player":"aleski","white_player":"conanbatt","black_rank":"12k","white_rank":"6d","datetime_played":"2012-09-01 16:22:12","result":"W+16.5"},{"id":"4280","black_player":"Neutron","white_player":"conanbatt","black_rank":"7k","white_rank":"6d","datetime_played":"2012-09-01 01:54:34","result":"B+Resignation"},{"id":"4271","black_player":"dp","white_player":"conanbatt","black_rank":"10k","white_rank":"6d","datetime_played":"2012-08-31 23:39:53","result":"W+Resignation"},{"id":"4264","black_player":"conanbatt","white_player":"dp","black_rank":"6d","white_rank":"10k","datetime_played":"2012-08-31 22:40:22","result":"W+Resignation"},{"id":"4166","black_player":"jv","white_player":"conanbatt","black_rank":"3d","white_rank":"6d","datetime_played":"2012-08-31 01:19:29","result":"B+Resignation"},{"id":"4165","black_player":"jv","white_player":"conanbatt","black_rank":"3d","white_rank":"6d","datetime_played":"2012-08-31 01:05:17","result":"B+Resignation"},{"id":"4161","black_player":"Jermelle","white_player":"conanbatt","black_rank":"21k","white_rank":"6d","datetime_played":"2012-08-31 00:06:59","result":"W+Resignation"},{"id":"4135","black_player":"Lior","white_player":"conanbatt","black_rank":"4d","white_rank":"6d","datetime_played":"2012-08-30 19:32:22","result":"B+Time"},{"id":"4114","black_player":"KurataKun","white_player":"conanbatt","black_rank":"2d","white_rank":"6d","datetime_played":"2012-08-30 17:42:39","result":"W+Resignation"},{"id":"3992","black_player":"KurataKun","white_player":"conanbatt","black_rank":"2d","white_rank":"7d","datetime_played":"2012-08-30 17:42:39","result":"W+Resignation"},{"id":"4039","black_player":"Kanin","white_player":"conanbatt","black_rank":"5d","white_rank":"6d","datetime_played":"2012-08-30 00:33:18","result":"W+Resignation"},{"id":"3904","black_player":"Kanin","white_player":"conanbatt","black_rank":"5d","white_rank":"7d","datetime_played":"2012-08-30 00:33:18","result":"W+Resignation"},{"id":"3903","black_player":"newbold","white_player":"conanbatt","black_rank":"18k","white_rank":"7d","datetime_played":"2012-08-29 23:31:37","result":"W+162.5"},{"id":"3900","black_player":"rsun","white_player":"conanbatt","black_rank":"2d","white_rank":"7d","datetime_played":"2012-08-29 22:26:56","result":"W+Time"},{"id":"3895","black_player":"rsun","white_player":"conanbatt","black_rank":"2d","white_rank":"6d","datetime_played":"2012-08-29 21:05:19","result":"W+10.5"},{"id":"3893","black_player":"Fabricio","white_player":"conanbatt","black_rank":"2k","white_rank":"6d","datetime_played":"2012-08-29 20:36:56","result":"W+Resignation"},{"id":"3884","black_player":"rsun","white_player":"conanbatt","black_rank":"2d","white_rank":"6d","datetime_played":"2012-08-29 18:31:28","result":"W+Time"},{"id":"3883","black_player":"rsun","white_player":"conanbatt","black_rank":"3d","white_rank":"6d","datetime_played":"2012-08-29 18:31:28","result":"W+Time"},{"id":"3813","black_player":"Kanin","white_player":"conanbatt","black_rank":"6d","white_rank":"6d","datetime_played":"2012-08-29 00:37:58","result":"B+12.5"},{"id":"3786","black_player":"Pempu","white_player":"conanbatt","black_rank":"2d","white_rank":"6d","datetime_played":"2012-08-28 18:21:49","result":"W+27.5"}];
		 	} else {
				data = [{"id":"4380","black_player":"sadmac","white_player":"Smar","black_rank":"16k","white_rank":"9k","datetime_played":"2012-09-01 21:11:57","result":"W+Resignation"},{"id":"4372","black_player":"Smar","white_player":"gekko","black_rank":"9k","white_rank":"6k","datetime_played":"2012-09-01 19:27:30","result":"B+Forfeit"},{"id":"4364","black_player":"Benyaiol","white_player":"Smar","black_rank":"15k","white_rank":"9k","datetime_played":"2012-09-01 19:03:02","result":"B+Resignation"},{"id":"4234","black_player":"Smar","white_player":"Oceandrop","black_rank":"9k","white_rank":"8k","datetime_played":"2012-08-31 16:38:12","result":"W+35.5"},{"id":"4230","black_player":"Smar","white_player":"Oceandrop","black_rank":"9k","white_rank":"8k","datetime_played":"2012-08-31 15:21:58","result":"B+Resignation"},{"id":"4138","black_player":"Smar","white_player":"Tristan","black_rank":"9k","white_rank":"8k","datetime_played":"2012-08-30 19:59:03","result":"W+Resignation"},{"id":"4057","black_player":"Smar","white_player":"chunqiu","black_rank":"9k","white_rank":"3k","datetime_played":"2012-08-30 14:07:38","result":"W+33.5"},{"id":"3933","black_player":"Smar","white_player":"chunqiu","black_rank":"9k","white_rank":"3k","datetime_played":"2012-08-30 14:07:38","result":"W+33.5"},{"id":"3867","black_player":"fournierse","white_player":"Smar","black_rank":"11k","white_rank":"9k","datetime_played":"2012-08-29 14:30:29","result":"W+Resignation"},{"id":"3711","black_player":"Smar","white_player":"Oceandrop","black_rank":"9k","white_rank":"8k","datetime_played":"2012-08-27 17:26:24","result":"B+Resignation"},{"id":"3589","black_player":"Boidhre","white_player":"Smar","black_rank":"11k","white_rank":"9k","datetime_played":"2012-08-25 21:55:12","result":"B+Resignation"},{"id":"3583","black_player":"Smar","white_player":"conanbatt","black_rank":"9k","white_rank":"6d","datetime_played":"2012-08-25 19:28:49","result":"W+36.5"},{"id":"3513","black_player":"Boidhre","white_player":"Smar","black_rank":"12k","white_rank":"9k","datetime_played":"2012-08-24 21:06:18","result":"B+69.5"},{"id":"3508","black_player":"Boidhre","white_player":"Smar","black_rank":"12k","white_rank":"9k","datetime_played":"2012-08-24 20:12:35","result":"W+45.5"},{"id":"3485","black_player":"Smar","white_player":"Oceandrop","black_rank":"10k","white_rank":"8k","datetime_played":"2012-08-24 17:19:04","result":"W+42.5"},{"id":"3449","black_player":"farful","white_player":"Smar","black_rank":"9k","white_rank":"9k","datetime_played":"2012-08-24 13:22:40","result":"B+Resignation"},{"id":"3373","black_player":"Smar","white_player":"Oceandrop","black_rank":"9k","white_rank":"9k","datetime_played":"2012-08-23 19:06:20","result":"B+0.5"},{"id":"3305","black_player":"Boidhre","white_player":"Smar","black_rank":"12k","white_rank":"9k","datetime_played":"2012-08-23 12:36:04","result":"W+19.5"},{"id":"3297","black_player":"Mixerman","white_player":"Smar","black_rank":"12k","white_rank":"10k","datetime_played":"2012-08-23 11:42:58","result":"W+Resignation"},{"id":"3084","black_player":"Smar","white_player":"farful","black_rank":"10k","white_rank":"9k","datetime_played":"2012-08-22 17:43:38","result":"W+Resignation"}];
			}

			$.each(data, function(keys, values) {
				var gamelink = '<a href="http://beta.kaya.gs/gospeed/' + values['id'] + '" target="_blank">View Game</a>';
				if (values['white_player'] == userName) {
					if(values['white_rank'].indexOf("d") > 0) {
						var newrank = values['white_rank'].substring(0, values['white_rank'].length - 1);
					} else {
						var newrank = "-" + values['white_rank'].substring(0, values['white_rank'].length - 1);
					}
					var opponent = values['black_player'];
				} else {
					if(values['black_rank'].indexOf("d") > 0) {
						var newrank = values['black_rank'].substring(0, values['black_rank'].length - 1);
					} else {
						var newrank = "-" + values['black_rank'].substring(0, values['black_rank'].length - 1);
					}
					var opponent = values['white_player'];;
				}
				var date = new Date(values['datetime_played']);
				var result = values['result'];

				resultsArray.push({
					'gamelink': gamelink,
					'value': Number(newrank),
					'date': date,
					'result': result,
					'opponent': opponent
				});
			});
			return resultsArray.reverse();
		}

		this.draw = function() {
			var data = getData();
			var rankrange = rankChange();
			var margin = 40;
			if((rankrange.biggest + rankGraphPadding) < 10) {
				var max = (rankrange.biggest + rankGraphPadding);
			} else {
				var max = 9;
			}
			if((rankrange.smallest - rankGraphPadding) < -30) {
				var min = (rankrange.smallest - rankGraphPadding);
			} else {
				var min = (rankrange.smallest - rankGraphPadding);
			}
			var pointRadius = 4;
			var x = d3.time.scale().range([0, w - margin * 2]).domain([data[0].date, data[data.length - 1].date]);
			var y = d3.scale.linear().range([h - margin * 2, 0]).domain([min, max]);
			var xAxis = d3.svg.axis().scale(x).tickSize(h - margin * 2).tickPadding(10).ticks(gameCount/2);
			var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-w + margin * 2).tickPadding(10);
			var t = null;

			svg = d3.select('#user-chart').select('svg').select('g');
			if (svg.empty()) {
				svg = d3.select('#user-chart').append('svg:svg').attr('width', w).attr('height', h).attr('class', 'viz').append('svg:g').attr('transform', 'translate(' + margin + ',' + margin + ')');
			}

			t = svg.transition().duration(transitionDuration);

			// y ticks and labels
			if (!yAxisGroup) {
				yAxisGroup = svg.append('svg:g').attr('class', 'yTick').call(yAxis);
			} else {
				t.select('.yTick').call(yAxis);
			}

			// x ticks and labels
			if (!xAxisGroup) {
				xAxisGroup = svg.append('svg:g').attr('class', 'xTick').call(xAxis);
			} else {
				t.select('.xTick').call(xAxis);
			}

			// Draw the lines
			if (!dataLinesGroup) {
				dataLinesGroup = svg.append('svg:g');
			}

			var dataLines = dataLinesGroup.selectAll('.data-line').data([data]);

			var line = d3.svg.line()
			// assign the X function to plot our line as we wish
			.x(function(d, i) {
				return x(d.date);
			}).y(function(d) {
				return y(d.value);
			}).interpolate("linear");

			var garea = d3.svg.area().interpolate("linear").x(function(d) {
				// verbose logging to show what's actually being done
				return x(d.date);
			}).y0(h - margin * 2).y1(function(d) {
				// verbose logging to show what's actually being done
				return y(d.value);
			});

			dataLines.enter().append('svg:path').attr("class", "area").attr("d", garea(data));

			dataLines.enter().append('path').attr('class', 'data-line').style('opacity', 0.3).attr("d", line(data));

			dataLines.transition().attr("d", line).duration(transitionDuration).style('opacity', 1).attr("transform", function(d) {
				return "translate(" + x(d.date) + "," + y(d.value) + ")";
			});

			dataLines.exit().transition().attr("d", line).duration(transitionDuration).attr("transform", function(d) {
				return "translate(" + x(d.date) + "," + y(0) + ")";
			}).style('opacity', 1e-6).remove();

			d3.selectAll(".area").transition().duration(transitionDuration).attr("d", garea(data));

			// Draw the points
			if (!dataCirclesGroup) {
				dataCirclesGroup = svg.append('svg:g');
			}

			var circles = dataCirclesGroup.selectAll('.data-point').data(data);

			circles.enter().append('svg:circle').attr('class', 'data-point').style('opacity', 1e-6).attr('cx', function(d) {
				return x(d.date)
			}).attr('cy', function() {
				return y(0)
			}).attr('r', function() {
				return (data.length <= maxDataPointsForDots) ? pointRadius : 0
			}).transition().duration(transitionDuration).style('opacity', 1).attr('cx', function(d) {
				return x(d.date)
			}).attr('cy', function(d) {
				return y(d.value)
			});

			circles.transition().duration(transitionDuration).attr('cx', function(d) {
				return x(d.date)
			}).attr('cy', function(d) {
				return y(d.value)
			}).attr('r', function() {
				return (data.length <= maxDataPointsForDots) ? pointRadius : 0
			}).style('opacity', 1);

			circles.exit().transition().duration(transitionDuration)
			// Leave the cx transition off. Allowing the points to fall where they lie is best.
			//.attr('cx', function(d, i) { return xScale(i) })
			.attr('cy', function() {
				return y(0)
			}).style("opacity", 1e-6).remove();

			$('svg circle').tipsy({
				gravity: 'w',
				opacity: 1,
				html: true,
				title: function() {
					var d = this.__data__;
					var pDate = d.date;
					return d.gamelink + '<br />Date: ' + pDate.getDate() + " " + pDate.getMonth() + " " + pDate.getFullYear() + '<br />Rank: ' + d.value + '<br />Result:' + d.result + '<br />Opponent: ' + d.opponent;
				}
			});
		}

		function rankChange() {
			var rankrange = [];
			var data = getData();

			for (var key in data) {
				var obj = data[key];
				for (var prop in obj) {
					if (prop == 'value') {
						var rank = obj[prop];

						if (biggest == undefined) {
							var biggest = rank;
						}
						if (smallest == undefined) {
							var smallest = rank;
						}

						if (rank > biggest) {
							var biggest = rank;
						}
						if (rank < smallest) {
							smallest = rank;
						}
					}
				}
			}

			rankrange = {
				"smallest": smallest,
				"biggest": biggest,
				"current": rank.toFixed(2)
			};
			return rankrange;
		}
	};