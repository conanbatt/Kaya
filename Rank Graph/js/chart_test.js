var graph_widget = new rankgraph(50);

test("Should be able to output a graph", function() {
    graph_widget.draw();

    ok($("#user-chart").html().length > 0);
});


