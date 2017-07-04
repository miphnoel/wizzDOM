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
    this.elements = HTMLelements;
  }

  each(callback){
    this.elements.forEach(el => callback(el));
  }

  // HTML5 will not execute <script> tags inserted via innerHTML
  html(str) {
    if (str) this.each(el => { el.innerHTML = str; });
    else return this.elements[0].innerHTML;
  }

  // Clears content of all elements
  empty() {
    this.html('');
  }

  // Can accept wizzDOM collection, HTML element, or string
  append(arg) {
    (arg instanceof Array)
      ? arg.forEach(child => {
          this.each(parent => { parent.innerHTML += child.outerHTML; });
        })
      : this.each(el => { el.innerHTML += arg; });
  }

  attr(attrName, attrValue) {
    if (attrValue) this.each(el => el.setAttribute(attrName, attrValue));
    else this.each(el => el.getAttribute(attrName));
  }

  addClass(className) {
    this.each(el => {
      if (!el.classList.includes(className)) el.classList.add(className);
    });
  }

  removeClass(className) {
    this.each((el) => el.classList.remove(className));
  }


  children() {
    const allChildren = [];
    this.each(el => allChildren.push(...el.children));
    return new DOMNodeCollection(allChildren);
  }

  parent() {
    const allParents = [];
    this.each(el => allParents.push(el.parent));
    return new DOMNodeCollection(allParents);
  }

  find(selector) {
    const allDescendants = [];
    this.each(el => allDescendants.push(...el.querySelectorAll(selector)));
    return new DOMNodeCollection(allDescendants);
  }

  remove() {
    this.empty();
    this.elements = [];
  }

  on(action, callback) {
    this.each(el => el.addEventListener(action, callback));
    this.callback = callback;
  }

  off(action) {
    this.each(el => el.removeEventListener(action, this.callback));
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

function $w(arg) {
  if (arg instanceof Function) {
    if (document.readyState === 'complete') arg();
    else docReadyCallbacks.push(arg);
    return;
  }

  const arrayEl = (arg instanceof HTMLElement)
    ? [arg]
    : Array.from(document.querySelectorAll(arg));

  return new DOMNodeCollection(arrayEl);
}

Function.prototype.extend = function(firstObj, ...objects) {
  for (let i = 0; i < objects.length; i++) {
    for (let key in objects[i]) {
      if (firstObj.hasOwnProperty(key)) firstObj[key] = objects[i][key];
    }
  }
  return firstObj;
};

Function.prototype.ajax = function(options) {
  const defaults = {
    method: "GET",
    url: window.location.href,
    dataType: "json",
    data: {},
    success: (data) => console.log(data),
    error: (err) => console.log(err)
  };

  const opts = this.extend(defaults, options);

  const xhr = new XMLHttpRequest();
  xhr.open(opts.method, opts.url);
  xhr.onload = (xhr.status < 400) ? opts.success(xhr.response) : opts.error(xhr.response); // passing in the data for
  xhr.responseType = opts.dataType;
  xhr.send(opts.data);
};

window.$w = $w;


/***/ })
/******/ ]);