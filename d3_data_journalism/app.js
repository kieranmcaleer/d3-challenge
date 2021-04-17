// create two numbers for svg that will be used later
var svgWidth = 960;
var svgHeight = 500;

// set all of the margins in a dictionary
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// create width and height variables
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// add an svg to html code and give it height and width attributes
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//   add a group to the svg and flip it the correct way
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// go through the csv
d3.csv("data.csv").then(function(stateData) {

    // take the data that we need and add it to a list 
    stateData.forEach(function(data) {
      data.income = +data.income;
      data.obesity = +data.obesity;
    });
    // create the x scale and y scales based on the data that was chosen
    var xLinearScale = d3.scaleLinear()
      .domain([38000, d3.max(stateData, d => d.income)])
      .range([15, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([20, d3.max(stateData, d => d.obesity)])
      .range([height, 0]);

    //   create variables that use these scales for later use
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // give these two variables to the chartgroup so that it can adjust the scale
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // create the circles that will be going on the chart
    var circlesGroup = chartGroup.selectAll("circle")
    // set the data that the circles will take
    .data(stateData)
    .enter()
    // add
    .append("circle")
    // grab the data and scale the axis based on this 
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    // create the radius of the circle
    .attr("r", "12")
    // color
    .attr("fill", "blue")
    // opacity
    .attr("opacity", ".5");
    // trying to add the text to the circles
    circlesGroup.append("text")
    .text(function(d) { return d.abbr; })
    .attr({
        "text-anchor": "middle",
        "font-size": function(d) {
          return 12 / ((12 * 10) / 100);
        },
        "dy": function(d) {
          return 12 / ((12 * 25) / 100);
        }
      });



    // create the tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        //   says what the tool tip will be showing
        return (`${d.state}<br>Income: $${d.income}<br>Obesity: ${d.obesity}%`);
      });
    //   put the tooltip in the chart
    chartGroup.call(toolTip);

    // add onClick event listener
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // create the labels for the chart
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Income ($)");
  }).catch(function(error) {
    console.log(error);
  });
