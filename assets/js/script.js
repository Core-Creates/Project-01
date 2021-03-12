$(document).ready(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);
  });

  // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
  // var collapsibleElem = document.querySelector('.collapsible');
  // var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

  // Or with jQuery

  $(document).ready(function () {
    $('.sidenav').sidenav();
  });

  
  function getWeeklyData(){
    // return [
    //   {"value":67,"date":"2021-03-12","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-13","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-14","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-15","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-16","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-17","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-18","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-19","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-20","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-21","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-22","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-23","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   {"value":67,"date":"2021-03-24","formatedDate":"2021-03-11T06:00:00.000Z"},
    // ]
    // Uncomment when done testing.
    var data = localStorage.getItem("weeklyUserData");
    if(data === null || data === undefined){
      data = [];
    } else{
      data = JSON.parse(data);
    }
    return data;
  }

  function addDailyValueToWeeklyData(dataStorage){
      localStorage.setItem("weeklyUserData", JSON.stringify(dataStorage));
  }
  
//   [
//     // { id: "d1", value: 10, date: "2013-01-04", transformed: false },
//     // { id: "d2", value: 11, date: "2013-02-21", transformed: false },
//     // { id: "d3", value: 12, date: "2013-03-30", transformed: false },
//     // { id: "d4", value: 6, date: "2013-04-15", transformed: false },
//     // { id: "d5", value: 14, date: "2013-05-01", transformed: false },
// ];


  function draw(data) {
    
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

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
      if (typeof d.formatedDate === "string" || typeof d.formatedDate === "undefined"){
        d.formatedDate = parseDate(d.date);
        d.value = +d.value;
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
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("(mg/dL )");

    svg
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", "purple")
      
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
    var currentDate = moment().format("YYYY-MM-DD");
    userData = userData.filter(item => item.date != currentDate);
    var reading = parseInt($("#graphInput")[0].value);
    userData.push({
      value: reading,
      date: currentDate,
    });
    console.log(userData)
    // If length of userData exceeds 7, pop off the index 0
    if(userData.length > 7){
      userData.reverse();
      userData.length = 7;
      // userData.reverse();
    }
    draw(userData);
    addDailyValueToWeeklyData(userData);
    });
  var userData = getWeeklyData();
  draw(userData);
  // draw([{id: 'd1', value:10, date: '2013-01'},]);

  // calls to decom sandbox environment
  var data = null;

  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.withCredentials = true;

  xmlHttpReq.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });
  var localDevelopment = true;

  if (localDevelopment) {
    var client_id = "EYCJETfiRrSVmqH8XyIGxscQpFqKGXnh";
    var client_secret = "kqQJU4XWs6bpyYn9";
    var redirect_uri = "http://127.0.0.1:5500/";
  }
  else {
    var client_id = "DNA4fWlB85h6EmVKmEBUPdH5IG2LIjkp";
    var client_secret = "8n5pnyaMTeFOCrVN";
    var redirect_uri = "https://core-creates.github.io/Project-01/";

  }
  var urlParams = new URLSearchParams(window.location.search);
  var mytoken = urlParams.get('code');
  localStorage.setItem("applicationToken", mytoken);

  if (mytoken === null || mytoken === undefined ){
    window.location = `https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`
    
  }
  
  console.log(mytoken);
  
  // xmlHttpReq.setRequestHeader("authorization", "Bearer 8n5pnyaMTeFOCrVN");
  // xmlHttpReq.send(data);
  // console.log(data);

  



});
