var svg = d3.select("#stacked"),
    margin = {top: 20, right: 180, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var margin = {top: 20, right: 150, bottom: 50, left: 40},
    //     width = 600 - margin.left - marginStacked.right,
    //     height = 500 - margin.top - marginStacked.bottom;
    //
    //
    // var svg = d3.select("#stacked").append("svg")
    //     .attr("width", widthStacked + marginStacked.left + marginStacked.right)
    //     .attr("height", heightStacked + marginStacked.top + marginStacked.bottom)
    //   .append("g")
    //     .attr("transform", "translate(" + marginStacked.left + "," + marginStacked.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.3)
    .align(0.3);

var y = d3.scaleLinear()
    .domain([0,1500])
    .range([height, 0]);

var z = d3.scaleOrdinal(["#e6194B", "#f58231", "#ffe119", "#bfef45", "#3cb44b", "#42d4f4", "#4363d8", "#911eb4", "#f032e6", "#a9a9a9"]);
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var stack = d3.stack();

d3.csv("/static/deaths.csv").then(function(data) {
  console.log(data);
  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(data.columns.slice(1));

  console.log("cp1");

  g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Year); })
      .attr("y", function(d) {
        var val = d[0];
        return (val); })
      .attr("height", function(d) {
        var val0 = d[0];
        var val1 = d[1];
        console.log(val1-val0);
        return ((val1) - (val0)); })
      .attr("width", x.bandwidth());

  console.log("cp2");

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  console.log("cp3");

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks(10).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .text("Population");

  console.log("cp4");

  var legend = g.selectAll(".legend")
    .data(data.columns.slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .style("font", "10px sans-serif");

  legend.append("rect")
      .attr("x", width + 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 44)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; });
});

var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");


function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}
