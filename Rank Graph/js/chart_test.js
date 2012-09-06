mock_games = [] //Remove all mock data from the chart.js file.
mock_games2 = []


test("Should be able to output a graph", function() {

    $("#user-chart").rank_graph(mock_games);

    ok($("#user-chart").html().length > 0);
});

test("Should do some basic validation", function(){

    raise( function(){ 
        $("#inexistent").rank_graph(mock_games);
    }, Error, "Element with id inexistent must exist");

})

test("Should be able to re-draw the same graph with another data", function(){

    $("#user-chart").rank_graph(mock_games);

    ok($("#some_mock_game_id").length) // Or however wecan locate an aelement added by the drawer

    $("#user-chart").rank_graph(mock_games2);

    ok(!$("#some_mock_game_id").length) // The previous element should not be drawn anymore
    ok($("#mock_id_from_second_batch").length)
})
