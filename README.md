# wizzDOM

wizzDOM is a lightweight JavaScript DOM interaction library, which allows users to:
  * Select, traverse, and manipulate existing DOM elements
  * Construct new DOM elements
  * Queue document-ready callbacks
  * Add and remove event handlers
  * Simplify Ajax requests

## API

[`$w`](#w)  

[DOM Traversal](#dom-traversal)  
  * [`each`](#each)  
  * [`children`](#children)  
  * [`parent`](#parent)
  * [`find`](#find)

[DOM Manipulation](#dom-manipulation)  
  * [`html`](#html)  
  * [`empty`](#empty)  
  * [`append`](#append)  
  * [`remove`](#remove)  
  * [`attr`](#attr)  
  * [`addClass`](#addclass)  
  * [`removeClass`](#removeclass)  
  * [`toggleClass`](#toggleclass)  

[Event Listeners](#event-listeners)  
  * [`on`](#on)  
  * [`off`](#off)  

[`$w.ajax`](#lajax)  

### $w

`$w` is wizzDOM's versatile wrapper, which can flexibly handle a variety of inputs. Primary usage of `$w` is to give HTML elements access to wizzDOM methods through construction of a `DOMNodeCollection` object, or to queue functions for invocation once the document loads.

1. `$w`(**'CSS selector'**)
  * Query the document, then wrap the selected HTML elements in a `DOMNodeCollection` object.


2. `$w`(**'HTML string'**)
  * Construct a new HTML element, then wrap it in a `DOMNodeCollection` object.


3. `$w`(**HTML element**)
  * Give an existing element access to wizzDOM methods by wrapping it in a `DOMNodeCollection` object.


4. `$w`(**function**)
  * If the document is fully loaded, invoke the function
  * Else, add the function to a queue of callbacks to be executed once the document loads

```javascript
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
```

### DOM Traversal

#### `each`

Iterates through the elements in a `DOMNodeCollection` and applies a callback function passed as an argument

#### `children`

Returns a `DOMNodeCollection` containing all of the elements which are direct children of the original `DomeNodeCollection`'s elements.

#### `parent`

Returns a `DOMNodeCollection` containing the parent elements of every `HTMLElement` in the original `DOMNodeCollection`.

#### `find`

Takes a CSS selector, and returns a `DOMNodeCollection` containing all of the descendants of the `DomeNodeCollection`'s elements that match the selector. (Includes *all* descendants, not just direct children)


### DOM Manipulation

#### `html`

If passed a `string`, sets the `innerHTML` of all `DOMNodeCollection` elements to the given string.

With no argument, returns the `innerHTML` of the first element in the `DOMNodeCollection`.  

#### `empty`

Empties the `innerHTML` of all `DOMNodeCollection` elements.

#### `append`

Takes a `string`, `HTMLElement`, or `DOMNodeCollection`, and appends it to each `DOMNodeCollection` element.

#### `remove`

Remove all `DOMNodeCollection` elements from the DOM.

#### `attr`

If given (`attr_name`, `attr_value`), sets the attribute (`attr_name`) to the value (`attr_value`) for all `DOMNodeCollection` elements.

If passed only `attr_name`, retrieves the value of attribute (`attr_name`) for the first `DOMNodeCollection` element.

#### `addClass`

Takes a `class`, and adds it to every `DOMNodeCollection` element.

#### `removeClass`

Takes a `class`, and removes it from every `DOMNodeCollection` element.

#### `toggleClass`

Takes a `class`, adds it to every `DOMNodeCollection` element that *does not* have it, and removes it from every `DOMNodeCollection` element that *does* have it.

### Event Listeners

#### `on`

Takes an `event` and a callback `function`.
Adds an event listener to every `DOMNodeCollection` element.

([valid events](https://developer.mozilla.org/en-US/docs/Web/Events))

#### `off`

Takes an `event`. Removes event listener from every `DOMNodeCollection` element. Note that the event listeners are attached to each node, so event listeners can be removed from subsections of the original `DOMNodeCollection` through the formation of a more specifically selected `DOMNodeCollection.`

### $w.ajax

Creates and sends an `XMLHttpRequest`, then returns a `Promise` object.  Accepts an `options` hash with any of the following attributes:
  * __method__: HTTP method (*default: "GET"*)
  * __url__: target URL for HTTP request (*default: window.location.href*)
  * __success__: callback `function`, executed upon successful request
  * __error__: callback `function`, executed upon failed request
  * __contentType__: content type of HTTP Request (*default: 'application/x-www-form-urlencoded; charset=UTF-8'*)
