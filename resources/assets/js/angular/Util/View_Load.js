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
