!function(t,n){if("function"==typeof define&&define.amd)define(["exports"],n);else if("undefined"!=typeof exports)n(exports);else{var e={exports:{}};n(e.exports),t.breakpoints=e.exports}}(this,function(t){"use strict";function n(t,n){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?t:n}function e(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(t,n):t.__proto__=n)}function i(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function t(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(n,e,i){return e&&t(n.prototype,e),i&&t(n,i),n}}(),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s={xs:{min:0,max:767},sm:{min:768,max:991},md:{min:992,max:1199},lg:{min:1200,max:1/0}},a={each:function(t,n){var e=void 0;for(var i in t)if(("object"!==("undefined"==typeof t?"undefined":o(t))||t.hasOwnProperty(i))&&(e=n(i,t[i]),e===!1))break},isFunction:function(t){return"function"==typeof t||!1},extend:function(t,n){for(var e in n)t[e]=n[e];return t}},u=function(){function t(){i(this,t),this.length=0,this.list=[]}return r(t,[{key:"add",value:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];this.list.push({fn:t,data:n,one:e}),this.length++}},{key:"remove",value:function(t){for(var n=0;n<this.list.length;n++)this.list[n].fn===t&&(this.list.splice(n,1),this.length--,n--)}},{key:"empty",value:function(){this.list=[],this.length=0}},{key:"call",value:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;n||(n=this.length-1);var i=this.list[n];a.isFunction(e)?e.call(this,t,i,n):a.isFunction(i.fn)&&i.fn.call(t||window,i.data),i.one&&(delete this.list[n],this.length--)}},{key:"fire",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;for(var e in this.list)this.list.hasOwnProperty(e)&&this.call(t,e,n)}}]),t}(),f={current:null,callbacks:new u,trigger:function(t){var n=this.current;this.current=t,this.callbacks.fire(t,function(e,i){a.isFunction(i.fn)&&i.fn.call({current:t,previous:n},i.data)})},one:function(t,n){return this.on(t,n,!0)},on:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];"undefined"==typeof n&&a.isFunction(t)&&(n=t,t=void 0),a.isFunction(n)&&this.callbacks.add(n,t,e)},off:function(t){"undefined"==typeof t&&this.callbacks.empty()}},c=function(){function t(n,e){i(this,t),this.name=n,this.media=e,this.initialize()}return r(t,[{key:"initialize",value:function(){this.callbacks={enter:new u,leave:new u},this.mql=window.matchMedia&&window.matchMedia(this.media)||{matches:!1,media:this.media,addListener:function(){},removeListener:function(){}};var t=this;this.mqlListener=function(n){var e=n.matches&&"enter"||"leave";t.callbacks[e].fire(t)},this.mql.addListener(this.mqlListener)}},{key:"on",value:function(t,n,e){var i=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if("object"===("undefined"==typeof t?"undefined":o(t))){for(var r in t)t.hasOwnProperty(r)&&this.on(r,n,t[r],i);return this}return"undefined"==typeof e&&a.isFunction(n)&&(e=n,n=void 0),a.isFunction(e)?("undefined"!=typeof this.callbacks[t]&&(this.callbacks[t].add(e,n,i),"enter"===t&&this.isMatched()&&this.callbacks[t].call(this)),this):this}},{key:"one",value:function(t,n,e){return this.on(t,n,e,!0)}},{key:"off",value:function(t,n){var e=void 0;if("object"===("undefined"==typeof t?"undefined":o(t))){for(e in t)t.hasOwnProperty(e)&&this.off(e,t[e]);return this}return"undefined"==typeof t?(this.callbacks.enter.empty(),this.callbacks.leave.empty()):t in this.callbacks&&(n?this.callbacks[t].remove(n):this.callbacks[t].empty()),this}},{key:"isMatched",value:function(){return this.mql.matches}},{key:"destroy",value:function(){this.off()}}]),t}(),l={min:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"px";return"(min-width: "+t+n+")"},max:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"px";return"(max-width: "+t+n+")"},between:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"px";return"(min-width: "+t+e+") and (max-width: "+n+e+")"},get:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"px";return 0===t?this.max(n,e):n===1/0?this.min(t,e):this.between(t,n,e)}},h=function(t){function o(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1/0,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"px";i(this,o);var a=l.get(e,r,s),u=n(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,t,a));u.min=e,u.max=r,u.unit=s;var c=u;return u.changeListener=function(){c.isMatched()&&f.trigger(c)},u.isMatched()&&(f.current=u),u.mql.addListener(u.changeListener),u}return e(o,t),r(o,[{key:"destroy",value:function(){this.off(),this.mql.removeListener(this.changeHander)}}]),o}(c),d=function(t){function r(t){i(this,r);var e=[],o=[];return a.each(t.split(" "),function(t,n){var i=g.get(n);i&&(e.push(i),o.push(i.media))}),n(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,t,o.join(",")))}return e(r,t),r}(c),v={version:"1.0.4"},p={},y={},m=window.Breakpoints=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];m.define.apply(m,n)};m.defaults=s,m=a.extend(m,{version:v.version,defined:!1,define:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.defined&&this.destroy(),t||(t=m.defaults),this.options=a.extend(n,{unit:"px"});for(var e in t)t.hasOwnProperty(e)&&this.set(e,t[e].min,t[e].max,this.options.unit);this.defined=!0},destroy:function(){a.each(p,function(t,n){n.destroy()}),p={},f.current=null},is:function(t){var n=this.get(t);return n?n.isMatched():null},all:function(){var t=[];return a.each(p,function(n){t.push(n)}),t},set:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1/0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"px",r=this.get(t);return r&&r.destroy(),p[t]=new h(t,n,e,i),p[t]},get:function(t){return p.hasOwnProperty(t)?p[t]:null},getUnion:function(t){return y.hasOwnProperty(t)?y[t]:(y[t]=new d(t),y[t])},getMin:function(t){var n=this.get(t);return n?n.min:null},getMax:function(t){var n=this.get(t);return n?n.max:null},current:function(){return f.current},getMedia:function(t){var n=this.get(t);return n?n.media:null},on:function(t,n,e,i){var r=arguments.length>4&&void 0!==arguments[4]&&arguments[4];if(t=t.trim(),"change"===t)return i=e,e=n,f.on(e,i,r);if(t.includes(" ")){var o=this.getUnion(t);o&&o.on(n,e,i,r)}else{var s=this.get(t);s&&s.on(n,e,i,r)}return this},one:function(t,n,e,i){return this.on(t,n,e,i,!0)},off:function(t,n,e){if(t=t.trim(),"change"===t)return f.off(n);if(t.includes(" ")){var i=this.getUnion(t);i&&i.off(n,e)}else{var r=this.get(t);r&&r.off(n,e)}return this}});var g=m;t.default=g});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyZWFrcG9pbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImJyZWFrcG9pbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIWZ1bmN0aW9uKHQsbil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXCJleHBvcnRzXCJdLG4pO2Vsc2UgaWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGV4cG9ydHMpbihleHBvcnRzKTtlbHNle3ZhciBlPXtleHBvcnRzOnt9fTtuKGUuZXhwb3J0cyksdC5icmVha3BvaW50cz1lLmV4cG9ydHN9fSh0aGlzLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxuKXtpZighdCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIW58fFwib2JqZWN0XCIhPXR5cGVvZiBuJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBuP3Q6bn1mdW5jdGlvbiBlKHQsbil7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgbiYmbnVsbCE9PW4pdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIrdHlwZW9mIG4pO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobiYmbi5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLG4mJihPYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mKHQsbik6dC5fX3Byb3RvX189bil9ZnVuY3Rpb24gaSh0LG4pe2lmKCEodCBpbnN0YW5jZW9mIG4pKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHI9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsbil7Zm9yKHZhciBlPTA7ZTxuLmxlbmd0aDtlKyspe3ZhciBpPW5bZV07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24obixlLGkpe3JldHVybiBlJiZ0KG4ucHJvdG90eXBlLGUpLGkmJnQobixpKSxufX0oKSxvPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9LHM9e3hzOnttaW46MCxtYXg6NzY3fSxzbTp7bWluOjc2OCxtYXg6OTkxfSxtZDp7bWluOjk5MixtYXg6MTE5OX0sbGc6e21pbjoxMjAwLG1heDoxLzB9fSxhPXtlYWNoOmZ1bmN0aW9uKHQsbil7dmFyIGU9dm9pZCAwO2Zvcih2YXIgaSBpbiB0KWlmKChcIm9iamVjdFwiIT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6byh0KSl8fHQuaGFzT3duUHJvcGVydHkoaSkpJiYoZT1uKGksdFtpXSksZT09PSExKSlicmVha30saXNGdW5jdGlvbjpmdW5jdGlvbih0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0fHwhMX0sZXh0ZW5kOmZ1bmN0aW9uKHQsbil7Zm9yKHZhciBlIGluIG4pdFtlXT1uW2VdO3JldHVybiB0fX0sdT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtpKHRoaXMsdCksdGhpcy5sZW5ndGg9MCx0aGlzLmxpc3Q9W119cmV0dXJuIHIodCxbe2tleTpcImFkZFwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0mJmFyZ3VtZW50c1syXTt0aGlzLmxpc3QucHVzaCh7Zm46dCxkYXRhOm4sb25lOmV9KSx0aGlzLmxlbmd0aCsrfX0se2tleTpcInJlbW92ZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe2Zvcih2YXIgbj0wO248dGhpcy5saXN0Lmxlbmd0aDtuKyspdGhpcy5saXN0W25dLmZuPT09dCYmKHRoaXMubGlzdC5zcGxpY2UobiwxKSx0aGlzLmxlbmd0aC0tLG4tLSl9fSx7a2V5OlwiZW1wdHlcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMubGlzdD1bXSx0aGlzLmxlbmd0aD0wfX0se2tleTpcImNhbGxcIix2YWx1ZTpmdW5jdGlvbih0LG4pe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTpudWxsO258fChuPXRoaXMubGVuZ3RoLTEpO3ZhciBpPXRoaXMubGlzdFtuXTthLmlzRnVuY3Rpb24oZSk/ZS5jYWxsKHRoaXMsdCxpLG4pOmEuaXNGdW5jdGlvbihpLmZuKSYmaS5mbi5jYWxsKHR8fHdpbmRvdyxpLmRhdGEpLGkub25lJiYoZGVsZXRlIHRoaXMubGlzdFtuXSx0aGlzLmxlbmd0aC0tKX19LHtrZXk6XCJmaXJlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOm51bGw7Zm9yKHZhciBlIGluIHRoaXMubGlzdCl0aGlzLmxpc3QuaGFzT3duUHJvcGVydHkoZSkmJnRoaXMuY2FsbCh0LGUsbil9fV0pLHR9KCksZj17Y3VycmVudDpudWxsLGNhbGxiYWNrczpuZXcgdSx0cmlnZ2VyOmZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMuY3VycmVudDt0aGlzLmN1cnJlbnQ9dCx0aGlzLmNhbGxiYWNrcy5maXJlKHQsZnVuY3Rpb24oZSxpKXthLmlzRnVuY3Rpb24oaS5mbikmJmkuZm4uY2FsbCh7Y3VycmVudDp0LHByZXZpb3VzOm59LGkuZGF0YSl9KX0sb25lOmZ1bmN0aW9uKHQsbil7cmV0dXJuIHRoaXMub24odCxuLCEwKX0sb246ZnVuY3Rpb24odCxuKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdO1widW5kZWZpbmVkXCI9PXR5cGVvZiBuJiZhLmlzRnVuY3Rpb24odCkmJihuPXQsdD12b2lkIDApLGEuaXNGdW5jdGlvbihuKSYmdGhpcy5jYWxsYmFja3MuYWRkKG4sdCxlKX0sb2ZmOmZ1bmN0aW9uKHQpe1widW5kZWZpbmVkXCI9PXR5cGVvZiB0JiZ0aGlzLmNhbGxiYWNrcy5lbXB0eSgpfX0sYz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQobixlKXtpKHRoaXMsdCksdGhpcy5uYW1lPW4sdGhpcy5tZWRpYT1lLHRoaXMuaW5pdGlhbGl6ZSgpfXJldHVybiByKHQsW3trZXk6XCJpbml0aWFsaXplXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmNhbGxiYWNrcz17ZW50ZXI6bmV3IHUsbGVhdmU6bmV3IHV9LHRoaXMubXFsPXdpbmRvdy5tYXRjaE1lZGlhJiZ3aW5kb3cubWF0Y2hNZWRpYSh0aGlzLm1lZGlhKXx8e21hdGNoZXM6ITEsbWVkaWE6dGhpcy5tZWRpYSxhZGRMaXN0ZW5lcjpmdW5jdGlvbigpe30scmVtb3ZlTGlzdGVuZXI6ZnVuY3Rpb24oKXt9fTt2YXIgdD10aGlzO3RoaXMubXFsTGlzdGVuZXI9ZnVuY3Rpb24obil7dmFyIGU9bi5tYXRjaGVzJiZcImVudGVyXCJ8fFwibGVhdmVcIjt0LmNhbGxiYWNrc1tlXS5maXJlKHQpfSx0aGlzLm1xbC5hZGRMaXN0ZW5lcih0aGlzLm1xbExpc3RlbmVyKX19LHtrZXk6XCJvblwiLHZhbHVlOmZ1bmN0aW9uKHQsbixlKXt2YXIgaT1hcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXSYmYXJndW1lbnRzWzNdO2lmKFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpvKHQpKSl7Zm9yKHZhciByIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShyKSYmdGhpcy5vbihyLG4sdFtyXSxpKTtyZXR1cm4gdGhpc31yZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgZSYmYS5pc0Z1bmN0aW9uKG4pJiYoZT1uLG49dm9pZCAwKSxhLmlzRnVuY3Rpb24oZSk/KFwidW5kZWZpbmVkXCIhPXR5cGVvZiB0aGlzLmNhbGxiYWNrc1t0XSYmKHRoaXMuY2FsbGJhY2tzW3RdLmFkZChlLG4saSksXCJlbnRlclwiPT09dCYmdGhpcy5pc01hdGNoZWQoKSYmdGhpcy5jYWxsYmFja3NbdF0uY2FsbCh0aGlzKSksdGhpcyk6dGhpc319LHtrZXk6XCJvbmVcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7cmV0dXJuIHRoaXMub24odCxuLGUsITApfX0se2tleTpcIm9mZlwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7dmFyIGU9dm9pZCAwO2lmKFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpvKHQpKSl7Zm9yKGUgaW4gdCl0Lmhhc093blByb3BlcnR5KGUpJiZ0aGlzLm9mZihlLHRbZV0pO3JldHVybiB0aGlzfXJldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiB0Pyh0aGlzLmNhbGxiYWNrcy5lbnRlci5lbXB0eSgpLHRoaXMuY2FsbGJhY2tzLmxlYXZlLmVtcHR5KCkpOnQgaW4gdGhpcy5jYWxsYmFja3MmJihuP3RoaXMuY2FsbGJhY2tzW3RdLnJlbW92ZShuKTp0aGlzLmNhbGxiYWNrc1t0XS5lbXB0eSgpKSx0aGlzfX0se2tleTpcImlzTWF0Y2hlZFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubXFsLm1hdGNoZXN9fSx7a2V5OlwiZGVzdHJveVwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5vZmYoKX19XSksdH0oKSxsPXttaW46ZnVuY3Rpb24odCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOlwicHhcIjtyZXR1cm5cIihtaW4td2lkdGg6IFwiK3QrbitcIilcIn0sbWF4OmZ1bmN0aW9uKHQpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTpcInB4XCI7cmV0dXJuXCIobWF4LXdpZHRoOiBcIit0K24rXCIpXCJ9LGJldHdlZW46ZnVuY3Rpb24odCxuKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06XCJweFwiO3JldHVyblwiKG1pbi13aWR0aDogXCIrdCtlK1wiKSBhbmQgKG1heC13aWR0aDogXCIrbitlK1wiKVwifSxnZXQ6ZnVuY3Rpb24odCxuKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06XCJweFwiO3JldHVybiAwPT09dD90aGlzLm1heChuLGUpOm49PT0xLzA/dGhpcy5taW4odCxlKTp0aGlzLmJldHdlZW4odCxuLGUpfX0saD1mdW5jdGlvbih0KXtmdW5jdGlvbiBvKHQpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTowLHI9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOjEvMCxzPWFyZ3VtZW50cy5sZW5ndGg+MyYmdm9pZCAwIT09YXJndW1lbnRzWzNdP2FyZ3VtZW50c1szXTpcInB4XCI7aSh0aGlzLG8pO3ZhciBhPWwuZ2V0KGUscixzKSx1PW4odGhpcywoby5fX3Byb3RvX198fE9iamVjdC5nZXRQcm90b3R5cGVPZihvKSkuY2FsbCh0aGlzLHQsYSkpO3UubWluPWUsdS5tYXg9cix1LnVuaXQ9czt2YXIgYz11O3JldHVybiB1LmNoYW5nZUxpc3RlbmVyPWZ1bmN0aW9uKCl7Yy5pc01hdGNoZWQoKSYmZi50cmlnZ2VyKGMpfSx1LmlzTWF0Y2hlZCgpJiYoZi5jdXJyZW50PXUpLHUubXFsLmFkZExpc3RlbmVyKHUuY2hhbmdlTGlzdGVuZXIpLHV9cmV0dXJuIGUobyx0KSxyKG8sW3trZXk6XCJkZXN0cm95XCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLm9mZigpLHRoaXMubXFsLnJlbW92ZUxpc3RlbmVyKHRoaXMuY2hhbmdlSGFuZGVyKX19XSksb30oYyksZD1mdW5jdGlvbih0KXtmdW5jdGlvbiByKHQpe2kodGhpcyxyKTt2YXIgZT1bXSxvPVtdO3JldHVybiBhLmVhY2godC5zcGxpdChcIiBcIiksZnVuY3Rpb24odCxuKXt2YXIgaT1nLmdldChuKTtpJiYoZS5wdXNoKGkpLG8ucHVzaChpLm1lZGlhKSl9KSxuKHRoaXMsKHIuX19wcm90b19ffHxPYmplY3QuZ2V0UHJvdG90eXBlT2YocikpLmNhbGwodGhpcyx0LG8uam9pbihcIixcIikpKX1yZXR1cm4gZShyLHQpLHJ9KGMpLHY9e3ZlcnNpb246XCIxLjAuNFwifSxwPXt9LHk9e30sbT13aW5kb3cuQnJlYWtwb2ludHM9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9YXJndW1lbnRzLmxlbmd0aCxuPUFycmF5KHQpLGU9MDtlPHQ7ZSsrKW5bZV09YXJndW1lbnRzW2VdO20uZGVmaW5lLmFwcGx5KG0sbil9O20uZGVmYXVsdHM9cyxtPWEuZXh0ZW5kKG0se3ZlcnNpb246di52ZXJzaW9uLGRlZmluZWQ6ITEsZGVmaW5lOmZ1bmN0aW9uKHQpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTp7fTt0aGlzLmRlZmluZWQmJnRoaXMuZGVzdHJveSgpLHR8fCh0PW0uZGVmYXVsdHMpLHRoaXMub3B0aW9ucz1hLmV4dGVuZChuLHt1bml0OlwicHhcIn0pO2Zvcih2YXIgZSBpbiB0KXQuaGFzT3duUHJvcGVydHkoZSkmJnRoaXMuc2V0KGUsdFtlXS5taW4sdFtlXS5tYXgsdGhpcy5vcHRpb25zLnVuaXQpO3RoaXMuZGVmaW5lZD0hMH0sZGVzdHJveTpmdW5jdGlvbigpe2EuZWFjaChwLGZ1bmN0aW9uKHQsbil7bi5kZXN0cm95KCl9KSxwPXt9LGYuY3VycmVudD1udWxsfSxpczpmdW5jdGlvbih0KXt2YXIgbj10aGlzLmdldCh0KTtyZXR1cm4gbj9uLmlzTWF0Y2hlZCgpOm51bGx9LGFsbDpmdW5jdGlvbigpe3ZhciB0PVtdO3JldHVybiBhLmVhY2gocCxmdW5jdGlvbihuKXt0LnB1c2gobil9KSx0fSxzZXQ6ZnVuY3Rpb24odCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOjAsZT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06MS8wLGk9YXJndW1lbnRzLmxlbmd0aD4zJiZ2b2lkIDAhPT1hcmd1bWVudHNbM10/YXJndW1lbnRzWzNdOlwicHhcIixyPXRoaXMuZ2V0KHQpO3JldHVybiByJiZyLmRlc3Ryb3koKSxwW3RdPW5ldyBoKHQsbixlLGkpLHBbdF19LGdldDpmdW5jdGlvbih0KXtyZXR1cm4gcC5oYXNPd25Qcm9wZXJ0eSh0KT9wW3RdOm51bGx9LGdldFVuaW9uOmZ1bmN0aW9uKHQpe3JldHVybiB5Lmhhc093blByb3BlcnR5KHQpP3lbdF06KHlbdF09bmV3IGQodCkseVt0XSl9LGdldE1pbjpmdW5jdGlvbih0KXt2YXIgbj10aGlzLmdldCh0KTtyZXR1cm4gbj9uLm1pbjpudWxsfSxnZXRNYXg6ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5nZXQodCk7cmV0dXJuIG4/bi5tYXg6bnVsbH0sY3VycmVudDpmdW5jdGlvbigpe3JldHVybiBmLmN1cnJlbnR9LGdldE1lZGlhOmZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMuZ2V0KHQpO3JldHVybiBuP24ubWVkaWE6bnVsbH0sb246ZnVuY3Rpb24odCxuLGUsaSl7dmFyIHI9YXJndW1lbnRzLmxlbmd0aD40JiZ2b2lkIDAhPT1hcmd1bWVudHNbNF0mJmFyZ3VtZW50c1s0XTtpZih0PXQudHJpbSgpLFwiY2hhbmdlXCI9PT10KXJldHVybiBpPWUsZT1uLGYub24oZSxpLHIpO2lmKHQuaW5jbHVkZXMoXCIgXCIpKXt2YXIgbz10aGlzLmdldFVuaW9uKHQpO28mJm8ub24obixlLGkscil9ZWxzZXt2YXIgcz10aGlzLmdldCh0KTtzJiZzLm9uKG4sZSxpLHIpfXJldHVybiB0aGlzfSxvbmU6ZnVuY3Rpb24odCxuLGUsaSl7cmV0dXJuIHRoaXMub24odCxuLGUsaSwhMCl9LG9mZjpmdW5jdGlvbih0LG4sZSl7aWYodD10LnRyaW0oKSxcImNoYW5nZVwiPT09dClyZXR1cm4gZi5vZmYobik7aWYodC5pbmNsdWRlcyhcIiBcIikpe3ZhciBpPXRoaXMuZ2V0VW5pb24odCk7aSYmaS5vZmYobixlKX1lbHNle3ZhciByPXRoaXMuZ2V0KHQpO3ImJnIub2ZmKG4sZSl9cmV0dXJuIHRoaXN9fSk7dmFyIGc9bTt0LmRlZmF1bHQ9Z30pOyJdfQ==