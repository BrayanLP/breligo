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
(function () {
'use strict';
var model = angular.module('model', 
    ['Services' ]);

var seletedValue = 15;

model.controller('Ctrl', 
    ['$scope',
    '$http',
    'upload',
    'CSRF_TOKEN',
    '$timeout',
    'Services', 
    function(
        $scope,
        $http,
        upload,
        CSRF_TOKEN,
        $timeout,
        Services)
{ 
    $scope.cant_rows = "10";
    var html = function(id) { 
        return document.getElementById(id); 
    }; 

    $scope.path = window.location.href;
    // console.log($scope.path,base_url);
  
    $scope.load = function(q,p,page){
        if(q == undefined){ 
            q = "";
        }  
        Services.Load(q,p,page).then(function (response) {
            $scope.data_load = response.data;
            $scope.to = response.to; 
            $scope.total = response.total;
            $scope.last_page = response.last_page;
            $scope.current_page = response.current_page;
            $scope.next_page_url = response.next_page_url;
            $scope.prev_page_url = response.prev_page_url; 
            if($scope.prev_page_url !== null) {
                $scope.prev_page_url = $scope.prev_page_url.replace("?page=","");
            }
            if($scope.next_page_url !== null) {
                $scope.next_page_url = $scope.next_page_url.replace("?page=",""); 
            }  
        }, function (response) {
        }); 
    }
    // $scope.load('',$scope.cant_rows,1); 
    $scope.array = ['cant_rows','search_text'];
    $scope.$watchGroup($scope.array, function(n){
        if(n != undefined){
            $scope.load($scope.search_text,$scope.cant_rows,1);
        }
        else{
            $scope.load('',$scope.cant_rows,1);
        }
    }); 
    $scope.init = function(){
        $scope.load('',$scope.cant_rows,1);
    }  
 
    $scope.show = function(id){
        $scope.edit_copia = {};
        Services.Edit(id).then(function (response) {
            $scope.edit = response;
            // $('input[name="nombre_edit"]').val(response.nombre); 
            $scope.edit_copia.n = response.nombre; 
        }, function (response) {
        });
    };
    // $scope.create = function(){
    //     $scope.uploadFile();
    //     $scope.edit_copia = {};
    //     var store;
    //     store =
    //     {
    //         nombre:$scope.create.nombre
    //     }
    //     console.log(store, $("input[name='icon']").val());
    //     Services.Create(store).then(function (response) {
    //         $scope.message(response);
    //         // console.log(response);
    //         $('#create').modal('hide');
    //         $scope.init();
    //     }, function (response) {
    //         $scope.message(response);
    //     });
    // };
   //  $scope.create = function(message){ 
   //      var formElement = document.getElementById("serv_add");
   //      var formData = new FormData(formElement);
   //      console.log(formData);
   //      formData.append('_token', CSRF_TOKEN);
   //      $http({
   //         method: 'POST',
   //         url: base_url +'/api/v1/services',
   //         data: formData,
   //         headers: {'enctype': 'multipart/form-data'},
   //         processData:false,
   //         cache:false
   //      }). 
   //     success(function(response, status, headers, config){
   //         console.log(response);
   //          $('#create').modal('hide');
   //          $scope.init(); 
   //     }); 
   // };
    $scope.update = function(id){
        if($scope.edit_copia.n != $scope.edit.nombre){ 
            swal({
                title: 'Desea Actualizar?',
                text: "confirmar si esta seguro de actualizar el registro",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Actualizar',
                allowOutsideClick: false
            }).then(function () { 
                var update;
                update = {
                    nombre:$scope.edit.nombre
                }
                Services.Update(id,update).then(function (response) {
                    $scope.message(response);
                    $('#edit').modal('hide');
                    $scope.init();
                }, function (response) {
                });
            });
        }
        else{
            displayToastr('info','No se realizaron cambios','Notificación');
            $('#edit').modal('hide');      
        }
    };
    $scope.delete = function(id){ 
        swal({
            title: 'Quieres Eliminar?',
            text: "confirmar si esta seguro de eliminar el registro",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            allowOutsideClick: false
        }).then(function () { 
            Services.Delete(id).then(function (response) {
                $scope.message(response);
                $scope.init();
            }, function (response) {
            });
        });
    }; 

    $scope.files = []; 
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {    
            $scope.files.push(args.file);
        });
    }); 
    $scope.uploadFile = function()
    {
        // var name = $scope.name;
        var file = $scope.icon;
        
        upload.uploadFile(file).then(function(res){
            console.log(res);
        });
    };
    $scope.guardar = function (){
        swal({
            title: 'Desea Crear?',
            text: "confirmar si esta seguro de crear el registro",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, crear',
            allowOutsideClick: false
        }).then(function () { 
            var formElement = document.getElementById("add");
            var formData = new FormData(formElement);
            formData.append('_token', CSRF_TOKEN);
            $http({
                method: 'POST', 
                url: base_url +'/api/v1/services',
                headers: {'Content-Type': undefined },
                data: formData,
                processData:false,
                cache:false
            }).success(function(response) { 
                $scope.message(response);
            }).error(function(response) {
                $scope.message(response); 
            },function(response){  
                $scope.message(response);  
            });
        });
    };
    $scope.clear_input = function(){
        $("input[name='icon']").val('');
        $("input[name='nombre']").val(''); 
    }
    $scope.message = function(response){ 
        if( response.status == 202 ){ 
            displayToastr('warning',response.message,'Campos Requeridos');
        }
        else if( response.status == 200 ){
            displayToastr('success',response.message ,'Felicitaciones');   
        }
        else{
            displayToastr('error','Registro ocurrio un error Inesperado','Que paso?');      
        }
    }      
    // $scope.update = function (id){ 
    //     var form_edit = document.getElementById("edit");

    //     var formData_edit = new FormData_edit(form_edit);
    //     formData_edit.append('_token', CSRF_TOKEN);

    //     $http({
    //         method: 'PUT', 
    //         url: base_url +'/api/v1/services/'+id,
    //         headers: {'Content-Type': undefined },
    //         data: formData_edit,
    //         processData:false,
    //         cache:false
    //     }).success(function(response) {
    //         console.log(response); 
             
    //     },function(response){   
    //     });
    // };
     
 
}]);
model.directive('uploaderModel', ["$parse", function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) 
        {
            iElement.on("change", function(e)
            {
                $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
            });
        }
    };
}])

