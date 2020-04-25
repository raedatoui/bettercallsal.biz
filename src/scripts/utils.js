export function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

export function qsa(selector, scope) {
  return [...(scope || document).querySelectorAll(selector)];
}

export function $on(target, type, callback, capture) {
  target.addEventListener(type, callback, !!capture);
}

export function $delegate(target, selector, type, handler, capture) {
  const dispatchEvent = event => {
    const targetElement = event.target;
    const potentialElements = target.querySelectorAll(selector);
    let i = potentialElements.length;

    while (i--) {
      if (potentialElements[i] === targetElement) {
        handler.call(targetElement, event);
        break;
      }
    }
  };

  $on(target, type, dispatchEvent, !!capture);
}

export function debounce(fn, ms = 0) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

export function elementCurrentStyle(element, styleName) {
  if (element.currentStyle) {
    let i = 0;

    let temp = '';

    let changeCase = false;
    for (i = 0; i < styleName.length; i++) {
      if (styleName[i] !== '-') {
        temp += changeCase ? styleName[i].toUpperCase() : styleName[i];
        changeCase = false;
      } else {
        changeCase = true;
      }
    }
    return element.currentStyle[temp];
  }
  return getComputedStyle(element, null).getPropertyValue(styleName);
}

export const baseurl = 'http://bettercallsal.fit';
