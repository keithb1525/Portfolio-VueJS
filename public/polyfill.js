// This file will be directly included in the HTML and run before any other scripts
(function() {
  // Constants _reverse function
  if (typeof window !== 'undefined') {
    // Create a utility function to reverse object key-values
    function reverseObject(obj) {
      const result = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[obj[key]] = key;
        }
      }
      return result;
    }
    
    // Add the _reverse function to the global constants object
    window.constants = window.constants || {};
    window.constants._reverse = reverseObject;
    
    // Create AWS namespace and utilities
    window.AWS = window.AWS || {};
    window.AWS.util = window.AWS.util || {};
    window.AWS.util.memoizedProperty = window.AWS.util.memoizedProperty || function(obj, name, getter, cacheable) {
      Object.defineProperty(obj, name, {
        enumerable: true,
        configurable: true,
        get: function() {
          var value = getter.call(this);
          if (cacheable !== false) {
            Object.defineProperty(this, name, {
              enumerable: true,
              configurable: true,
              writable: true,
              value: value
            });
          }
          return value;
        }
      });
    };
  }
})();