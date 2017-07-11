/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(HTMLelements) {
    this.nodes = HTMLelements;
  }

  each(callback){
    this.nodes.forEach(node => callback(node));
  }

  // HTML5 will not execute <script> tags inserted via innerHTML
  html(str) {
    if (typeof str === 'string') {
      this.each(node => node.innerHTML = str);
    } else {
      return this.nodes[0].innerHTML;
    }
  }

  // Clears content of all nodes
  empty() {
    this.html('');
  }

  // Can accept wizzDOM collection, HTML element, or string
  append(arg) {
    if (arg instanceof HTMLElement) {
      arg = $w(arg);
    }

    if (typeof arg === "string") {
      this.each(node => node.innerHTML += arg);
    } else if (arg instanceof DOMNodeCollection) {
      this.each(node => {
        arg.each(child => node.appendChild(child.cloneNode(true)));
      });
    }
  }



  attr(attrName, attrValue) {
    return (attrValue)
      ? this.each(node => node.setAttribute(attrName, attrValue))
      : this.nodes[0].getAttribute(attrName);
  }

  css(styleName, styleValue) {
    return (styleValue)
      ? this.each(node => node.style[styleName] = styleValue)
      : this.nodes[0].style[styleName];
  }

  addClass(className) {
    this.each(node => node.classList.add(className));
  }

  removeClass(className) {
    this.each(node => node.classList.remove(className));
  }

  toggleClass(className) {
    this.each(node => node.classList.toggle(className));
  }

  hasClass(className) {
    let result = false;
    this.each(node => {
      if (node.classList.contains(className)) result = true;
    });
    return result;
  }

  children() {
    const allChildren = [];
    this.each(node => allChildren.push(...node.children));
    return new DOMNodeCollection(allChildren);
  }

  parent() {
    const allParents = [];
    this.each(node => {
      const parent = node.parentNode;
      if (!parent.included) {
        allParents.push(parent);
        parent.included = true;
      }});
    allParents.forEach(node => node.included = false);
    return new DOMNodeCollection(allParents);
  }

  find(selector) {
    let allDescendants = [];
    this.each(node => {
      let nodeDescendants = node.querySelectorAll(selector);
      allDescendants = allDescendants.concat(nodeDescendants);
    });
    return new DOMNodeCollection(allDescendants);
  }

  remove() {
    this.each(node => node.parentNode.removeChild(node));
  }

  on(action, callback) {
    this.each(node => {
      node.addEventListener(action, callback);
      const eventKey = `wizz${action}`;
      node[eventKey] = (node[eventKey])
       ? node[eventKey].push(callback)
       : [callback];
     });
  }

  off(action) {
    this.each(node => {
      const eventKey = `wizz${action}`;
      if (node[eventKey]) {
        node[eventKey].forEach(callback => {
          node.removeEventListener(action, callback);
        });
      }
      node[eventKey] = [];
    });
  }
}

module.exports = DOMNodeCollection;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(0);

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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map