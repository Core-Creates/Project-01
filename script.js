$(document).ready(function () {
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);
  });

  // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
  // var collapsibleElem = document.querySelector('.collapsible');
  // var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

  // Or with jQuery

  $(document).ready(function(){
    $('.sidenav').sidenav();
  });
  
  
 var history = localStorage.getItem();
// set all [d] values to local storage
// pull [d] values from local storage 
  
  

// iterate [d] values per user input




  var userData = [
    { id: "d1", value: 10, date: "2013-01-04", transformed: false },
    { id: "d2", value: 11, date: "2013-02-21", transformed: false },
    { id: "d3", value: 12, date: "2013-03-30", transformed: false },
    { id: "d4", value: 6, date: "2013-04-15", transformed: false },
    { id: "d5", value: 14, date: "2013-05-01", transformed: false },
  ];
  function draw(data) {
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
      width = 600  - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    var dateFormat = "%Y-%m-%d";
    // Parse the date / time
    var parseDate = d3.time.format(dateFormat).parse;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg
      .axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format(dateFormat));

    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
    $("#graph").empty();
    var svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function (d) {
      if (!d.transformed) {
        d.formatedDate = parseDate(d.date);
        d.value = +d.value;
        d.transformed = true;
      }
    });

    x.domain(
      data.map(function (d) {
        return d.formatedDate;
      })
    );
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.value;
      }),
    ]);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    svg
      .append("g")
      .attr("height", 100) 
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

    svg
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", "rgb(142,237,179)")
      .attr("x", function (d) {
        return x(d.formatedDate);
      })
      .attr("width", x.rangeBand())
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("height", function (d) {
        return height - y(d.value);
      });
  }
  

  $("#addNewBtn").click(function (event) {
    // todo - if user reinputs for the day.  search array and replace with new data.
    var inputValue =  parseInt($("#graphInput")[0].value);
    
    if(isNaN(inputValue)){
      //  if inputValue is not a number; return so it doesn't break graph stuff below
      return
    }

    var currentDate = moment().format("YYYY-MM-DD");
    userData = userData.filter(item => item.date != currentDate);
    userData.push({
      value:inputValue,
      date: currentDate,
    });
    draw(userData);
  });

  draw(userData);
  // draw([{id: 'd1', value:10, date: '2013-01'},]);


  
});
