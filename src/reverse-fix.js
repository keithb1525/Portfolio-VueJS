// Direct fix for t._reverse is not a function
(function() {
  // Create the reverse function
  function reverseObject(obj) {
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[obj[key]] = key;
      }
    }
    return result;
  }
  
  // Make _reverse available globally
  window.constants = window.constants || {};
  window.constants._reverse = reverseObject;
  
  // Add _reverse to Object.prototype as a non-enumerable property
  // that can be both read and written to
  if (!Object.prototype.hasOwnProperty('_reverse')) {
    Object.defineProperty(Object.prototype, '_reverse', {
      value: reverseObject,
      writable: true,
      configurable: true,
      enumerable: false
    });
  }
  
  // Patch any existing t object
  if (window.t && !window.t._reverse) {
    window.t._reverse = reverseObject;
  }
})();