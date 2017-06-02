(function () {
'use strict';
var model = angular.module('model', 
    ['Services' ]);

var seletedValue = 15;

model.controller('Ctrl', 
    ['$scope',
    '$http',
    '$timeout',
    'Services', 
    function(
        $scope,
        $http,
        $timeout,
        Services)
{  
    var html = function(id) { 
        return document.getElementById(id); 
    };

    $scope.temp = [];
    $scope.cant_rows = "10";
    
    $scope.load = function(q,p,page){
        if(q == undefined){ 
            q = "";
        }   
        Services.Load(q,p,page).then(function (response) {
            $scope.data_load = response.data; 
            $scope.temp.push($scope.data_load);  
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

    $scope.array = ['cant_rows','search_text'];
    $scope.$watchGroup($scope.array, function(n){
        console.log(n);
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
            $scope.edit_copia.n = response.nombre;
            $scope.edit_copia.d = response.descripcion; 
        }, function (response) {
        });
    };
    $scope.create = function(){
        $scope.edit_copia = {};
        var store;
        store =
        {
            nombre:$scope.create.nombre,
            descripcion:$scope.create.descripcion
        }
        Services.Create(store).then(function (response) {
            console.log(response);
            $('#create').modal('hide');
            $scope.init();
        }, function (response) {
        });
    };
    $scope.update = function(id){
        $scope.edit_copia = {};
        var update;
        update =
        {
            nombre:$scope.edit.nombre,
            descripcion:$scope.edit.descripcion
        }
        Services.Update(id,update).then(function (response) {
            console.log(response);
            $('#edit').modal('hide');
            $scope.init();
        }, function (response) {
        });
    };
    $scope.delete = function(id){ 
        Services.Delete(id).then(function (response) {
            console.log(response);
            $scope.init();
        }, function (response) {
        });
    };  
    // $scope.show_panel = true;
    // $scope.show_detalle = false;
    // var map;
    // var infoWindow = null;

    // function closeInfoWindow(){
    //     infoWindow.close();
    // }
     

    // $scope.Map = function() {
    //     map = new google.maps.Map(document.getElementById('mapa'), {
    //         center: {lat: -12.046629, lng: -77.0214337},
    //         zoom: 11
    //     });
        
    // }



    // $scope.initMap = function() {
    //     $scope.Map();
    //     $scope.setMarkers(map);
    //     // $scope.infoWindow = new google.maps.InfoWindow();
    //     // google.maps.event.addListener(map, 'click', $scope.closeInfoWindow());

    //     // var infoWindow = new google.maps.InfoWindow({map: map});

    //     // Try HTML5 geolocation.
    //     // $scope.location();
        
    // }
    // $scope.location = function(){
    //     $scope.initMap();
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(function(position) {
    //             $scope.posicion_actual = {
    //               lat: position.coords.latitude,
    //               lng: position.coords.longitude
    //             };
    //             var image = {
    //                 url: '/assets/app/images/position_actual.png', 
    //                 size: new google.maps.Size(50, 50), 
    //                 origin: new google.maps.Point(0, 0), 
    //                 anchor: new google.maps.Point(0, 40)
    //             }; 
    //             var marker = new google.maps.Marker({
    //                 position: $scope.posicion_actual,
    //                 map: map,
    //                 icon: image,
    //                 zoom: 11
    //             });
    //             // infoWindow.setPosition(pos);
    //             // infoWindow.setContent('Location found.');
    //             map.setCenter($scope.posicion_actual);
    //         }, function() {
    //             $scope.handleLocationError(true, infoWindow, map.getCenter());
    //         });
    //     } else {
    //         // Browser doesn't support Geolocation
    //         $scope.handleLocationError(false, infoWindow, map.getCenter());

    //     }
    // }

    // $scope.handleLocationError= function(browserHasGeolocation, infoWindow, pos) {
    //     // infoWindow.setPosition(pos);
    //     // infoWindow.setContent(browserHasGeolocation ?
    //         // 'Error: El servicio de Geolocalizacion Falló.' :
    //         // 'Error: Your browser doesn\'t support geolocation.');
    // } 

    // $scope.setMarkers = function(map) { 
    //     var image = { 
    //         url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png', 
    //         size: new google.maps.Size(20, 32), 
    //         origin: new google.maps.Point(0, 0), 
    //         anchor: new google.maps.Point(0, 0)
    //     };  
    //     // var infoWindow = new google.maps.InfoWindow({map: map});
    //     // console.log($scope.data_load.length);
    //     for (var i = 0; i < $scope.data_load.length; i++) { 
    //         var beach = $scope.data_load[i];
    //         var pos = {
    //           lat: parseFloat(beach.lat),
    //           lng: parseFloat(beach.lng)
    //         }; 
    //         var marker = new google.maps.Marker({
    //             position: pos,
    //             map: map,
    //             animation: google.maps.Animation.DROP, 
    //             draggable: false,
    //             icon: image

    //         });
    //         // console.log(marker);
    //         // $scope.markers_hover(marker);
    //     }
    // }
    // infoWindow = new google.maps.InfoWindow(); 
    // $scope.markers_hover = function(lat, lng,foto,titulo,direccion,data){ 
    //     var pos = {};
    //     pos.lat = parseFloat(lat);
    //     pos.lng = parseFloat(lng); 
    //     infoWindow.close();
    //     infoWindow = new google.maps.InfoWindow({map: map,maxWidth: 200});
    //     infoWindow.setPosition(pos); 
    //     infoWindow.setContent(
    //         [
    //             '<div class="center globo_ubicacion">', 
    //             '<img width="100%" src="'+foto+'">',
    //             '<h6>'+titulo+'</h6>', 
    //             '<p>'+direccion+'</p>',
    //             '<a href="#!" ng-click="show_marker('+data+')" class="btn pull-right">Ver</a>',
    //             '</div>'
    //         ].join('')
    //     );
    //     map.setCenter(new google.maps.LatLng(pos));
    //     map.setZoom(15);    
    //     $scope.set_google_maps();
        
        
    //     // console.log(lat,lng)
    // } 
    // $scope.set_google_maps = function(){
    //     var iwOuter = $('.gm-style-iw');
    //     var iwCloseBtn = iwOuter.next();
    //     var iwBackground = iwOuter.prev(); 
    //     iwBackground.children(':nth-child(2)').css({'display' : 'none'}); 
    //     iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    //     iwOuter.parent().parent().css({left: '40px'});
    //     iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
    //     iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
    //     iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 0, 0, 0) 0px 1px 6px', 'z-index' : '1'});
    //     iwBackground.children(':nth-child(3)').children(':nth-child(1)').find('div').attr('style', function(i,s){ return s + 'height: 21px !important;'+'width: 10px !important;'+'left:7px !important;'});
    //     iwBackground.children(':nth-child(3)').children(':nth-child(2)').find('div').attr('style', function(i,s){ return s + 'height: 25px !important;'+'width: 9px !important;'});
    //     iwCloseBtn.css({'display': 'none'});
    // }
    // $scope.show_marker = function(data){
    //     $scope.show_detalle = true;
    //     console.log(data);
    //     $scope.detalle = data;
    //     $scope.show_panel = false;
    // }
    // $scope.return = function(){
    //     $scope.show_detalle = false; 
    //     $scope.show_panel = true;
    // }
 
}]);
})();
(function () {
'use strict';
angular.module('Services', [])
.factory('Services', function($http) {
    return { 
        Load: function(q,p,page){
            return $http.get(base_url +'/api/v1/locations?nombre='+q+'&per_page='+p+'&page='+page).then(function (response){  
                return response.data;
            });
        },
        See: function(id){
            return $http.get(base_url +'/api/v1/locations/'+id).then(function (response){
                return response.data;
            });
        },
        Edit: function(id){
            return $http.get(base_url +'/api/v1/locations/'+id).then(function (response){
                return response.data;
            });
        }, 
        Update: function(id,data){
            return $http.put(base_url +'/api/v1/locations/'+id,data).then(function (response){
                return response.data;
            });
        },
        Create: function(data){
            return $http.post(base_url +'/api/v1/locations',data).then(function (response){
                return response.data;
            });
        },
        Delete: function(id){
            return $http.delete(base_url +'/api/v1/locations/'+id).then(function (response){
                return response.data;
            });
        } 
    };
}); 
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJVYmljYWNpb25lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4ndXNlIHN0cmljdCc7XG52YXIgbW9kZWwgPSBhbmd1bGFyLm1vZHVsZSgnbW9kZWwnLCBcbiAgICBbJ1NlcnZpY2VzJyBdKTtcblxudmFyIHNlbGV0ZWRWYWx1ZSA9IDE1O1xuXG5tb2RlbC5jb250cm9sbGVyKCdDdHJsJywgXG4gICAgWyckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnU2VydmljZXMnLCBcbiAgICBmdW5jdGlvbihcbiAgICAgICAgJHNjb3BlLFxuICAgICAgICAkaHR0cCxcbiAgICAgICAgJHRpbWVvdXQsXG4gICAgICAgIFNlcnZpY2VzKVxueyAgXG4gICAgdmFyIGh0bWwgPSBmdW5jdGlvbihpZCkgeyBcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTsgXG4gICAgfTtcblxuICAgICRzY29wZS50ZW1wID0gW107XG4gICAgJHNjb3BlLmNhbnRfcm93cyA9IFwiMTBcIjtcbiAgICBcbiAgICAkc2NvcGUubG9hZCA9IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgaWYocSA9PSB1bmRlZmluZWQpeyBcbiAgICAgICAgICAgIHEgPSBcIlwiO1xuICAgICAgICB9ICAgXG4gICAgICAgIFNlcnZpY2VzLkxvYWQocSxwLHBhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YV9sb2FkID0gcmVzcG9uc2UuZGF0YTsgXG4gICAgICAgICAgICAkc2NvcGUudGVtcC5wdXNoKCRzY29wZS5kYXRhX2xvYWQpOyAgXG4gICAgICAgICAgICAkc2NvcGUudG8gPSByZXNwb25zZS50bzsgXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSByZXNwb25zZS50b3RhbDtcbiAgICAgICAgICAgICRzY29wZS5sYXN0X3BhZ2UgPSByZXNwb25zZS5sYXN0X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudF9wYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSByZXNwb25zZS5uZXh0X3BhZ2VfdXJsO1xuICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSByZXNwb25zZS5wcmV2X3BhZ2VfdXJsOyBcbiAgICAgICAgICAgIGlmKCRzY29wZS5wcmV2X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSAkc2NvcGUucHJldl9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigkc2NvcGUubmV4dF9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gJHNjb3BlLm5leHRfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTsgXG4gICAgfSBcblxuICAgICRzY29wZS5hcnJheSA9IFsnY2FudF9yb3dzJywnc2VhcmNoX3RleHQnXTtcbiAgICAkc2NvcGUuJHdhdGNoR3JvdXAoJHNjb3BlLmFycmF5LCBmdW5jdGlvbihuKXtcbiAgICAgICAgY29uc29sZS5sb2cobik7XG4gICAgICAgIGlmKG4gIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICRzY29wZS5sb2FkKCRzY29wZS5zZWFyY2hfdGV4dCwkc2NvcGUuY2FudF9yb3dzLDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICAkc2NvcGUubG9hZCgnJywkc2NvcGUuY2FudF9yb3dzLDEpO1xuICAgICAgICB9XG4gICAgfSk7IFxuICAgIFxuICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmxvYWQoJycsJHNjb3BlLmNhbnRfcm93cywxKTtcbiAgICB9ICBcbiBcbiAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgJHNjb3BlLmVkaXRfY29waWEgPSB7fTtcbiAgICAgICAgU2VydmljZXMuRWRpdChpZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5lZGl0ID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdF9jb3BpYS5uID0gcmVzcG9uc2Uubm9tYnJlO1xuICAgICAgICAgICAgJHNjb3BlLmVkaXRfY29waWEuZCA9IHJlc3BvbnNlLmRlc2NyaXBjaW9uOyBcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5lZGl0X2NvcGlhID0ge307XG4gICAgICAgIHZhciBzdG9yZTtcbiAgICAgICAgc3RvcmUgPVxuICAgICAgICB7XG4gICAgICAgICAgICBub21icmU6JHNjb3BlLmNyZWF0ZS5ub21icmUsXG4gICAgICAgICAgICBkZXNjcmlwY2lvbjokc2NvcGUuY3JlYXRlLmRlc2NyaXBjaW9uXG4gICAgICAgIH1cbiAgICAgICAgU2VydmljZXMuQ3JlYXRlKHN0b3JlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgJCgnI2NyZWF0ZScpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAkc2NvcGUuZWRpdF9jb3BpYSA9IHt9O1xuICAgICAgICB2YXIgdXBkYXRlO1xuICAgICAgICB1cGRhdGUgPVxuICAgICAgICB7XG4gICAgICAgICAgICBub21icmU6JHNjb3BlLmVkaXQubm9tYnJlLFxuICAgICAgICAgICAgZGVzY3JpcGNpb246JHNjb3BlLmVkaXQuZGVzY3JpcGNpb25cbiAgICAgICAgfVxuICAgICAgICBTZXJ2aWNlcy5VcGRhdGUoaWQsdXBkYXRlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgJCgnI2VkaXQnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgJHNjb3BlLmluaXQoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKXsgXG4gICAgICAgIFNlcnZpY2VzLkRlbGV0ZShpZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICRzY29wZS5pbml0KCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTtcbiAgICB9OyAgXG4gICAgLy8gJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlO1xuICAgIC8vICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTtcbiAgICAvLyB2YXIgbWFwO1xuICAgIC8vIHZhciBpbmZvV2luZG93ID0gbnVsbDtcblxuICAgIC8vIGZ1bmN0aW9uIGNsb3NlSW5mb1dpbmRvdygpe1xuICAgIC8vICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgLy8gfVxuICAgICBcblxuICAgIC8vICRzY29wZS5NYXAgPSBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwYScpLCB7XG4gICAgLy8gICAgICAgICBjZW50ZXI6IHtsYXQ6IC0xMi4wNDY2MjksIGxuZzogLTc3LjAyMTQzMzd9LFxuICAgIC8vICAgICAgICAgem9vbTogMTFcbiAgICAvLyAgICAgfSk7XG4gICAgICAgIFxuICAgIC8vIH1cblxuXG5cbiAgICAvLyAkc2NvcGUuaW5pdE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAkc2NvcGUuTWFwKCk7XG4gICAgLy8gICAgICRzY29wZS5zZXRNYXJrZXJzKG1hcCk7XG4gICAgLy8gICAgIC8vICRzY29wZS5pbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcbiAgICAvLyAgICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAkc2NvcGUuY2xvc2VJbmZvV2luZG93KCkpO1xuXG4gICAgLy8gICAgIC8vIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe21hcDogbWFwfSk7XG5cbiAgICAvLyAgICAgLy8gVHJ5IEhUTUw1IGdlb2xvY2F0aW9uLlxuICAgIC8vICAgICAvLyAkc2NvcGUubG9jYXRpb24oKTtcbiAgICAgICAgXG4gICAgLy8gfVxuICAgIC8vICRzY29wZS5sb2NhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgICRzY29wZS5pbml0TWFwKCk7XG4gICAgLy8gICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAvLyAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHtcbiAgICAvLyAgICAgICAgICAgICAkc2NvcGUucG9zaWNpb25fYWN0dWFsID0ge1xuICAgIC8vICAgICAgICAgICAgICAgbGF0OiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgLy8gICAgICAgICAgICAgICBsbmc6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVcbiAgICAvLyAgICAgICAgICAgICB9O1xuICAgIC8vICAgICAgICAgICAgIHZhciBpbWFnZSA9IHtcbiAgICAvLyAgICAgICAgICAgICAgICAgdXJsOiAnL2Fzc2V0cy9hcHAvaW1hZ2VzL3Bvc2l0aW9uX2FjdHVhbC5wbmcnLCBcbiAgICAvLyAgICAgICAgICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNTAsIDUwKSwgXG4gICAgLy8gICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAvLyAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgNDApXG4gICAgLy8gICAgICAgICAgICAgfTsgXG4gICAgLy8gICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgIC8vICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCxcbiAgICAvLyAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgLy8gICAgICAgICAgICAgICAgIGljb246IGltYWdlLFxuICAgIC8vICAgICAgICAgICAgICAgICB6b29tOiAxMVxuICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgICAgIC8vIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAvLyAgICAgICAgICAgICAvLyBpbmZvV2luZG93LnNldENvbnRlbnQoJ0xvY2F0aW9uIGZvdW5kLicpO1xuICAgIC8vICAgICAgICAgICAgIG1hcC5zZXRDZW50ZXIoJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCk7XG4gICAgLy8gICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcih0cnVlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAvLyBCcm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBHZW9sb2NhdGlvblxuICAgIC8vICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IoZmFsc2UsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG5cbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIC8vICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yPSBmdW5jdGlvbihicm93c2VySGFzR2VvbG9jYXRpb24sIGluZm9XaW5kb3csIHBvcykge1xuICAgIC8vICAgICAvLyBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7XG4gICAgLy8gICAgIC8vIGluZm9XaW5kb3cuc2V0Q29udGVudChicm93c2VySGFzR2VvbG9jYXRpb24gP1xuICAgIC8vICAgICAgICAgLy8gJ0Vycm9yOiBFbCBzZXJ2aWNpbyBkZSBHZW9sb2NhbGl6YWNpb24gRmFsbMOzLicgOlxuICAgIC8vICAgICAgICAgLy8gJ0Vycm9yOiBZb3VyIGJyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgZ2VvbG9jYXRpb24uJyk7XG4gICAgLy8gfSBcblxuICAgIC8vICRzY29wZS5zZXRNYXJrZXJzID0gZnVuY3Rpb24obWFwKSB7IFxuICAgIC8vICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgIC8vICAgICAgICAgdXJsOiAnaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvZXhhbXBsZXMvZnVsbC9pbWFnZXMvYmVhY2hmbGFnLnBuZycsIFxuICAgIC8vICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDMyKSwgXG4gICAgLy8gICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgLy8gICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKVxuICAgIC8vICAgICB9OyAgXG4gICAgLy8gICAgIC8vIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe21hcDogbWFwfSk7XG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWQubGVuZ3RoKTtcbiAgICAvLyAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZGF0YV9sb2FkLmxlbmd0aDsgaSsrKSB7IFxuICAgIC8vICAgICAgICAgdmFyIGJlYWNoID0gJHNjb3BlLmRhdGFfbG9hZFtpXTtcbiAgICAvLyAgICAgICAgIHZhciBwb3MgPSB7XG4gICAgLy8gICAgICAgICAgIGxhdDogcGFyc2VGbG9hdChiZWFjaC5sYXQpLFxuICAgIC8vICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQoYmVhY2gubG5nKVxuICAgIC8vICAgICAgICAgfTsgXG4gICAgLy8gICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgLy8gICAgICAgICAgICAgcG9zaXRpb246IHBvcyxcbiAgICAvLyAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAvLyAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLCBcbiAgICAvLyAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxuICAgIC8vICAgICAgICAgICAgIGljb246IGltYWdlXG5cbiAgICAvLyAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cobWFya2VyKTtcbiAgICAvLyAgICAgICAgIC8vICRzY29wZS5tYXJrZXJzX2hvdmVyKG1hcmtlcik7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG4gICAgLy8gaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7IFxuICAgIC8vICRzY29wZS5tYXJrZXJzX2hvdmVyID0gZnVuY3Rpb24obGF0LCBsbmcsZm90byx0aXR1bG8sZGlyZWNjaW9uLGRhdGEpeyBcbiAgICAvLyAgICAgdmFyIHBvcyA9IHt9O1xuICAgIC8vICAgICBwb3MubGF0ID0gcGFyc2VGbG9hdChsYXQpO1xuICAgIC8vICAgICBwb3MubG5nID0gcGFyc2VGbG9hdChsbmcpOyBcbiAgICAvLyAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgIC8vICAgICBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe21hcDogbWFwLG1heFdpZHRoOiAyMDB9KTtcbiAgICAvLyAgICAgaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpOyBcbiAgICAvLyAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgIC8vICAgICAgICAgW1xuICAgIC8vICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2VudGVyIGdsb2JvX3ViaWNhY2lvblwiPicsIFxuICAgIC8vICAgICAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrZm90bysnXCI+JyxcbiAgICAvLyAgICAgICAgICAgICAnPGg2PicrdGl0dWxvKyc8L2g2PicsIFxuICAgIC8vICAgICAgICAgICAgICc8cD4nK2RpcmVjY2lvbisnPC9wPicsXG4gICAgLy8gICAgICAgICAgICAgJzxhIGhyZWY9XCIjIVwiIG5nLWNsaWNrPVwic2hvd19tYXJrZXIoJytkYXRhKycpXCIgY2xhc3M9XCJidG4gcHVsbC1yaWdodFwiPlZlcjwvYT4nLFxuICAgIC8vICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgLy8gICAgICAgICBdLmpvaW4oJycpXG4gICAgLy8gICAgICk7XG4gICAgLy8gICAgIG1hcC5zZXRDZW50ZXIobmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3MpKTtcbiAgICAvLyAgICAgbWFwLnNldFpvb20oMTUpOyAgICBcbiAgICAvLyAgICAgJHNjb3BlLnNldF9nb29nbGVfbWFwcygpO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKGxhdCxsbmcpXG4gICAgLy8gfSBcbiAgICAvLyAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgdmFyIGl3T3V0ZXIgPSAkKCcuZ20tc3R5bGUtaXcnKTtcbiAgICAvLyAgICAgdmFyIGl3Q2xvc2VCdG4gPSBpd091dGVyLm5leHQoKTtcbiAgICAvLyAgICAgdmFyIGl3QmFja2dyb3VuZCA9IGl3T3V0ZXIucHJldigpOyBcbiAgICAvLyAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTsgXG4gICAgLy8gICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCg0KScpLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSk7XG4gICAgLy8gICAgIGl3T3V0ZXIucGFyZW50KCkucGFyZW50KCkuY3NzKHtsZWZ0OiAnNDBweCd9KTtcbiAgICAvLyAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdsZWZ0OiA4NHB4ICFpbXBvcnRhbnQ7J30pO1xuICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDg0cHggIWltcG9ydGFudDsnfSk7XG4gICAgLy8gICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmZpbmQoJ2RpdicpLmNoaWxkcmVuKCkuY3NzKHsnYm94LXNoYWRvdyc6ICdyZ2JhKDAsIDAsIDAsIDApIDBweCAxcHggNnB4JywgJ3otaW5kZXgnIDogJzEnfSk7XG4gICAgLy8gICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDIxcHggIWltcG9ydGFudDsnKyd3aWR0aDogMTBweCAhaW1wb3J0YW50OycrJ2xlZnQ6N3B4ICFpbXBvcnRhbnQ7J30pO1xuICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpLmZpbmQoJ2RpdicpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnaGVpZ2h0OiAyNXB4ICFpbXBvcnRhbnQ7Jysnd2lkdGg6IDlweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAvLyAgICAgaXdDbG9zZUJ0bi5jc3MoeydkaXNwbGF5JzogJ25vbmUnfSk7XG4gICAgLy8gfVxuICAgIC8vICRzY29wZS5zaG93X21hcmtlciA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gdHJ1ZTtcbiAgICAvLyAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgLy8gICAgICRzY29wZS5kZXRhbGxlID0gZGF0YTtcbiAgICAvLyAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSBmYWxzZTtcbiAgICAvLyB9XG4gICAgLy8gJHNjb3BlLnJldHVybiA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTsgXG4gICAgLy8gICAgICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTtcbiAgICAvLyB9XG4gXG59XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4ndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnU2VydmljZXMnLCBbXSlcbi5mYWN0b3J5KCdTZXJ2aWNlcycsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgcmV0dXJuIHsgXG4gICAgICAgIExvYWQ6IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucz9ub21icmU9JytxKycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIFNlZTogZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zLycraWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBFZGl0OiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIFxuICAgICAgICBVcGRhdGU6IGZ1bmN0aW9uKGlkLGRhdGEpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zLycraWQsZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIENyZWF0ZTogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zJyxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgRGVsZXRlOiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gXG4gICAgfTtcbn0pOyBcbn0pKCk7Il19