model.service('upload', ["$http", "$q", function ($http, $q) 
{
    this.uploadFile = function(file)
    {
        var deferred = $q.defer();
        console.log(base_url);
        var form_edit = document.getElementById("add");
        // var formData_edit = new FormData_edit(form_edit);
        var formData = new FormData(form_edit);
        // formData.append("name", name);
        formData.append("icon", file);
        return $http.post(base_url + "/api/v1/services/uploadFile", formData, {
            headers: {
                "Content-type": undefined
            },
            data: formData,
            processData:false,
            transformRequest: formData
        })
        .success(function(res)
        {
            deferred.resolve(res);
            console.log(res);
        })
        .error(function(msg, code)
        {
            deferred.reject(msg);
            console.log(msg);
        })
        return deferred.promise;
    }   
}])
// model.directive('fileUpload', function () {
//     return {
//         scope: true,        //create a new scope
//         link: function (scope, el, attrs) {
//             el.bind('change', function (event) {
//                 var files = event.target.files;
//                 //iterate files since 'multiple' may be specified on the element
//                 for (var i = 0;i<files.length;i++) {
//                     //emit event upward
//                     scope.$emit("fileSelected", { file: files[i] });
//                 }                                       
//             });
//         }
//     };
// });
// model.directive("filesInput", function() {
//   return {
//     require: "ngModel",
//     link: function postLink(scope,elem,attrs,ngModel) {
//       elem.on("change", function(e) {
//         var img = elem[0].files;
//         console.log(ngModel.$setViewValue(img));
//         ngModel.$setViewValue(img);
//       })
//     }
//   }
// });
// model.directive('fileInput', ['$parse', function ($parse) {
//     return {
//         restrict: 'A',
//         link: function (scope, element, attributes) {
//             element.bind('change', function () {
//                 $parse(attributes.fileInput)
//                 .assign(scope,element[0].files)
//                 scope.$apply()
//             });
//         }
//     };
// }]);
// model.directive("fileread", [function () {
//     return {
//         scope: {
//             fileread: "="
//         },
//         link: function (scope, element, attributes) {
//             element.bind("change", function (changeEvent) {
//                 var reader = new FileReader();
//                 reader.onload = function (loadEvent) {
//                     scope.$apply(function () {
//                         scope.fileread = loadEvent.target.result;
//                     });
//                 }
//                 reader.readAsDataURL(changeEvent.target.files[0]);
//             });
//         }
//     }
// }]);
// model.directive('bindFile', [function () {
//     return {
//         require: "ngModel",
//         restrict: 'A',
//         link: function ($scope, el, attrs, ngModel) {
//             el.bind('change', function (event) {
//                 ngModel.$setViewValue(event.target.files[0]);
//                 $scope.$apply();
//             });

