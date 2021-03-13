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


  function getWeeklyData() {
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
    if (data === null || data === undefined) {
      data = [];
    } else {
      data = JSON.parse(data);
    }
    return data;
  }

  function addDailyValueToWeeklyData(dataStorage) {
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
      if (typeof d.formatedDate === "string" || typeof d.formatedDate === "undefined") {
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

    var currentDate = moment().format("YYYY-MM-DD");
    userData = userData.filter(item => item.date != currentDate);
    var reading = parseInt($("#graphInput")[0].value);
    userData.push({
      value: reading,
      date: currentDate,
    });
    console.log(userData)

    if (userData.length > 7) {
      userData.reverse();
      userData.length = 7;
      // userData.reverse();
    }
    draw(userData);
    addDailyValueToWeeklyData(userData);
  });

  $("#home-btn").click(function (event) {
    $("#device").hide();
    $("#events").hide();
    $("#home").show();
    $("#contact").hide();
  })
  $("#device-btn").click(function (event) {

    $("#events").hide();
    $("#home").hide();
    $("#device").show();
    $("#contact").hide();
  })

  $("#events-btn").click(function (event) {
    $("#events").show();
    $("#home").hide();
    $("#device").hide();
    $("#contact").hide();

    // todo - same as above bur for events;
  })

  $("#contact-btn").click(function (event) {

   

      window.location.href = "./assets/html/email.html";
    
    

    $("#events").hide();
    $("#home").hide();
    $("#device").hide();
    $("#contact").show();
    // todo - same as above bur for events;
  })


  // // for debug purposes so we can code on a page we care about that's not the landing page
  // $("#events").hide();
  // $("#home").hide();
  // $("#device").show();


  var userData = getWeeklyData();
  draw(userData);






  /************  API calls to dexcom API Begins *************************************************************************************/


  var data = null;

  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.withCredentials = true;


  /** Beginning of access code request function **/
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
  var myCode = urlParams.get('code');
  localStorage.setItem("applicationAuthCode", myCode);
  // if we don't have a auth code redirect user to login so they can get a token later
  if (myCode === null || myCode === undefined) {
    window.location = `https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`;

  }
  /** Ending of access code authorization request function *********************************************/

// url to access the token url - where we are getting the (Site we are posting to )
  var tokenURL = `https://sandbox-api.dexcom.com/v2/oauth2/token`;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {

      //Displays the response 
      console.log(this.responseText);

      //parsing the response to grab the access token out
      var myToken = JSON.parse(this.responseText).access_token;

      // Storing access token to local storage
      localStorage.setItem('token', myToken);
      
      // 
      console.log(myToken);

    }
  });

  // posting to the token url (requesting a token)
  xhr.open("POST", tokenURL);
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("cache-control", "no-cache");
  var data = `client_secret=${client_secret}&client_id=${client_id}&code=${myCode}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;


  xhr.send(data);

// 

  // user device imformation url

  var deviceUrl = `https://sandbox-api.dexcom.com/v2/users/self/devices`;

  //when clicked on the button device  this function will trigger
  $("#device-btn").click(function (event) {

    // window.location = deviceUrl;
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    var mytoken = localStorage.getItem("token");

    if (mytoken) {

      xhr.open("GET", "https://sandbox-api.dexcom.com/v2/users/self/devices?startDate=2017-06-16T15:30:00&endDate=2017-06-16T15:45:00");

      xhr.setRequestHeader("authorization", "Bearer " + mytoken);

      xhr.send();

      var deviceInfo = urlParams.get("devices");
      localStorage.setItem("devices", deviceInfo);

      console.log(deviceInfo);
    }






  })




});
