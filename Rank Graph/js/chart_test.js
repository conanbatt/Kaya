$("#ranksettings").bind('submit', graphSettings);
var userName = 'conanbatt';
var gameCount = 20;

var getData = $.ajax({
    type: 'GET',
    dataType: 'JSON',
    url: 'data/data.json',
    success: function(data) {
        if(data.length > 0) {
            //We have data in JSON format
            var resultsArray = [];
            for(key in data){
            	// console.log("Data: " + data);
                var date = new Date(data[key]['datetime_played']);    
                gamelink = '<a href="http://beta.kaya.gs/gospeed/' + data[key]['id'] + '" target="_blank">View Game</a>';
				if (data[key]['white_player'] == userName) {
					if(data[key]['white_rank'].indexOf("d") > 0) {
						newrank = data[key]['white_rank'].substring(0, data[key]['white_rank'].length - 1);
					} else {
						newrank = "-" + data[key]['white_rank'].substring(0, data[key]['white_rank'].length - 1);
					}
					opponent = data[key]['black_player'];
				} else {
					if(data[key]['black_rank'].indexOf("d") > 0) {
						newrank = data[key]['black_rank'].substring(0, data[key]['black_rank'].length - 1);
					} else {
						newrank = "-" + data[key]['black_rank'].substring(0, data[key]['black_rank'].length - 1);
					}
					opponent = data[key]['white_player'];
				}
				result = data[key]['result'];          
                resultsArray.push({
					'gamelink': gamelink,
					'value': Number(newrank),
					'date': date,
					'result': result,
					'opponent': opponent
				});
            }   
            console.log(resultsArray);
        }
        
        //Got Data -> Init Graph
        $("#user-chart").rankgraph({gameCount:20, username:'conanbatt', data:resultsArray});
        test("Should be able to output a graph", function() {
			ok($("#user-chart").html().length > 0);
		});
    },
    error: function(response){
        alert("Error: " + response.responseText);
    }    
});
