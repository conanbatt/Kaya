mock_games = [] //Remove all mock data from the chart.js file.
mock_games2 = []


test("Should be able to output a graph", function() {


    my_graph = new RankGraph('user-chart') //just the element id
    my_graph.draw(mock_games);

    ok($("#user-chart").html().length > 0);
});

test("Should do some basic validation", function(){

    raise( function(){ 
        my_graph = new RankGraph('inexistent')
    }, Error, "Element with id inexistent must exist");

})

test("Should be able to re-draw the same graph with another data", function(){

    my_graph = new RankGraph('user-chart')
    my_graph.draw(mock_games)

    ok($("#some_mock_game_id").length)

    my_graph.draw(mock_games2)

    ok(!$("#some_mock_game_id").length)
    ok($("#mock_id_from_second_batch").length)
})
