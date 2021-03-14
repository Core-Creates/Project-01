function syntaxHighlight(json) {
    if (typeof json != "string") {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  }


function addJsonToDom(elementId, data, error_message){
  let divContent = document.querySelector(elementId);
  if (data !== null && Object.keys(data).length) {
    
    var pre = document.createElement("pre");
    pre.innerHTML = `${syntaxHighlight(data)}`;
    divContent.append(pre);
  } else {
    breaks = document.createElement("br");
    divContent.append(breaks);
    header3 = document.createElement("h3");
    header3.textContent = error_message;
    divContent.append(header3);
  }
}

function getLocalStorageItem(key, default_value_if_does_not_exist){
  var temp = localStorage.getItem(key);
  if (temp === null || temp === undefined) {
    temp = default_value_if_does_not_exist;
  } else {
    temp = JSON.parse(temp);
  }
  return temp;
}
