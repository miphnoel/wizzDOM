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
