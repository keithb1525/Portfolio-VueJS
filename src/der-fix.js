// Direct fix for t.der is not a function
(function() {
  // Create the der function
  function derObject(obj) {
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[obj[key]] = key;
      }
    }
    return result;
  }
  
  // Make der available globally
  window.constants = window.constants || {};
  window.constants.der = derObject;
  
  // Add der to Object.prototype as a non-enumerable property
  // that can be both read and written to
  if (!Object.prototype.hasOwnProperty('der')) {
    Object.defineProperty(Object.prototype, 'der', {
      value: derObject,
      writable: true,
      configurable: true,
      enumerable: false
    });
  }
  
  // Patch any existing t object
  if (window.t && !window.t.der) {
    window.t.der = derObject;
  }
})();