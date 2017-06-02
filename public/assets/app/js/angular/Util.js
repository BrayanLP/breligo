(function () {
  'use strict';
var util = angular.module("util", []);
 
util.factory("$util", function($http)
{
	return { 
		view_load: function () {
			angular.element(".loaded").show();
			$timeout(function(){
				angular.element(".loaded").fadeOut();
			}, 300);
		} 

	};
});
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZpZXdfTG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbnZhciB1dGlsID0gYW5ndWxhci5tb2R1bGUoXCJ1dGlsXCIsIFtdKTtcbiBcbnV0aWwuZmFjdG9yeShcIiR1dGlsXCIsIGZ1bmN0aW9uKCRodHRwKVxue1xuXHRyZXR1cm4geyBcblx0XHR2aWV3X2xvYWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChcIi5sb2FkZWRcIikuc2hvdygpO1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50KFwiLmxvYWRlZFwiKS5mYWRlT3V0KCk7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH0gXG5cblx0fTtcbn0pO1xufSkoKTtcbiJdfQ==
