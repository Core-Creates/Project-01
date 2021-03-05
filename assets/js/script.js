var data = null;

var xmlHttpRequ = new XMLHttpRequest();
xmlHttpRequ.withCredentials = true;

xmlHttpRequ.addEventListener("readystatechange", function () {
    // 
    if (this.readyState === 4) {
        console.log(this.responseText);
    }
});

xmlHttpRequ.open("GET", "https://sandbox-api.dexcom.com/v2/users/self/devices");
xmlHttpRequ.setRequestHeader("authorization", "Bearer {your_access_token}");

xmlHttpRequ.send(data);