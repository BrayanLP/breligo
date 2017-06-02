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