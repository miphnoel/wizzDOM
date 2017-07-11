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
    (arg instanceof DOMNodeCollection)
      ? arg.each(child => {
          this.each(parent => { parent.innerHTML += child.outerHTML; });
        })
      : this.each(el => el.innerHTML += arg);
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
