$(document).ready(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems, options);
  });

  // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
  // var collapsibleElem = document.querySelector('.collapsible');
  // var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

  // Or with jQuery

  $(document).ready(function () {
    $(".sidenav").sidenav();
  });

  function getWeeklyData() {
    // return [
    //   // {"value":60,"date":"2021-03-16","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   // {"value":120,"date":"2021-03-17","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   // {"value":140,"date":"2021-03-18","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   // {"value":70,"date":"2021-03-19","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   // {"value":96,"date":"2021-03-20","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   // {"value":112,"date":"2021-03-21","formatedDate":"2021-03-11T06:00:00.000Z"},
    //   // {"value":174,"date":"2021-03-22","formatedDate":"2021-03-11T06:00:00.000Z"},
     
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
      // { id: "d1", value: 10, date: "2013-01-04", transformed: false },
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
      if (
        typeof d.formatedDate === "string" ||
        typeof d.formatedDate === "undefined"
      ) {
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
      .style("fill", "rgb(218, 116, 133)")

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
    userData = userData.filter((item) => item.date != currentDate);
    var reading = parseInt($("#graphInput")[0].value);
    userData.push({
      value: reading,
      date: currentDate,
    });
    console.log(userData);

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
    $("#contact").hide();
    $("#home").show();
  });
  $("#device-btn").click(function (event) {
    $("#events").hide();
    $("#home").hide();
    $("#contact").hide();
    $("#device").show();
  });

  $("#events-btn").click(function (event) {
    $("#home").hide();
    $("#device").hide();
    $("#contact").hide();
    $("#events").show();
  });

  $("#contact-btn").click(function (event) {
    $("#events").hide();
    $("#home").hide();
    $("#device").hide();
    $("#contact").show();
  });

  var userData = getWeeklyData();
  draw(userData);

  /************  API calls to dexcom API Begins *************************************************************************************/

  var data = null;

  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.withCredentials = true;

  /** Beginning of access code request function *********************************************************************************/

  /**function checks for ready change status*************************/
  xmlHttpReq.addEventListener("readystatechange", function () {
    // runs if ready state is good
    if (this.readyState === 4) {
      // logs response to console
      console.log(this.responseText);
    }
  });
  /************************* Ending of ready state change function ***/

  var localDevelopment = false;

  if (localDevelopment) {
    var client_id = "EYCJETfiRrSVmqH8XyIGxscQpFqKGXnh";
    var client_secret = "kqQJU4XWs6bpyYn9";
    var redirect_uri = "http://127.0.0.1:5500/";
  } else {
    var client_id = "DNA4fWlB85h6EmVKmEBUPdH5IG2LIjkp";
    var client_secret = "8n5pnyaMTeFOCrVN";
    var redirect_uri = "https://core-creates.github.io/Project-01/";
  }
  var urlParams = new URLSearchParams(window.location.search);
  var myCode = urlParams.get("code");
  localStorage.setItem("applicationAuthCode", myCode);
  // if we don't have a auth code redirect user to login so they can get a token later
  if (myCode === null || myCode === undefined) {
    window.location = `https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`;
  }

  /********************************************************************* Ending of access code authorization request function ***/

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
      localStorage.setItem("token", myToken);

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
    // var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // console.log(this.responseText);
        var devices = JSON.parse(this.responseText);

        // saves device info to local storage
        localStorage.setItem(
          "devices",
          JSON.stringify(devices)
          
        );
        
        // addJsonToDom("#device-div", devices,  "No Device model info, the user is using a mobile phone glucose meter adapter");
        // console.log(devices.devices[0].transmitterGeneration, devices.devices[0].displayDevice, devices.devices[0].lastUploadDate);
        addJsonToDom("#device-div", devices.devices[0].transmitterGeneration);
        addJsonToDom("#device-div", devices.devices[0].displayDevice);
        addJsonToDom("#device-div",devices.devices[0].lastUploadDate);
        
      }
    });

    var mytoken = localStorage.getItem("token");

    if (mytoken) {
      xhr.open(
        "GET",
        "https://sandbox-api.dexcom.com/v2/users/self/devices?startDate=2017-06-16T15:30:00&endDate=2017-06-16T15:45:00"
      );

      xhr.setRequestHeader("authorization", "Bearer " + mytoken);

      xhr.send(data);

      // var deviceInfo = localStorage.getItem("devices");
      // // deviceInfo = localStorage.setItem("devices", deviceInfo);

      // if (deviceInfo !== null && deviceInfo !== undefined) {
      //   let devi = document.querySelector("#device-div");

      //   devi.append(deviceInfo);
      // } else {
      //   let devi = document.querySelector("#device-div");
      //   breaks = document.createElement("br");

      //   devi.append(breaks);
      //   header3 = document.createElement("h3");

      //   header3.textContent = devi.append(
      //     "No Device model info, the user is using a mobile phone glucose meter adapter"
      //   );
      //   // document.body.insertBefore();
      // }
    }
  });
  /********************************************************************** Ending of device button trigger event*********************/

  /**Events button trigger beginning**************************************************************************************************/
  $("#events-btn").on("click", function (events) {
    // creating new http request
    var httpRequ = new XMLHttpRequest();

    // passes creds inbedded in token with request
    httpRequ.withCredentials = true;

    var data = `client_secret=${client_secret}&client_id=${client_id}&code=${myCode}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;

    /** checks if the state is ready to change **********************/
    httpRequ.addEventListener("readystatechange", function () {
      // runs if readyState is good
      if (this.readyState === 4) {
        // displays response in console
        console.log(this.responseText);
      }
    });
    /********************************* Ending of readystate checks ***/

    var mytoken = localStorage.getItem("token");

    // when valid token is issued this will run
    if (mytoken) {
      /** Beginning of Statistics call **************************************************************************************/
      var data = JSON.stringify({
        targetRanges: [
          {
            name: "day",
            startTime: "06:00:00",
            endTime: "22:00:00",
            egvRanges: [
              {
                name: "urgentLow",
                bound: 55,
              },
              {
                name: "low",
                bound: 70,
              },
              {
                name: "high",
                bound: 180,
              },
            ],
          },
          {
            name: "night",
            startTime: "22:00:00",
            endTime: "06:00:00",
            egvRanges: [
              {
                name: "urgentLow",
                bound: 55,
              },
              {
                name: "low",
                bound: 80,
              },
              {
                name: "high",
                bound: 200,
              },
            ],
          },
        ],
      });
      
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          //
          console.log(this.responseText);
          //
          // var response = JSON.parse(this.responseText);
          var response = JSON.parse(this.responseText);

          // saves stats info to local storage
          var statInfo = localStorage.setItem(
            "stats",
            JSON.stringify(response)
          );
          
        }
        
      });
      
      var stats = getLocalStorageItem("stats", {});
      var evg = getLocalStorageItem("evgs", {});
      

     
      // addJsonToDom("#stat-div", stats, "No Stats data - todo");
      
      addJsonToDom("#stat-div", stats.hypoglycemiaRisk,"Not at Hypoglycemic risk");

      addJsonToDom("#stat-div", stats.max,"Max: none");
      addJsonToDom("#stat-div", stats.min,"Min: none");
      addJsonToDom("#stat-div", stats.mean,"Mean: none");
      addJsonToDom("#stat-div", stats.median,"Median: none");
      

      addJsonToDom("#evg-div", evg.unit, "No EVG Data, - todo message");
      addJsonToDom("#evg-div", evg.rateUnit, "No EVG Data, - todo message");
      

      xhr.open(
        "POST",
        "https://sandbox-api.dexcom.com/v2/users/self/statistics?startDate=2017-06-16T15:30:00&endDate=2017-06-16T15:45:00"
      );
      xhr.setRequestHeader("authorization", "Bearer " + mytoken);
      xhr.setRequestHeader("content-type", "application/json");

      xhr.send(data);

      /****************************************************************************************** Ending of statistics call ***/

      /**  Beginning of Estimated glucose value (EGV) data call ************************************************************/
      var data = null;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          //
          // var response = JSON.parse(this.responseText);
          var response = JSON.parse(this.responseText);

          // saves stats info to local storage
          var evgsInfo = localStorage.setItem("evgs", JSON.stringify(response));
        }
       
      });

      xhr.open(
        "GET",
        "https://sandbox-api.dexcom.com/v2/users/self/egvs?startDate=2017-06-16T15:30:00&endDate=2017-06-16T15:45:00"
      );
      xhr.setRequestHeader("authorization", "Bearer " + mytoken);

      xhr.send();
      /****************************************************************** Ending of Estimated glucose value (EGV) data call*/
    }
  });

  /**Events button trigger ending***********************************************************************************************/
});
