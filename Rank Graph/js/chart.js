// @author     Fabien Oram
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

    // Check username exists;
    if (usernamesubmit == 'fakeman') { // Exists query?
        $('#usernamewarn').fadeIn();
        setTimeout(function() {
            $('#usernamewarn').fadeOut('slow');
        }, 3000);
        return false;
    }

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

var rankgraph = function(target, options) {
        var options = $.extend({}, {
            data: '',
            gameCount: 20,
            username: 'Smar',
            rankGraphPadding: 3
        }, options);

        //To Not Have To Replace Them In The Script 
        var gameCount = options.gameCount,
            username = options.username,
            rankGraphPadding = options.rankGraphPadding;

        var w = $("#user-chart").width(),
            h = $(document).height() / 2;

        var maxDataPointsForDots = ($("#user-chart").width() / 6),
            transitionDuration = 1000;

        var svg = null,
            yAxisGroup = null,
            xAxisGroup = null,
            dataCirclesGroup = null,
            dataLinesGroup = null;


    //If no data has been defined we can get it here
    this.getData = function() {
        //TODO: Get this to work. for now not needed.
        //No return, Just Draw Again
        this.draw(data);
    }

    this.draw = function(data) {
        var data = options.data || data || this.getData();

        //If this.getData is going to be called, we will have to wait for a response. But javascript is not good at that :(
        if (data.length < 1) {
            return;
        }

        var rankrange = rankChange();
        var margin = 40;
        if ((rankrange.biggest + rankGraphPadding) < 10) {
            var max = (rankrange.biggest + rankGraphPadding);
        } else {
            var max = 9;
        }
        if ((rankrange.smallest - rankGraphPadding) < -30) {
            var min = (rankrange.smallest - rankGraphPadding);
        } else {
            var min = (rankrange.smallest - rankGraphPadding);
        }
        var pointRadius = 4;
        var x = d3.time.scale().range([0, w - margin * 2]).domain([data[0].date, data[data.length - 1].date]);
        var y = d3.scale.linear().range([h - margin * 2, 0]).domain([min, max]);
        var xAxis = d3.svg.axis().scale(x).tickSize(h - margin * 2).tickPadding(10).ticks(gameCount / 2);
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

    // return $(this).data("rankgraph", this);
    return this;
};

$.fn.rankgraph = function(options){
    $(this).each(function(){
        var graph = new rankgraph(this, options);
            graph.draw();
    });
}