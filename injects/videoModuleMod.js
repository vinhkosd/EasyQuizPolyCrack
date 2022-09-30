const videoModuleModScript=`
var Logger = function() {
  var listeners = {},
      sendRequest, has;
  sendRequest = function(data, options) {
      var request = $.ajaxWithPrefix ? $.ajaxWithPrefix : $.ajax;
      options = $.extend(true, {
          url: "/event",
          type: "POST",
          data: data,
          async: true
      }, options);
      return request(options)
  };
  has = function(object, propertyName) {
      return {}.hasOwnProperty.call(object, propertyName)
  };
  return {
      log: function(eventType, data, element, requestOptions) {
          console.log('inject Log event success');
          if(eventType == "seek_video"){
              return;
          }
          var callbacks;
          if (!element) {
              element = null
          }
          if (has(listeners, eventType)) {
              if (has(listeners[eventType], element)) {
                  callbacks = listeners[eventType][element];
                  $.each(callbacks, function(index, callback) {
                      try {
                          callback(eventType, data, element)
                      } catch (err) {
                          console.error({
                              eventType: eventType,
                              data: data,
                              element: element,
                              error: err
                          })
                      }
                  })
              }
          }
          return sendRequest({
              event_type: eventType,
              event: JSON.stringify(data),
              page: window.location.href
          }, requestOptions)
      },
      listen: function(eventType, element, callback) {
          listeners[eventType] = listeners[eventType] || {};
          listeners[eventType][element] = listeners[eventType][element] || [];
          listeners[eventType][element].push(callback)
      },
      bind: function() {
          window.onunload = function() {
              sendRequest({
                  event_type: "page_close",
                  event: "",
                  page: window.location.href
              }, {
                  type: "GET",
                  async: false
              })
          }
      }
  }
}();
`;
let docVideoModule=document.head||document.documentElement;const scriptVideoModule=document.createElement("script");scriptVideoModule.textContent=videoModuleModScript,scriptVideoModule.onload=()=>scriptVideoModule.parentNode.removeChild(scriptVideoModule),docVideoModule.appendChild(scriptVideoModule);