//             $scope.$watch(function () {
//                 return ngModel.$viewValue;
//             }, function (value) {
//                 if (!value) {
//                     el.val("");
//                 }
//             });
//         }
//     };
// }]);

})();
(function () {
'use strict';
angular.module('Services', [])
.factory('Services', function($http) {
    return { 
        Load: function(q,p,page){
            return $http.get(base_url +'/api/v1/services?nombre='+q+'&per_page='+p+'&page='+page).then(function (response){  
                return response.data;
            });
        },
        See: function(id){
            return $http.get(base_url +'/api/v1/services/'+id).then(function (response){
                return response.data;
            });
        },
        Edit: function(id){
            return $http.get(base_url +'/api/v1/services/'+id).then(function (response){
                return response.data;
            });
        }, 
        Update: function(id,data){
            return $http.put(base_url +'/api/v1/services/'+id,data).then(function (response){
                return response.data;
            });
        },
        Create: function(data){
            return $http.post(base_url +'/api/v1/services',data).then(function (response){
                return response.data;
            });
        },
        Delete: function(id){
            return $http.delete(base_url +'/api/v1/services/'+id).then(function (response){
                return response.data;
            });
        } 
    };
}); 
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNydWQuRmFjdG9yeS5qcyIsIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlNlcnZpY2lvcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4ndXNlIHN0cmljdCc7XG52YXIgY3J1ZCA9IGFuZ3VsYXIubW9kdWxlKFwiY3J1ZFwiLCBbXSk7XG4gXG5jcnVkLmZhY3RvcnkoXCIkY3J1ZFwiLCBmdW5jdGlvbigkaHR0cCl7XG5cdHJldHVybiB7IFxuXHRcdGxvYWQ6IGZ1bmN0aW9uKHNjb3BlLFNlcnZpY2VzKXtcblx0XHRcdCBcblx0XHRcdFNlcnZpY2VzLkxvYWQoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHQvLyB1dGlsLnZpZXdfbG9hZCgpOyAgIFxuXHRcdFx0XHRzY29wZS5kYXRhX2xvYWQgPSByZXNwb25zZS5kYXRhOyAgIFxuXHRcdFx0XHQvLyBpZiAoc2NvcGUucGFnZS5wcmV2X3BhZ2VfdXJsICE9PSBudWxsKSB7XG5cdFx0XHRcdC8vIFx0c2NvcGUucGFnZS5wcmV2X3BhZ2VfdXJsID0gc2NvcGUucGFnZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcblx0XHRcdFx0Ly8gfVxuXHRcdFx0XHQvLyBpZiAoc2NvcGUucGFnZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG5cdFx0XHRcdC8vIFx0c2NvcGUucGFnZS5uZXh0X3BhZ2VfdXJsID0gc2NvcGUucGFnZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcblx0XHRcdFx0Ly8gfSBcblx0XHRcdH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH07XG59KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbnZhciBtb2RlbCA9IGFuZ3VsYXIubW9kdWxlKCdtb2RlbCcsIFxuICAgIFsnU2VydmljZXMnIF0pO1xuXG52YXIgc2VsZXRlZFZhbHVlID0gMTU7XG5cbm1vZGVsLmNvbnRyb2xsZXIoJ0N0cmwnLCBcbiAgICBbJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAndXBsb2FkJyxcbiAgICAnQ1NSRl9UT0tFTicsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnU2VydmljZXMnLCBcbiAgICBmdW5jdGlvbihcbiAgICAgICAgJHNjb3BlLFxuICAgICAgICAkaHR0cCxcbiAgICAgICAgdXBsb2FkLFxuICAgICAgICBDU1JGX1RPS0VOLFxuICAgICAgICAkdGltZW91dCxcbiAgICAgICAgU2VydmljZXMpXG57IFxuICAgICRzY29wZS5jYW50X3Jvd3MgPSBcIjEwXCI7XG4gICAgdmFyIGh0bWwgPSBmdW5jdGlvbihpZCkgeyBcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTsgXG4gICAgfTsgXG5cbiAgICAkc2NvcGUucGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5wYXRoLGJhc2VfdXJsKTtcbiAgXG4gICAgJHNjb3BlLmxvYWQgPSBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgIGlmKHEgPT0gdW5kZWZpbmVkKXsgXG4gICAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfSAgXG4gICAgICAgIFNlcnZpY2VzLkxvYWQocSxwLHBhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YV9sb2FkID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSAgXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTsgXG4gICAgfVxuICAgIC8vICRzY29wZS5sb2FkKCcnLCRzY29wZS5jYW50X3Jvd3MsMSk7IFxuICAgICRzY29wZS5hcnJheSA9IFsnY2FudF9yb3dzJywnc2VhcmNoX3RleHQnXTtcbiAgICAkc2NvcGUuJHdhdGNoR3JvdXAoJHNjb3BlLmFycmF5LCBmdW5jdGlvbihuKXtcbiAgICAgICAgaWYobiAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgJHNjb3BlLmxvYWQoJHNjb3BlLnNlYXJjaF90ZXh0LCRzY29wZS5jYW50X3Jvd3MsMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICRzY29wZS5sb2FkKCcnLCRzY29wZS5jYW50X3Jvd3MsMSk7XG4gICAgICAgIH1cbiAgICB9KTsgXG4gICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubG9hZCgnJywkc2NvcGUuY2FudF9yb3dzLDEpO1xuICAgIH0gIFxuIFxuICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAkc2NvcGUuZWRpdF9jb3BpYSA9IHt9O1xuICAgICAgICBTZXJ2aWNlcy5FZGl0KGlkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmVkaXQgPSByZXNwb25zZTtcbiAgICAgICAgICAgIC8vICQoJ2lucHV0W25hbWU9XCJub21icmVfZWRpdFwiXScpLnZhbChyZXNwb25zZS5ub21icmUpOyBcbiAgICAgICAgICAgICRzY29wZS5lZGl0X2NvcGlhLm4gPSByZXNwb25zZS5ub21icmU7IFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgJHNjb3BlLnVwbG9hZEZpbGUoKTtcbiAgICAvLyAgICAgJHNjb3BlLmVkaXRfY29waWEgPSB7fTtcbiAgICAvLyAgICAgdmFyIHN0b3JlO1xuICAgIC8vICAgICBzdG9yZSA9XG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIG5vbWJyZTokc2NvcGUuY3JlYXRlLm5vbWJyZVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHN0b3JlLCAkKFwiaW5wdXRbbmFtZT0naWNvbiddXCIpLnZhbCgpKTtcbiAgICAvLyAgICAgU2VydmljZXMuQ3JlYXRlKHN0b3JlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgJHNjb3BlLm1lc3NhZ2UocmVzcG9uc2UpO1xuICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIC8vICAgICAgICAgJCgnI2NyZWF0ZScpLm1vZGFsKCdoaWRlJyk7XG4gICAgLy8gICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgIC8vICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfTtcbiAgIC8vICAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24obWVzc2FnZSl7IFxuICAgLy8gICAgICB2YXIgZm9ybUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlcnZfYWRkXCIpO1xuICAgLy8gICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybUVsZW1lbnQpO1xuICAgLy8gICAgICBjb25zb2xlLmxvZyhmb3JtRGF0YSk7XG4gICAvLyAgICAgIGZvcm1EYXRhLmFwcGVuZCgnX3Rva2VuJywgQ1NSRl9UT0tFTik7XG4gICAvLyAgICAgICRodHRwKHtcbiAgIC8vICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAvLyAgICAgICAgIHVybDogYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzJyxcbiAgIC8vICAgICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAvLyAgICAgICAgIGhlYWRlcnM6IHsnZW5jdHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ30sXG4gICAvLyAgICAgICAgIHByb2Nlc3NEYXRhOmZhbHNlLFxuICAgLy8gICAgICAgICBjYWNoZTpmYWxzZVxuICAgLy8gICAgICB9KS4gXG4gICAvLyAgICAgc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAvLyAgICAgICAgICAkKCcjY3JlYXRlJykubW9kYWwoJ2hpZGUnKTtcbiAgIC8vICAgICAgICAgICRzY29wZS5pbml0KCk7IFxuICAgLy8gICAgIH0pOyBcbiAgIC8vIH07XG4gICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgaWYoJHNjb3BlLmVkaXRfY29waWEubiAhPSAkc2NvcGUuZWRpdC5ub21icmUpeyBcbiAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRGVzZWEgQWN0dWFsaXphcj8nLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwiY29uZmlybWFyIHNpIGVzdGEgc2VndXJvIGRlIGFjdHVhbGl6YXIgZWwgcmVnaXN0cm9cIixcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMzA4NWQ2JyxcbiAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25Db2xvcjogJyNkMzMnLFxuICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnU2ksIEFjdHVhbGl6YXInLFxuICAgICAgICAgICAgICAgIGFsbG93T3V0c2lkZUNsaWNrOiBmYWxzZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7IFxuICAgICAgICAgICAgICAgIHZhciB1cGRhdGU7XG4gICAgICAgICAgICAgICAgdXBkYXRlID0ge1xuICAgICAgICAgICAgICAgICAgICBub21icmU6JHNjb3BlLmVkaXQubm9tYnJlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFNlcnZpY2VzLlVwZGF0ZShpZCx1cGRhdGUpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2VkaXQnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGRpc3BsYXlUb2FzdHIoJ2luZm8nLCdObyBzZSByZWFsaXphcm9uIGNhbWJpb3MnLCdOb3RpZmljYWNpw7NuJyk7XG4gICAgICAgICAgICAkKCcjZWRpdCcpLm1vZGFsKCdoaWRlJyk7ICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xuICAgICRzY29wZS5kZWxldGUgPSBmdW5jdGlvbihpZCl7IFxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgIHRpdGxlOiAnUXVpZXJlcyBFbGltaW5hcj8nLFxuICAgICAgICAgICAgdGV4dDogXCJjb25maXJtYXIgc2kgZXN0YSBzZWd1cm8gZGUgZWxpbWluYXIgZWwgcmVnaXN0cm9cIixcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMzA4NWQ2JyxcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvbkNvbG9yOiAnI2QzMycsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ1NpLCBFbGltaW5hcicsXG4gICAgICAgICAgICBhbGxvd091dHNpZGVDbGljazogZmFsc2VcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7IFxuICAgICAgICAgICAgU2VydmljZXMuRGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTsgXG5cbiAgICAkc2NvcGUuZmlsZXMgPSBbXTsgXG4gICAgJHNjb3BlLiRvbihcImZpbGVTZWxlY3RlZFwiLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcbiAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7ICAgIFxuICAgICAgICAgICAgJHNjb3BlLmZpbGVzLnB1c2goYXJncy5maWxlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7IFxuICAgICRzY29wZS51cGxvYWRGaWxlID0gZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgLy8gdmFyIG5hbWUgPSAkc2NvcGUubmFtZTtcbiAgICAgICAgdmFyIGZpbGUgPSAkc2NvcGUuaWNvbjtcbiAgICAgICAgXG4gICAgICAgIHVwbG9hZC51cGxvYWRGaWxlKGZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmd1YXJkYXIgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ0Rlc2VhIENyZWFyPycsXG4gICAgICAgICAgICB0ZXh0OiBcImNvbmZpcm1hciBzaSBlc3RhIHNlZ3VybyBkZSBjcmVhciBlbCByZWdpc3Ryb1wiLFxuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogJyMzMDg1ZDYnLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uQ29sb3I6ICcjZDMzJyxcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnU2ksIGNyZWFyJyxcbiAgICAgICAgICAgIGFsbG93T3V0c2lkZUNsaWNrOiBmYWxzZVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHsgXG4gICAgICAgICAgICB2YXIgZm9ybUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZFwiKTtcbiAgICAgICAgICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtRWxlbWVudCk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ190b2tlbicsIENTUkZfVE9LRU4pO1xuICAgICAgICAgICAgJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLCBcbiAgICAgICAgICAgICAgICB1cmw6IGJhc2VfdXJsICsnL2FwaS92MS9zZXJ2aWNlcycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiB1bmRlZmluZWQgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTpmYWxzZSxcbiAgICAgICAgICAgICAgICBjYWNoZTpmYWxzZVxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkgeyBcbiAgICAgICAgICAgICAgICAkc2NvcGUubWVzc2FnZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTsgXG4gICAgICAgICAgICB9LGZ1bmN0aW9uKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTsgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmNsZWFyX2lucHV0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJChcImlucHV0W25hbWU9J2ljb24nXVwiKS52YWwoJycpO1xuICAgICAgICAkKFwiaW5wdXRbbmFtZT0nbm9tYnJlJ11cIikudmFsKCcnKTsgXG4gICAgfVxuICAgICRzY29wZS5tZXNzYWdlID0gZnVuY3Rpb24ocmVzcG9uc2UpeyBcbiAgICAgICAgaWYoIHJlc3BvbnNlLnN0YXR1cyA9PSAyMDIgKXsgXG4gICAgICAgICAgICBkaXNwbGF5VG9hc3RyKCd3YXJuaW5nJyxyZXNwb25zZS5tZXNzYWdlLCdDYW1wb3MgUmVxdWVyaWRvcycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIHJlc3BvbnNlLnN0YXR1cyA9PSAyMDAgKXtcbiAgICAgICAgICAgIGRpc3BsYXlUb2FzdHIoJ3N1Y2Nlc3MnLHJlc3BvbnNlLm1lc3NhZ2UgLCdGZWxpY2l0YWNpb25lcycpOyAgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBkaXNwbGF5VG9hc3RyKCdlcnJvcicsJ1JlZ2lzdHJvIG9jdXJyaW8gdW4gZXJyb3IgSW5lc3BlcmFkbycsJ1F1ZSBwYXNvPycpOyAgICAgIFxuICAgICAgICB9XG4gICAgfSAgICAgIFxuICAgIC8vICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbiAoaWQpeyBcbiAgICAvLyAgICAgdmFyIGZvcm1fZWRpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKTtcblxuICAgIC8vICAgICB2YXIgZm9ybURhdGFfZWRpdCA9IG5ldyBGb3JtRGF0YV9lZGl0KGZvcm1fZWRpdCk7XG4gICAgLy8gICAgIGZvcm1EYXRhX2VkaXQuYXBwZW5kKCdfdG9rZW4nLCBDU1JGX1RPS0VOKTtcblxuICAgIC8vICAgICAkaHR0cCh7XG4gICAgLy8gICAgICAgICBtZXRob2Q6ICdQVVQnLCBcbiAgICAvLyAgICAgICAgIHVybDogYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzLycraWQsXG4gICAgLy8gICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZCB9LFxuICAgIC8vICAgICAgICAgZGF0YTogZm9ybURhdGFfZWRpdCxcbiAgICAvLyAgICAgICAgIHByb2Nlc3NEYXRhOmZhbHNlLFxuICAgIC8vICAgICAgICAgY2FjaGU6ZmFsc2VcbiAgICAvLyAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpOyBcbiAgICAgICAgICAgICBcbiAgICAvLyAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7ICAgXG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH07XG4gICAgIFxuIFxufV0pO1xubW9kZWwuZGlyZWN0aXZlKCd1cGxvYWRlck1vZGVsJywgW1wiJHBhcnNlXCIsIGZ1bmN0aW9uICgkcGFyc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIFxuICAgICAgICB7XG4gICAgICAgICAgICBpRWxlbWVudC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICRwYXJzZShpQXR0cnMudXBsb2FkZXJNb2RlbCkuYXNzaWduKHNjb3BlLCBpRWxlbWVudFswXS5maWxlc1swXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XSlcblxubW9kZWwuc2VydmljZSgndXBsb2FkJywgW1wiJGh0dHBcIiwgXCIkcVwiLCBmdW5jdGlvbiAoJGh0dHAsICRxKSBcbntcbiAgICB0aGlzLnVwbG9hZEZpbGUgPSBmdW5jdGlvbihmaWxlKVxuICAgIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgY29uc29sZS5sb2coYmFzZV91cmwpO1xuICAgICAgICB2YXIgZm9ybV9lZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGRcIik7XG4gICAgICAgIC8vIHZhciBmb3JtRGF0YV9lZGl0ID0gbmV3IEZvcm1EYXRhX2VkaXQoZm9ybV9lZGl0KTtcbiAgICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm1fZWRpdCk7XG4gICAgICAgIC8vIGZvcm1EYXRhLmFwcGVuZChcIm5hbWVcIiwgbmFtZSk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImljb25cIiwgZmlsZSk7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2VfdXJsICsgXCIvYXBpL3YxL3NlcnZpY2VzL3VwbG9hZEZpbGVcIiwgZm9ybURhdGEsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOmZhbHNlLFxuICAgICAgICAgICAgdHJhbnNmb3JtUmVxdWVzdDogZm9ybURhdGFcbiAgICAgICAgfSlcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKVxuICAgICAgICB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICB9KVxuICAgICAgICAuZXJyb3IoZnVuY3Rpb24obXNnLCBjb2RlKVxuICAgICAgICB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobXNnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0gICBcbn1dKVxuLy8gbW9kZWwuZGlyZWN0aXZlKCdmaWxlVXBsb2FkJywgZnVuY3Rpb24gKCkge1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIHNjb3BlOiB0cnVlLCAgICAgICAgLy9jcmVhdGUgYSBuZXcgc2NvcGVcbi8vICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbCwgYXR0cnMpIHtcbi8vICAgICAgICAgICAgIGVsLmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgICAgICAgICAgICAgIHZhciBmaWxlcyA9IGV2ZW50LnRhcmdldC5maWxlcztcbi8vICAgICAgICAgICAgICAgICAvL2l0ZXJhdGUgZmlsZXMgc2luY2UgJ211bHRpcGxlJyBtYXkgYmUgc3BlY2lmaWVkIG9uIHRoZSBlbGVtZW50XG4vLyAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7aTxmaWxlcy5sZW5ndGg7aSsrKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIC8vZW1pdCBldmVudCB1cHdhcmRcbi8vICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGVtaXQoXCJmaWxlU2VsZWN0ZWRcIiwgeyBmaWxlOiBmaWxlc1tpXSB9KTtcbi8vICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuLy8gICAgIH07XG4vLyB9KTtcbi8vIG1vZGVsLmRpcmVjdGl2ZShcImZpbGVzSW5wdXRcIiwgZnVuY3Rpb24oKSB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgcmVxdWlyZTogXCJuZ01vZGVsXCIsXG4vLyAgICAgbGluazogZnVuY3Rpb24gcG9zdExpbmsoc2NvcGUsZWxlbSxhdHRycyxuZ01vZGVsKSB7XG4vLyAgICAgICBlbGVtLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcbi8vICAgICAgICAgdmFyIGltZyA9IGVsZW1bMF0uZmlsZXM7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKG5nTW9kZWwuJHNldFZpZXdWYWx1ZShpbWcpKTtcbi8vICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGltZyk7XG4vLyAgICAgICB9KVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfSk7XG4vLyBtb2RlbC5kaXJlY3RpdmUoJ2ZpbGVJbnB1dCcsIFsnJHBhcnNlJywgZnVuY3Rpb24gKCRwYXJzZSkge1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4vLyAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuLy8gICAgICAgICAgICAgZWxlbWVudC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgICAgICAgJHBhcnNlKGF0dHJpYnV0ZXMuZmlsZUlucHV0KVxuLy8gICAgICAgICAgICAgICAgIC5hc3NpZ24oc2NvcGUsZWxlbWVudFswXS5maWxlcylcbi8vICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKVxuLy8gICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cbi8vICAgICB9O1xuLy8gfV0pO1xuLy8gbW9kZWwuZGlyZWN0aXZlKFwiZmlsZXJlYWRcIiwgW2Z1bmN0aW9uICgpIHtcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgICBzY29wZToge1xuLy8gICAgICAgICAgICAgZmlsZXJlYWQ6IFwiPVwiXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuLy8gICAgICAgICAgICAgZWxlbWVudC5iaW5kKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChjaGFuZ2VFdmVudCkge1xuLy8gICAgICAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuLy8gICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAobG9hZEV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5maWxlcmVhZCA9IGxvYWRFdmVudC50YXJnZXQucmVzdWx0O1xuLy8gICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoY2hhbmdlRXZlbnQudGFyZ2V0LmZpbGVzWzBdKTtcbi8vICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG4vLyAgICAgfVxuLy8gfV0pO1xuLy8gbW9kZWwuZGlyZWN0aXZlKCdiaW5kRmlsZScsIFtmdW5jdGlvbiAoKSB7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgcmVxdWlyZTogXCJuZ01vZGVsXCIsXG4vLyAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4vLyAgICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsLCBhdHRycywgbmdNb2RlbCkge1xuLy8gICAgICAgICAgICAgZWwuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGV2ZW50LnRhcmdldC5maWxlc1swXSk7XG4vLyAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuLy8gICAgICAgICAgICAgfSk7XG5cbi8vICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgIHJldHVybiBuZ01vZGVsLiR2aWV3VmFsdWU7XG4vLyAgICAgICAgICAgICB9LCBmdW5jdGlvbiAodmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIGVsLnZhbChcIlwiKTtcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuLy8gICAgIH07XG4vLyB9XSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdTZXJ2aWNlcycsIFtdKVxuLmZhY3RvcnkoJ1NlcnZpY2VzJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICByZXR1cm4geyBcbiAgICAgICAgTG9hZDogZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlX3VybCArJy9hcGkvdjEvc2VydmljZXM/bm9tYnJlPScrcSsnJnBlcl9wYWdlPScrcCsnJnBhZ2U9JytwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBTZWU6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzLycraWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBFZGl0OiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9zZXJ2aWNlcy8nK2lkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgXG4gICAgICAgIFVwZGF0ZTogZnVuY3Rpb24oaWQsZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2VfdXJsICsnL2FwaS92MS9zZXJ2aWNlcy8nK2lkLGRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBDcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzJyxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgRGVsZXRlOiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGJhc2VfdXJsICsnL2FwaS92MS9zZXJ2aWNlcy8nK2lkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBcbiAgICB9O1xufSk7IFxufSkoKTsiXX0=
