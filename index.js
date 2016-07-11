d3.json('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', function(err, data) {

    var width = 900,
        height = 700;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var chart = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);

    var tooltip = d3.select("#tooltip")
        .style("visibility", "hidden")
        .style("height", 0);

    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().distanceMax(110).strength(-100))
        .force("link", d3.forceLink())
        .force("center", d3.forceCenter().x(width / 2).y(height / 2))
        .force("collide", d3.forceCollide(16).strength(1));


    var link = chart.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line").attr("stroke-width", 1)
        .style("stroke", "#fff");

    var node = d3.select("#content").append("div")
        .attr("class", "nodes")
        .style("width", width + "px")
        .selectAll("img")
        .data(data.nodes)
        .enter().append("img")
        .attr("class", function(d) {
            return "flag flag-" + d.code;
        })
        .on("mouseover", function(d) {
            tooltip.text(d.country);
            tooltip.style("visibility", "visible");
            tooltip.style("height", "auto");
            return;
        })
        .on("mousemove", function(d) {
            var position = d3.mouse(this.parentElement.parentElement);
            return tooltip.style("top", (position[1] - 10) + "px")
                .style("left", (position[0] + 20) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.style("height", 0);
            return tooltip.style("visibility", "hidden");
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.links)
        .distance(50);

    function ticked() {

        node
            .style("left", function(d) {
                d.x = Math.max(0, Math.min(width - 16, d.x));
                return d.x + "px";
            })
            .style("top", function(d) {
                d.y = Math.max(0, Math.min(height - 11, d.y));
                return d.y + "px";
            });

        link
            .attr("x1", function(d) {
                return d.source.x + 8;
            })
            .attr("y1", function(d) {
                return d.source.y + 5.5;
            })
            .attr("x2", function(d) {
                return d.target.x + 8;
            })
            .attr("y2", function(d) {
                return d.target.y + 5.5;
            });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
});
