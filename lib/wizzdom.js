const DOMNodeCollection = require('./dom_node_collection.js');

const docReadyCallbacks = [];

document.addEventListener('DOMContentLoaded', () => {
  docReadyCallbacks.forEach(callback => callback());
});

const $w = (arg) => {
  if (arg instanceof Function) {
    if (document.readyState === 'complete') arg();
    else docReadyCallbacks.push(arg);
    return;
  }

  let nodeArray;
  if (typeof arg === "string") {
    if (arg[0] === '<') nodeArray = parseHTML(arg);
    else nodeArray = document.querySelectorAll(arg);
  } else if (arg instanceof HTMLElement) {
    nodeArray = [arg]
  }

  return new DOMNodeCollection(nodeArray);
}

const parseHTML = (string) => {
  let tag = "";
  for (let i = 1; i < string.length; i++) {
    if (string[i] === '>') break;
    tag += string[i];
  }
  const innerHTML = string.slice(tag.length + 2, string.length - (tag.length + 3));
  const newEl = document.createElement(tag);
  newEl.innerHTMl = innerHTML;
  return [newEl];
}

$w.extend = (base, ...objects) => {
  objects.forEach( obj => {
    for (let key in obj) {
      base[key] = obj[key];
    }
  });
  return base;
};

$w.ajax = (options) => {
  return new Promise(function(resolve, reject) {
    const defaults = {
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      method: "GET",
      url: window.location.href,
      data: {},
      success: {},
      error: {}
    };

    options.method = options.method.toUpperCase();
    if (options.method === "GET" && options.hasOwnProperty("data")) {
      options.url += "?" + toQuery(options.data);
    }

    const opts = $w.extend(defaults, options);

    const xhr = new XMLHttpRequest();
    xhr.open(opts.method, opts.url, true);
    xhr.onload = e => {
      if (xhr.status < 400) {
         opts.success(xhr.response);
         resolve(xhr.response);
       } else {
         opts.error(xhr.response);
         reject(xhr.response);
        }
      };

    xhr.send(JSON.stringify(opts.data));
  });
};

function toQuery(data) {
  let result = "";
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      result += prop + "=" + data[prop] +"&";
    }
  }
  return result.slice(0, -1);
}

window.$w = $w;
