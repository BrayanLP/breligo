!function(t,n){if("function"==typeof define&&define.amd)define(["exports"],n);else if("undefined"!=typeof exports)n(exports);else{var e={exports:{}};n(e.exports),t.breakpoints=e.exports}}(this,function(t){"use strict";function n(t,n){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?t:n}function e(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(t,n):t.__proto__=n)}function i(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function t(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(n,e,i){return e&&t(n.prototype,e),i&&t(n,i),n}}(),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s={xs:{min:0,max:767},sm:{min:768,max:991},md:{min:992,max:1199},lg:{min:1200,max:1/0}},a={each:function(t,n){for(var e in t)if(("object"!==(void 0===t?"undefined":o(t))||t.hasOwnProperty(e))&&!1===n(e,t[e]))break},isFunction:function(t){return"function"==typeof t||!1},extend:function(t,n){for(var e in n)t[e]=n[e];return t}},u=function(){function t(){i(this,t),this.length=0,this.list=[]}return r(t,[{key:"add",value:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];this.list.push({fn:t,data:n,one:e}),this.length++}},{key:"remove",value:function(t){for(var n=0;n<this.list.length;n++)this.list[n].fn===t&&(this.list.splice(n,1),this.length--,n--)}},{key:"empty",value:function(){this.list=[],this.length=0}},{key:"call",value:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;n||(n=this.length-1);var i=this.list[n];a.isFunction(e)?e.call(this,t,i,n):a.isFunction(i.fn)&&i.fn.call(t||window,i.data),i.one&&(delete this.list[n],this.length--)}},{key:"fire",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;for(var e in this.list)this.list.hasOwnProperty(e)&&this.call(t,e,n)}}]),t}(),c={current:null,callbacks:new u,trigger:function(t){var n=this.current;this.current=t,this.callbacks.fire(t,function(e,i){a.isFunction(i.fn)&&i.fn.call({current:t,previous:n},i.data)})},one:function(t,n){return this.on(t,n,!0)},on:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];void 0===n&&a.isFunction(t)&&(n=t,t=void 0),a.isFunction(n)&&this.callbacks.add(n,t,e)},off:function(t){void 0===t&&this.callbacks.empty()}},l=function(){function t(n,e){i(this,t),this.name=n,this.media=e,this.initialize()}return r(t,[{key:"initialize",value:function(){this.callbacks={enter:new u,leave:new u},this.mql=window.matchMedia&&window.matchMedia(this.media)||{matches:!1,media:this.media,addListener:function(){},removeListener:function(){}};var t=this;this.mqlListener=function(n){var e=n.matches&&"enter"||"leave";t.callbacks[e].fire(t)},this.mql.addListener(this.mqlListener)}},{key:"on",value:function(t,n,e){var i=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if("object"===(void 0===t?"undefined":o(t))){for(var r in t)t.hasOwnProperty(r)&&this.on(r,n,t[r],i);return this}return void 0===e&&a.isFunction(n)&&(e=n,n=void 0),a.isFunction(e)?(void 0!==this.callbacks[t]&&(this.callbacks[t].add(e,n,i),"enter"===t&&this.isMatched()&&this.callbacks[t].call(this)),this):this}},{key:"one",value:function(t,n,e){return this.on(t,n,e,!0)}},{key:"off",value:function(t,n){var e=void 0;if("object"===(void 0===t?"undefined":o(t))){for(e in t)t.hasOwnProperty(e)&&this.off(e,t[e]);return this}return void 0===t?(this.callbacks.enter.empty(),this.callbacks.leave.empty()):t in this.callbacks&&(n?this.callbacks[t].remove(n):this.callbacks[t].empty()),this}},{key:"isMatched",value:function(){return this.mql.matches}},{key:"destroy",value:function(){this.off()}}]),t}(),f={min:function(t){return"(min-width: "+t+(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"px")+")"},max:function(t){return"(max-width: "+t+(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"px")+")"},between:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"px";return"(min-width: "+t+e+") and (max-width: "+n+e+")"},get:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"px";return 0===t?this.max(n,e):n===1/0?this.min(t,e):this.between(t,n,e)}},h=function(t){function o(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1/0,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"px";i(this,o);var a=f.get(e,r,s),u=n(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,t,a));u.min=e,u.max=r,u.unit=s;var l=u;return u.changeListener=function(){l.isMatched()&&c.trigger(l)},u.isMatched()&&(c.current=u),u.mql.addListener(u.changeListener),u}return e(o,t),r(o,[{key:"destroy",value:function(){this.off(),this.mql.removeListener(this.changeHander)}}]),o}(l),d=function(t){function r(t){i(this,r);var e=[],o=[];return a.each(t.split(" "),function(t,n){var i=g.get(n);i&&(e.push(i),o.push(i.media))}),n(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,t,o.join(",")))}return e(r,t),r}(l),v={version:"1.0.4"},p={},m={},y=window.Breakpoints=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];y.define.apply(y,n)};y.defaults=s,y=a.extend(y,{version:v.version,defined:!1,define:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.defined&&this.destroy(),t||(t=y.defaults),this.options=a.extend(n,{unit:"px"});for(var e in t)t.hasOwnProperty(e)&&this.set(e,t[e].min,t[e].max,this.options.unit);this.defined=!0},destroy:function(){a.each(p,function(t,n){n.destroy()}),p={},c.current=null},is:function(t){var n=this.get(t);return n?n.isMatched():null},all:function(){var t=[];return a.each(p,function(n){t.push(n)}),t},set:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1/0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"px",r=this.get(t);return r&&r.destroy(),p[t]=new h(t,n,e,i),p[t]},get:function(t){return p.hasOwnProperty(t)?p[t]:null},getUnion:function(t){return m.hasOwnProperty(t)?m[t]:(m[t]=new d(t),m[t])},getMin:function(t){var n=this.get(t);return n?n.min:null},getMax:function(t){var n=this.get(t);return n?n.max:null},current:function(){return c.current},getMedia:function(t){var n=this.get(t);return n?n.media:null},on:function(t,n,e,i){var r=arguments.length>4&&void 0!==arguments[4]&&arguments[4];if("change"===(t=t.trim()))return i=e,e=n,c.on(e,i,r);if(t.includes(" ")){var o=this.getUnion(t);o&&o.on(n,e,i,r)}else{var s=this.get(t);s&&s.on(n,e,i,r)}return this},one:function(t,n,e,i){return this.on(t,n,e,i,!0)},off:function(t,n,e){if("change"===(t=t.trim()))return c.off(n);if(t.includes(" ")){var i=this.getUnion(t);i&&i.off(n,e)}else{var r=this.get(t);r&&r.off(n,e)}return this}});var g=y;t.default=g});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluL2JyZWFrcG9pbnRzL2JyZWFrcG9pbnRzLmpzIl0sIm5hbWVzIjpbInQiLCJuIiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsImUiLCJicmVha3BvaW50cyIsInRoaXMiLCJSZWZlcmVuY2VFcnJvciIsIlR5cGVFcnJvciIsInByb3RvdHlwZSIsIk9iamVjdCIsImNyZWF0ZSIsImNvbnN0cnVjdG9yIiwidmFsdWUiLCJlbnVtZXJhYmxlIiwid3JpdGFibGUiLCJjb25maWd1cmFibGUiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImkiLCJkZWZpbmVQcm9wZXJ0eSIsInIiLCJsZW5ndGgiLCJrZXkiLCJvIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJzIiwieHMiLCJtaW4iLCJtYXgiLCJzbSIsIm1kIiwibGciLCJhIiwiZWFjaCIsImhhc093blByb3BlcnR5IiwiaXNGdW5jdGlvbiIsImV4dGVuZCIsInUiLCJsaXN0IiwiYXJndW1lbnRzIiwicHVzaCIsImZuIiwiZGF0YSIsIm9uZSIsInNwbGljZSIsImNhbGwiLCJ3aW5kb3ciLCJmIiwiY3VycmVudCIsImNhbGxiYWNrcyIsInRyaWdnZXIiLCJmaXJlIiwicHJldmlvdXMiLCJvbiIsImFkZCIsIm9mZiIsImVtcHR5IiwiYyIsIm5hbWUiLCJtZWRpYSIsImluaXRpYWxpemUiLCJlbnRlciIsImxlYXZlIiwibXFsIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwibXFsTGlzdGVuZXIiLCJpc01hdGNoZWQiLCJyZW1vdmUiLCJsIiwiYmV0d2VlbiIsImdldCIsImgiLCJnZXRQcm90b3R5cGVPZiIsInVuaXQiLCJjaGFuZ2VMaXN0ZW5lciIsImNoYW5nZUhhbmRlciIsImQiLCJzcGxpdCIsImciLCJqb2luIiwidiIsInZlcnNpb24iLCJwIiwieSIsIm0iLCJCcmVha3BvaW50cyIsIkFycmF5IiwiYXBwbHkiLCJkZWZhdWx0cyIsImRlZmluZWQiLCJkZXN0cm95Iiwib3B0aW9ucyIsInNldCIsImlzIiwiYWxsIiwiZ2V0VW5pb24iLCJnZXRNaW4iLCJnZXRNYXgiLCJnZXRNZWRpYSIsInRyaW0iLCJpbmNsdWRlcyIsImRlZmF1bHQiXSwibWFwcGluZ3MiOiJDQUFDLFNBQVNBLEVBQUVDLEdBQUcsR0FBRyxrQkFBbUJDLFNBQVFBLE9BQU9DLElBQUlELFFBQVEsV0FBV0QsT0FBUSxJQUFHLG1CQUFvQkcsU0FBUUgsRUFBRUcsYUFBYSxDQUFDLEdBQUlDLElBQUdELFdBQVlILEdBQUVJLEVBQUVELFNBQVNKLEVBQUVNLFlBQVlELEVBQUVELFVBQVVHLEtBQUssU0FBU1AsR0FBRyxZQUFhLFNBQVNDLEdBQUVELEVBQUVDLEdBQUcsSUFBSUQsRUFBRSxLQUFNLElBQUlRLGdCQUFlLDREQUE2RCxRQUFPUCxHQUFHLGdCQUFpQkEsSUFBRyxrQkFBbUJBLEdBQUVELEVBQUVDLEVBQUUsUUFBU0ksR0FBRUwsRUFBRUMsR0FBRyxHQUFHLGtCQUFtQkEsSUFBRyxPQUFPQSxFQUFFLEtBQU0sSUFBSVEsV0FBVSxpRUFBa0VSLEdBQUdELEdBQUVVLFVBQVVDLE9BQU9DLE9BQU9YLEdBQUdBLEVBQUVTLFdBQVdHLGFBQWFDLE1BQU1kLEVBQUVlLFlBQVcsRUFBR0MsVUFBUyxFQUFHQyxjQUFhLEtBQU1oQixJQUFJVSxPQUFPTyxlQUFlUCxPQUFPTyxlQUFlbEIsRUFBRUMsR0FBR0QsRUFBRW1CLFVBQVVsQixHQUFHLFFBQVNtQixHQUFFcEIsRUFBRUMsR0FBRyxLQUFLRCxZQUFhQyxJQUFHLEtBQU0sSUFBSVEsV0FBVSxxQ0FBcUNFLE9BQU9VLGVBQWVyQixFQUFFLGNBQWNjLE9BQU0sR0FBSyxJQUFJUSxHQUFFLFdBQVcsUUFBU3RCLEdBQUVBLEVBQUVDLEdBQUcsSUFBSSxHQUFJSSxHQUFFLEVBQUVBLEVBQUVKLEVBQUVzQixPQUFPbEIsSUFBSSxDQUFDLEdBQUllLEdBQUVuQixFQUFFSSxFQUFHZSxHQUFFTCxXQUFXSyxFQUFFTCxhQUFZLEVBQUdLLEVBQUVI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QUtxRSxJQUFJNUUsRUFBRzRCLElBQUdBLEVBQUU0QixHQUFHdkQsRUFBRUksRUFBRWUsRUFBRUUsR0FBRyxNQUFPZixPQUFNdUMsSUFBSSxTQUFTOUMsRUFBRUMsRUFBRUksRUFBRWUsR0FBRyxNQUFPYixNQUFLaUQsR0FBR3hELEVBQUVDLEVBQUVJLEVBQUVlLEdBQUUsSUFBS3NDLElBQUksU0FBUzFELEVBQUVDLEVBQUVJLEdBQUcsR0FBYyxZQUFYTCxFQUFFQSxFQUFFeUcsUUFBb0IsTUFBT3ZELEdBQUVRLElBQUl6RCxFQUFHLElBQUdELEVBQUUwRyxTQUFTLEtBQUssQ0FBQyxHQUFJdEYsR0FBRWIsS0FBSzhGLFNBQVNyRyxFQUFHb0IsSUFBR0EsRUFBRXNDLElBQUl6RCxFQUFFSSxPQUFPLENBQUMsR0FBSWlCLEdBQUVmLEtBQUtxRSxJQUFJNUUsRUFBR3NCLElBQUdBLEVBQUVvQyxJQUFJekQsRUFBRUksR0FBRyxNQUFPRSxRQUFRLElBQUk2RSxHQUFFTSxDQUFFMUYsR0FBRTJHLFFBQVF2QiIsImZpbGUiOiJhZG1pbi9icmVha3BvaW50cy9icmVha3BvaW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiFmdW5jdGlvbih0LG4pe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTtlbHNlIGlmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBleHBvcnRzKW4oZXhwb3J0cyk7ZWxzZXt2YXIgZT17ZXhwb3J0czp7fX07bihlLmV4cG9ydHMpLHQuYnJlYWtwb2ludHM9ZS5leHBvcnRzfX0odGhpcyxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsbil7aWYoIXQpdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO3JldHVybiFufHxcIm9iamVjdFwiIT10eXBlb2YgbiYmXCJmdW5jdGlvblwiIT10eXBlb2Ygbj90Om59ZnVuY3Rpb24gZSh0LG4pe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIG4mJm51bGwhPT1uKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiK3R5cGVvZiBuKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG4mJm4ucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxuJiYoT2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5zZXRQcm90b3R5cGVPZih0LG4pOnQuX19wcm90b19fPW4pfWZ1bmN0aW9uIGkodCxuKXtpZighKHQgaW5zdGFuY2VvZiBuKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciByPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LG4pe2Zvcih2YXIgZT0wO2U8bi5sZW5ndGg7ZSsrKXt2YXIgaT1uW2VdO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKG4sZSxpKXtyZXR1cm4gZSYmdChuLnByb3RvdHlwZSxlKSxpJiZ0KG4saSksbn19KCksbz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSxzPXt4czp7bWluOjAsbWF4Ojc2N30sc206e21pbjo3NjgsbWF4Ojk5MX0sbWQ6e21pbjo5OTIsbWF4OjExOTl9LGxnOnttaW46MTIwMCxtYXg6MS8wfX0sYT17ZWFjaDpmdW5jdGlvbih0LG4pe3ZhciBlPXZvaWQgMDtmb3IodmFyIGkgaW4gdClpZigoXCJvYmplY3RcIiE9PShcInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOm8odCkpfHx0Lmhhc093blByb3BlcnR5KGkpKSYmKGU9bihpLHRbaV0pLGU9PT0hMSkpYnJlYWt9LGlzRnVuY3Rpb246ZnVuY3Rpb24odCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdHx8ITF9LGV4dGVuZDpmdW5jdGlvbih0LG4pe2Zvcih2YXIgZSBpbiBuKXRbZV09bltlXTtyZXR1cm4gdH19LHU9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7aSh0aGlzLHQpLHRoaXMubGVuZ3RoPTAsdGhpcy5saXN0PVtdfXJldHVybiByKHQsW3trZXk6XCJhZGRcIix2YWx1ZTpmdW5jdGlvbih0LG4pe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdJiZhcmd1bWVudHNbMl07dGhpcy5saXN0LnB1c2goe2ZuOnQsZGF0YTpuLG9uZTplfSksdGhpcy5sZW5ndGgrK319LHtrZXk6XCJyZW1vdmVcIix2YWx1ZTpmdW5jdGlvbih0KXtmb3IodmFyIG49MDtuPHRoaXMubGlzdC5sZW5ndGg7bisrKXRoaXMubGlzdFtuXS5mbj09PXQmJih0aGlzLmxpc3Quc3BsaWNlKG4sMSksdGhpcy5sZW5ndGgtLSxuLS0pfX0se2tleTpcImVtcHR5XCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmxpc3Q9W10sdGhpcy5sZW5ndGg9MH19LHtrZXk6XCJjYWxsXCIsdmFsdWU6ZnVuY3Rpb24odCxuKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06bnVsbDtufHwobj10aGlzLmxlbmd0aC0xKTt2YXIgaT10aGlzLmxpc3Rbbl07YS5pc0Z1bmN0aW9uKGUpP2UuY2FsbCh0aGlzLHQsaSxuKTphLmlzRnVuY3Rpb24oaS5mbikmJmkuZm4uY2FsbCh0fHx3aW5kb3csaS5kYXRhKSxpLm9uZSYmKGRlbGV0ZSB0aGlzLmxpc3Rbbl0sdGhpcy5sZW5ndGgtLSl9fSx7a2V5OlwiZmlyZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTpudWxsO2Zvcih2YXIgZSBpbiB0aGlzLmxpc3QpdGhpcy5saXN0Lmhhc093blByb3BlcnR5KGUpJiZ0aGlzLmNhbGwodCxlLG4pfX1dKSx0fSgpLGY9e2N1cnJlbnQ6bnVsbCxjYWxsYmFja3M6bmV3IHUsdHJpZ2dlcjpmdW5jdGlvbih0KXt2YXIgbj10aGlzLmN1cnJlbnQ7dGhpcy5jdXJyZW50PXQsdGhpcy5jYWxsYmFja3MuZmlyZSh0LGZ1bmN0aW9uKGUsaSl7YS5pc0Z1bmN0aW9uKGkuZm4pJiZpLmZuLmNhbGwoe2N1cnJlbnQ6dCxwcmV2aW91czpufSxpLmRhdGEpfSl9LG9uZTpmdW5jdGlvbih0LG4pe3JldHVybiB0aGlzLm9uKHQsbiwhMCl9LG9uOmZ1bmN0aW9uKHQsbil7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0mJmFyZ3VtZW50c1syXTtcInVuZGVmaW5lZFwiPT10eXBlb2YgbiYmYS5pc0Z1bmN0aW9uKHQpJiYobj10LHQ9dm9pZCAwKSxhLmlzRnVuY3Rpb24obikmJnRoaXMuY2FsbGJhY2tzLmFkZChuLHQsZSl9LG9mZjpmdW5jdGlvbih0KXtcInVuZGVmaW5lZFwiPT10eXBlb2YgdCYmdGhpcy5jYWxsYmFja3MuZW1wdHkoKX19LGM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSl7aSh0aGlzLHQpLHRoaXMubmFtZT1uLHRoaXMubWVkaWE9ZSx0aGlzLmluaXRpYWxpemUoKX1yZXR1cm4gcih0LFt7a2V5OlwiaW5pdGlhbGl6ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5jYWxsYmFja3M9e2VudGVyOm5ldyB1LGxlYXZlOm5ldyB1fSx0aGlzLm1xbD13aW5kb3cubWF0Y2hNZWRpYSYmd2luZG93Lm1hdGNoTWVkaWEodGhpcy5tZWRpYSl8fHttYXRjaGVzOiExLG1lZGlhOnRoaXMubWVkaWEsYWRkTGlzdGVuZXI6ZnVuY3Rpb24oKXt9LHJlbW92ZUxpc3RlbmVyOmZ1bmN0aW9uKCl7fX07dmFyIHQ9dGhpczt0aGlzLm1xbExpc3RlbmVyPWZ1bmN0aW9uKG4pe3ZhciBlPW4ubWF0Y2hlcyYmXCJlbnRlclwifHxcImxlYXZlXCI7dC5jYWxsYmFja3NbZV0uZmlyZSh0KX0sdGhpcy5tcWwuYWRkTGlzdGVuZXIodGhpcy5tcWxMaXN0ZW5lcil9fSx7a2V5Olwib25cIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7dmFyIGk9YXJndW1lbnRzLmxlbmd0aD4zJiZ2b2lkIDAhPT1hcmd1bWVudHNbM10mJmFyZ3VtZW50c1szXTtpZihcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6byh0KSkpe2Zvcih2YXIgciBpbiB0KXQuaGFzT3duUHJvcGVydHkocikmJnRoaXMub24ocixuLHRbcl0saSk7cmV0dXJuIHRoaXN9cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGUmJmEuaXNGdW5jdGlvbihuKSYmKGU9bixuPXZvaWQgMCksYS5pc0Z1bmN0aW9uKGUpPyhcInVuZGVmaW5lZFwiIT10eXBlb2YgdGhpcy5jYWxsYmFja3NbdF0mJih0aGlzLmNhbGxiYWNrc1t0XS5hZGQoZSxuLGkpLFwiZW50ZXJcIj09PXQmJnRoaXMuaXNNYXRjaGVkKCkmJnRoaXMuY2FsbGJhY2tzW3RdLmNhbGwodGhpcykpLHRoaXMpOnRoaXN9fSx7a2V5Olwib25lXCIsdmFsdWU6ZnVuY3Rpb24odCxuLGUpe3JldHVybiB0aGlzLm9uKHQsbixlLCEwKX19LHtrZXk6XCJvZmZcIix2YWx1ZTpmdW5jdGlvbih0LG4pe3ZhciBlPXZvaWQgMDtpZihcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6byh0KSkpe2ZvcihlIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShlKSYmdGhpcy5vZmYoZSx0W2VdKTtyZXR1cm4gdGhpc31yZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgdD8odGhpcy5jYWxsYmFja3MuZW50ZXIuZW1wdHkoKSx0aGlzLmNhbGxiYWNrcy5sZWF2ZS5lbXB0eSgpKTp0IGluIHRoaXMuY2FsbGJhY2tzJiYobj90aGlzLmNhbGxiYWNrc1t0XS5yZW1vdmUobik6dGhpcy5jYWxsYmFja3NbdF0uZW1wdHkoKSksdGhpc319LHtrZXk6XCJpc01hdGNoZWRcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1xbC5tYXRjaGVzfX0se2tleTpcImRlc3Ryb3lcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMub2ZmKCl9fV0pLHR9KCksbD17bWluOmZ1bmN0aW9uKHQpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTpcInB4XCI7cmV0dXJuXCIobWluLXdpZHRoOiBcIit0K24rXCIpXCJ9LG1heDpmdW5jdGlvbih0KXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06XCJweFwiO3JldHVyblwiKG1heC13aWR0aDogXCIrdCtuK1wiKVwifSxiZXR3ZWVuOmZ1bmN0aW9uKHQsbil7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOlwicHhcIjtyZXR1cm5cIihtaW4td2lkdGg6IFwiK3QrZStcIikgYW5kIChtYXgtd2lkdGg6IFwiK24rZStcIilcIn0sZ2V0OmZ1bmN0aW9uKHQsbil7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOlwicHhcIjtyZXR1cm4gMD09PXQ/dGhpcy5tYXgobixlKTpuPT09MS8wP3RoaXMubWluKHQsZSk6dGhpcy5iZXR3ZWVuKHQsbixlKX19LGg9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gbyh0KXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06MCxyPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXToxLzAscz1hcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXT9hcmd1bWVudHNbM106XCJweFwiO2kodGhpcyxvKTt2YXIgYT1sLmdldChlLHIscyksdT1uKHRoaXMsKG8uX19wcm90b19ffHxPYmplY3QuZ2V0UHJvdG90eXBlT2YobykpLmNhbGwodGhpcyx0LGEpKTt1Lm1pbj1lLHUubWF4PXIsdS51bml0PXM7dmFyIGM9dTtyZXR1cm4gdS5jaGFuZ2VMaXN0ZW5lcj1mdW5jdGlvbigpe2MuaXNNYXRjaGVkKCkmJmYudHJpZ2dlcihjKX0sdS5pc01hdGNoZWQoKSYmKGYuY3VycmVudD11KSx1Lm1xbC5hZGRMaXN0ZW5lcih1LmNoYW5nZUxpc3RlbmVyKSx1fXJldHVybiBlKG8sdCkscihvLFt7a2V5OlwiZGVzdHJveVwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5vZmYoKSx0aGlzLm1xbC5yZW1vdmVMaXN0ZW5lcih0aGlzLmNoYW5nZUhhbmRlcil9fV0pLG99KGMpLGQ9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gcih0KXtpKHRoaXMscik7dmFyIGU9W10sbz1bXTtyZXR1cm4gYS5lYWNoKHQuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKHQsbil7dmFyIGk9Zy5nZXQobik7aSYmKGUucHVzaChpKSxvLnB1c2goaS5tZWRpYSkpfSksbih0aGlzLChyLl9fcHJvdG9fX3x8T2JqZWN0LmdldFByb3RvdHlwZU9mKHIpKS5jYWxsKHRoaXMsdCxvLmpvaW4oXCIsXCIpKSl9cmV0dXJuIGUocix0KSxyfShjKSx2PXt2ZXJzaW9uOlwiMS4wLjRcIn0scD17fSx5PXt9LG09d2luZG93LkJyZWFrcG9pbnRzPWZ1bmN0aW9uKCl7Zm9yKHZhciB0PWFyZ3VtZW50cy5sZW5ndGgsbj1BcnJheSh0KSxlPTA7ZTx0O2UrKyluW2VdPWFyZ3VtZW50c1tlXTttLmRlZmluZS5hcHBseShtLG4pfTttLmRlZmF1bHRzPXMsbT1hLmV4dGVuZChtLHt2ZXJzaW9uOnYudmVyc2lvbixkZWZpbmVkOiExLGRlZmluZTpmdW5jdGlvbih0KXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06e307dGhpcy5kZWZpbmVkJiZ0aGlzLmRlc3Ryb3koKSx0fHwodD1tLmRlZmF1bHRzKSx0aGlzLm9wdGlvbnM9YS5leHRlbmQobix7dW5pdDpcInB4XCJ9KTtmb3IodmFyIGUgaW4gdCl0Lmhhc093blByb3BlcnR5KGUpJiZ0aGlzLnNldChlLHRbZV0ubWluLHRbZV0ubWF4LHRoaXMub3B0aW9ucy51bml0KTt0aGlzLmRlZmluZWQ9ITB9LGRlc3Ryb3k6ZnVuY3Rpb24oKXthLmVhY2gocCxmdW5jdGlvbih0LG4pe24uZGVzdHJveSgpfSkscD17fSxmLmN1cnJlbnQ9bnVsbH0saXM6ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5nZXQodCk7cmV0dXJuIG4/bi5pc01hdGNoZWQoKTpudWxsfSxhbGw6ZnVuY3Rpb24oKXt2YXIgdD1bXTtyZXR1cm4gYS5lYWNoKHAsZnVuY3Rpb24obil7dC5wdXNoKG4pfSksdH0sc2V0OmZ1bmN0aW9uKHQpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTowLGU9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOjEvMCxpPWFyZ3VtZW50cy5sZW5ndGg+MyYmdm9pZCAwIT09YXJndW1lbnRzWzNdP2FyZ3VtZW50c1szXTpcInB4XCIscj10aGlzLmdldCh0KTtyZXR1cm4gciYmci5kZXN0cm95KCkscFt0XT1uZXcgaCh0LG4sZSxpKSxwW3RdfSxnZXQ6ZnVuY3Rpb24odCl7cmV0dXJuIHAuaGFzT3duUHJvcGVydHkodCk/cFt0XTpudWxsfSxnZXRVbmlvbjpmdW5jdGlvbih0KXtyZXR1cm4geS5oYXNPd25Qcm9wZXJ0eSh0KT95W3RdOih5W3RdPW5ldyBkKHQpLHlbdF0pfSxnZXRNaW46ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5nZXQodCk7cmV0dXJuIG4/bi5taW46bnVsbH0sZ2V0TWF4OmZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMuZ2V0KHQpO3JldHVybiBuP24ubWF4Om51bGx9LGN1cnJlbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZi5jdXJyZW50fSxnZXRNZWRpYTpmdW5jdGlvbih0KXt2YXIgbj10aGlzLmdldCh0KTtyZXR1cm4gbj9uLm1lZGlhOm51bGx9LG9uOmZ1bmN0aW9uKHQsbixlLGkpe3ZhciByPWFyZ3VtZW50cy5sZW5ndGg+NCYmdm9pZCAwIT09YXJndW1lbnRzWzRdJiZhcmd1bWVudHNbNF07aWYodD10LnRyaW0oKSxcImNoYW5nZVwiPT09dClyZXR1cm4gaT1lLGU9bixmLm9uKGUsaSxyKTtpZih0LmluY2x1ZGVzKFwiIFwiKSl7dmFyIG89dGhpcy5nZXRVbmlvbih0KTtvJiZvLm9uKG4sZSxpLHIpfWVsc2V7dmFyIHM9dGhpcy5nZXQodCk7cyYmcy5vbihuLGUsaSxyKX1yZXR1cm4gdGhpc30sb25lOmZ1bmN0aW9uKHQsbixlLGkpe3JldHVybiB0aGlzLm9uKHQsbixlLGksITApfSxvZmY6ZnVuY3Rpb24odCxuLGUpe2lmKHQ9dC50cmltKCksXCJjaGFuZ2VcIj09PXQpcmV0dXJuIGYub2ZmKG4pO2lmKHQuaW5jbHVkZXMoXCIgXCIpKXt2YXIgaT10aGlzLmdldFVuaW9uKHQpO2kmJmkub2ZmKG4sZSl9ZWxzZXt2YXIgcj10aGlzLmdldCh0KTtyJiZyLm9mZihuLGUpfXJldHVybiB0aGlzfX0pO3ZhciBnPW07dC5kZWZhdWx0PWd9KTsiXX0=