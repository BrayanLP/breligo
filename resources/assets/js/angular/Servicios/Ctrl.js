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