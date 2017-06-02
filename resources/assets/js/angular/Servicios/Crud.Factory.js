(function () {
'use strict';
var crud = angular.module("crud", []);
 
crud.factory("$crud", function($http){
	return { 
		load: function(scope,Services){
			 
			Services.Load().then(function (response) {
				// util.view_load();   
				scope.data_load = response.data;   
				// if (scope.page.prev_page_url !== null) {
				// 	scope.page.prev_page_url = scope.page.prev_page_url.replace("?page=","");
				// }
				// if (scope.page.next_page_url !== null) {
				// 	scope.page.next_page_url = scope.page.next_page_url.replace("?page=","");
				// } 
			}, function (response) {
			});
		}

	};
});
})();