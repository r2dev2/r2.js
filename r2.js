// html template

/** @type {(html: String) => HTMLElement} */
const htmlToElement = html => {
  const container = document.createElement('body');
  container.innerHTML = html
  return container.querySelector('*');
};

/** @type {(unsafe: String) => String} */
const sanitizeHTML = unsafe => {
  const container = document.createElement('p');
  container.textContent = unsafe;
  return container.innerHTML;
};

/** @type {(template: String[], args: (String | HTMLElement)[]) => HTMLElement} */
export const html = (template, ...args) => {
  /** @type {String[]} */
  const res = [];
  template.forEach((string, i) => {
    res.push(string);
    if (i == template.length) return;
    if (args[i] == null || args[i] == undefined) return;
    if (args[i] instanceof Array) {
      args[i].forEach(arg => res.push(arg.outerHTML ?? arg));
    }
    else {
      res.push(sanitizeHTML(args[i]));
    }
  });
  return htmlToElement(res.join(''));
};

// subscribable stores

/**
 * @template T
 * @typedef {(value: T, oldValue: T) => void} Subscriber
 */

/**
 * State manager
 *
 * @template T
 * @param {T} value
 * @return {[() => T, (newValue: T) => void, (cb: Subscriber<T>, invoke: boolean=true) => void]}
 */
export const useState = value => {
  /** @type {Map<number, Subscriber<T>>} */
  const subscribers = new Map();
  let num = 0;
  return [
    function get() { return value; },
    function set(newValue) {
      if (newValue == value) return;
      const oldValue = value;
      value = newValue;
      subscribers.forEach(cb => cb(value, oldValue));
    },
    function subscribe(cb, invoke=true) {
      const id = num++;
      subscribers.set(id, cb);
      if (invoke) cb(value, value);
      return () => subscribers.delete(id);
    }
  ]
};

// js-specific stuff
export const compose = (...args) =>
  (ipt) => args.reduceRight((val, func) => func(val), ipt);

export const pipe = (...args) =>
  (ipt) => args.reduce((val, func) => func(val), ipt);

/**
 * @template T
 * @type {(attr: keyof T) => (arr: Array<T>) => Array<T>}
 */
export const sortBy = attr => arr => arr.sort((l, r) => l[attr] - r[attr]);

export const suppress = cb => {
  try {
    return cb();
  } catch (e) {
    return e;
  }
};

/** @type {(ms: Number) => Promise<void>} */
export const sleep = ms => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

/** @type {(num: Number, min: Number, max: Number) => Number} */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
