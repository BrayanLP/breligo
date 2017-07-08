(function () {
'use strict';
var model = angular.module('model', 
    ['Services',"angular-uuid"]);

var seletedValue = 15;

model.controller('Ctrl', 
    [
    '$scope',
    '$http',
    '$timeout',
    'Services',
    'uuid',  
    function( 
        $scope,
        $http,
        $timeout,
        Services,
        uuid
        )
{  
    var html = function(id) { 
        return document.getElementById(id); 
    };

    $scope.temp = [];
    $scope.cant_rows = "10";
    // var hash = uuid.v4();
    // console.log(hash);
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
        // console.log(n);
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
    $scope.guardar = function (data){  
        Services.Create(data).then(function (response) {
            console.log(response);
            // $scope.init();
        }, function (response) {
        });
    };
    $scope.create_bomberos = function(){
        Services.load_bomberos().then(function (response) {
            console.log(response);
            $scope.temp_data = [];
            $scope.results = response; 
            angular.forEach($scope.results, function(value){
                var obj = {
                    nombre_temp : "Bomberos "+value.nombre,
                    id_image : uuid.v4(),
                    nombre_empresa : value.nombre,
                    direccion: value.direccion,
                    horario: 'Las 24 horas',
                    telefono_1: value.telefonos, 
                    correo: value.correo, 
                    lat: value.Lat,
                    lng: value.Long, 
                    id_services: 4,
                    url: value.link_web

                }
                $scope.temp_data.push(obj);
                $scope.guardar(obj);
                
            }) 
            console.log($scope.temp_data);
            // $scope.temp.push($scope.data_load);  
        }, function (response) {
        });
    }
    

    $scope.cargar_agentes = function(){
        Services.load_agentes().then(function (response) {
            // console.log(response);
            $scope.temp_data = [];
            $scope.results = response.data; 
            angular.forEach($scope.results, function(value){
                var foto = 'https://maps.googleapis.com/maps/api/streetview?size=606x400&location='+value._lat+','+value._lng+'&pitch=-0.76&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE';
                var obj = {
                    nombre_temp : "Agentes Agente Banco de la Nación - "+value._establecimiento,
                    id_image : uuid.v4(),
                    nombre_empresa : value._establecimiento,
                    direccion: value._dir,
                    horario: 'Sujeto a horario del local',
                    telefono_1: '', 
                    foto: foto,
                    correo: value.correo, 
                    lat: value._lat,
                    lng: value._lng, 
                    id_services: 1,
                    url: value.link_web

                }
                $scope.temp_data.push(obj);
                // $scope.guardar(obj);
                
            }) 
            console.log($scope.temp_data);
            // $scope.temp.push($scope.data_load);  
        }, function (response) {
        });
    } 
    // $scope.cargar_agentes();

    $scope.banco = function(){
        Services.banco().then(function (response) {
            console.log(response.data);
        });
    }
    $scope.agentes = function(){
        Services.agentes().then(function (response) {
            console.log(response.data);
        });
    }
    $scope.cajero = function(){
        Services.cajero().then(function (response) {
            console.log(response);
        });
    }


    // function geocodeResult(results, status) { 
    //     if (status == 'OK') {    
    //         var markerOptions = results[0].geometry.location;
    //     } else {
    //         // En caso de no haber resultados o que haya ocurrido un error
    //         // lanzamos un mensaje con el error
    //         alert("Geocoding no tuvo éxito debido a: " + status);
    //     }
    // }
    // $scope.cajero();
    // $scope.create_bomberos();
 
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
        } ,
        load_bomberos: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/225000').then(function (response){  
                console.log(response.data);
                return response.data;
            });
        },
        // agencia: function(){
        //     return $http.get('http://www.bn.com.pe/canales-atencion/base-datos/agencias.asp').then(function (response){  
        //         // console.log(response);
        //         return response;
        //     });
        // },
        cajero: function(){
            return $http.get('http://www.bn.com.pe/canales-atencion/base-datos/cajeros.asp').then(function (response){  
                console.log(response);
                return response;
            });
        }

        // , 
        // agentes: function(){
        //     return $http.get('http://www.bn.com.pe/canales-atencion/base-datos/agentes.asp').then(function (response){  
        //         // console.log(response);
        //         return response;
        //     });
        // }
        ,
        load_hospitales: function(){
            return $http.get('http://grupoaizen.com/hospitales.json').then(function (response){  
                console.log(response);
                return response;
            });
        },
        load_agentes: function(){
            return $http.get('http://grupoaizen.com/banco_nacion_agentes.json').then(function (response){  
                console.log(response);
                return response;
            });
        }
        
        
        
        
    };
}); 
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJVYmljYWNpb25lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4ndXNlIHN0cmljdCc7XG52YXIgbW9kZWwgPSBhbmd1bGFyLm1vZHVsZSgnbW9kZWwnLCBcbiAgICBbJ1NlcnZpY2VzJyxcImFuZ3VsYXItdXVpZFwiXSk7XG5cbnZhciBzZWxldGVkVmFsdWUgPSAxNTtcblxubW9kZWwuY29udHJvbGxlcignQ3RybCcsIFxuICAgIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGh0dHAnLFxuICAgICckdGltZW91dCcsXG4gICAgJ1NlcnZpY2VzJyxcbiAgICAndXVpZCcsICBcbiAgICBmdW5jdGlvbiggXG4gICAgICAgICRzY29wZSxcbiAgICAgICAgJGh0dHAsXG4gICAgICAgICR0aW1lb3V0LFxuICAgICAgICBTZXJ2aWNlcyxcbiAgICAgICAgdXVpZFxuICAgICAgICApXG57ICBcbiAgICB2YXIgaHRtbCA9IGZ1bmN0aW9uKGlkKSB7IFxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnRlbXAgPSBbXTtcbiAgICAkc2NvcGUuY2FudF9yb3dzID0gXCIxMFwiO1xuICAgIC8vIHZhciBoYXNoID0gdXVpZC52NCgpO1xuICAgIC8vIGNvbnNvbGUubG9nKGhhc2gpO1xuICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICBpZihxID09IHVuZGVmaW5lZCl7IFxuICAgICAgICAgICAgcSA9IFwiXCI7XG4gICAgICAgIH0gICBcbiAgICAgICAgU2VydmljZXMuTG9hZChxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWQgPSByZXNwb25zZS5kYXRhOyBcbiAgICAgICAgICAgICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7ICBcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICBcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pOyBcbiAgICB9IFxuXG4gICAgJHNjb3BlLmFycmF5ID0gWydjYW50X3Jvd3MnLCdzZWFyY2hfdGV4dCddO1xuICAgICRzY29wZS4kd2F0Y2hHcm91cCgkc2NvcGUuYXJyYXksIGZ1bmN0aW9uKG4pe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhuKTtcbiAgICAgICAgaWYobiAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgJHNjb3BlLmxvYWQoJHNjb3BlLnNlYXJjaF90ZXh0LCRzY29wZS5jYW50X3Jvd3MsMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICRzY29wZS5sb2FkKCcnLCRzY29wZS5jYW50X3Jvd3MsMSk7XG4gICAgICAgIH1cbiAgICB9KTsgXG4gICAgXG4gICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubG9hZCgnJywkc2NvcGUuY2FudF9yb3dzLDEpO1xuICAgIH0gIFxuIFxuICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAkc2NvcGUuZWRpdF9jb3BpYSA9IHt9O1xuICAgICAgICBTZXJ2aWNlcy5FZGl0KGlkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmVkaXQgPSByZXNwb25zZTtcbiAgICAgICAgICAgICRzY29wZS5lZGl0X2NvcGlhLm4gPSByZXNwb25zZS5ub21icmU7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdF9jb3BpYS5kID0gcmVzcG9uc2UuZGVzY3JpcGNpb247IFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmVkaXRfY29waWEgPSB7fTtcbiAgICAgICAgdmFyIHN0b3JlO1xuICAgICAgICBzdG9yZSA9XG4gICAgICAgIHtcbiAgICAgICAgICAgIG5vbWJyZTokc2NvcGUuY3JlYXRlLm5vbWJyZSxcbiAgICAgICAgICAgIGRlc2NyaXBjaW9uOiRzY29wZS5jcmVhdGUuZGVzY3JpcGNpb25cbiAgICAgICAgfVxuICAgICAgICBTZXJ2aWNlcy5DcmVhdGUoc3RvcmUpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAkKCcjY3JlYXRlJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICRzY29wZS5pbml0KCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihpZCl7XG4gICAgICAgICRzY29wZS5lZGl0X2NvcGlhID0ge307XG4gICAgICAgIHZhciB1cGRhdGU7XG4gICAgICAgIHVwZGF0ZSA9XG4gICAgICAgIHtcbiAgICAgICAgICAgIG5vbWJyZTokc2NvcGUuZWRpdC5ub21icmUsXG4gICAgICAgICAgICBkZXNjcmlwY2lvbjokc2NvcGUuZWRpdC5kZXNjcmlwY2lvblxuICAgICAgICB9XG4gICAgICAgIFNlcnZpY2VzLlVwZGF0ZShpZCx1cGRhdGUpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAkKCcjZWRpdCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oaWQpeyBcbiAgICAgICAgU2VydmljZXMuRGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgJHNjb3BlLmluaXQoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH07ICBcbiAgICAvLyAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7XG4gICAgLy8gJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlO1xuICAgIC8vIHZhciBtYXA7XG4gICAgLy8gdmFyIGluZm9XaW5kb3cgPSBudWxsO1xuXG4gICAgLy8gZnVuY3Rpb24gY2xvc2VJbmZvV2luZG93KCl7XG4gICAgLy8gICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICAvLyB9XG4gICAgIFxuXG4gICAgLy8gJHNjb3BlLk1hcCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBhJyksIHtcbiAgICAvLyAgICAgICAgIGNlbnRlcjoge2xhdDogLTEyLjA0NjYyOSwgbG5nOiAtNzcuMDIxNDMzN30sXG4gICAgLy8gICAgICAgICB6b29tOiAxMVxuICAgIC8vICAgICB9KTtcbiAgICAgICAgXG4gICAgLy8gfVxuXG5cblxuICAgIC8vICRzY29wZS5pbml0TWFwID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICRzY29wZS5NYXAoKTtcbiAgICAvLyAgICAgJHNjb3BlLnNldE1hcmtlcnMobWFwKTtcbiAgICAvLyAgICAgLy8gJHNjb3BlLmluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpO1xuICAgIC8vICAgICAvLyBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdjbGljaycsICRzY29wZS5jbG9zZUluZm9XaW5kb3coKSk7XG5cbiAgICAvLyAgICAgLy8gdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXB9KTtcblxuICAgIC8vICAgICAvLyBUcnkgSFRNTDUgZ2VvbG9jYXRpb24uXG4gICAgLy8gICAgIC8vICRzY29wZS5sb2NhdGlvbigpO1xuICAgICAgICBcbiAgICAvLyB9XG4gICAgLy8gJHNjb3BlLmxvY2F0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgJHNjb3BlLmluaXRNYXAoKTtcbiAgICAvLyAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgIC8vICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbikge1xuICAgIC8vICAgICAgICAgICAgICRzY29wZS5wb3NpY2lvbl9hY3R1YWwgPSB7XG4gICAgLy8gICAgICAgICAgICAgICBsYXQ6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAvLyAgICAgICAgICAgICAgIGxuZzogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZVxuICAgIC8vICAgICAgICAgICAgIH07XG4gICAgLy8gICAgICAgICAgICAgdmFyIGltYWdlID0ge1xuICAgIC8vICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsIFxuICAgIC8vICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg1MCwgNTApLCBcbiAgICAvLyAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgIC8vICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCA0MClcbiAgICAvLyAgICAgICAgICAgICB9OyBcbiAgICAvLyAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgLy8gICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgIC8vICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAvLyAgICAgICAgICAgICAgICAgaWNvbjogaW1hZ2UsXG4gICAgLy8gICAgICAgICAgICAgICAgIHpvb206IDExXG4gICAgLy8gICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpO1xuICAgIC8vICAgICAgICAgICAgIC8vIGluZm9XaW5kb3cuc2V0Q29udGVudCgnTG9jYXRpb24gZm91bmQuJyk7XG4gICAgLy8gICAgICAgICAgICAgbWFwLnNldENlbnRlcigkc2NvcGUucG9zaWNpb25fYWN0dWFsKTtcbiAgICAvLyAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKHRydWUsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgIC8vIEJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEdlb2xvY2F0aW9uXG4gICAgLy8gICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcihmYWxzZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcblxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgLy8gJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3I9IGZ1bmN0aW9uKGJyb3dzZXJIYXNHZW9sb2NhdGlvbiwgaW5mb1dpbmRvdywgcG9zKSB7XG4gICAgLy8gICAgIC8vIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAvLyAgICAgLy8gaW5mb1dpbmRvdy5zZXRDb250ZW50KGJyb3dzZXJIYXNHZW9sb2NhdGlvbiA/XG4gICAgLy8gICAgICAgICAvLyAnRXJyb3I6IEVsIHNlcnZpY2lvIGRlIEdlb2xvY2FsaXphY2lvbiBGYWxsw7MuJyA6XG4gICAgLy8gICAgICAgICAvLyAnRXJyb3I6IFlvdXIgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBnZW9sb2NhdGlvbi4nKTtcbiAgICAvLyB9IFxuXG4gICAgLy8gJHNjb3BlLnNldE1hcmtlcnMgPSBmdW5jdGlvbihtYXApIHsgXG4gICAgLy8gICAgIHZhciBpbWFnZSA9IHsgXG4gICAgLy8gICAgICAgICB1cmw6ICdodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9leGFtcGxlcy9mdWxsL2ltYWdlcy9iZWFjaGZsYWcucG5nJywgXG4gICAgLy8gICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMzIpLCBcbiAgICAvLyAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAvLyAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApXG4gICAgLy8gICAgIH07ICBcbiAgICAvLyAgICAgLy8gdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXB9KTtcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGgpO1xuICAgIC8vICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpKyspIHsgXG4gICAgLy8gICAgICAgICB2YXIgYmVhY2ggPSAkc2NvcGUuZGF0YV9sb2FkW2ldO1xuICAgIC8vICAgICAgICAgdmFyIHBvcyA9IHtcbiAgICAvLyAgICAgICAgICAgbGF0OiBwYXJzZUZsb2F0KGJlYWNoLmxhdCksXG4gICAgLy8gICAgICAgICAgIGxuZzogcGFyc2VGbG9hdChiZWFjaC5sbmcpXG4gICAgLy8gICAgICAgICB9OyBcbiAgICAvLyAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAvLyAgICAgICAgICAgICBwb3NpdGlvbjogcG9zLFxuICAgIC8vICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgIC8vICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsIFxuICAgIC8vICAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgLy8gICAgICAgICAgICAgaWNvbjogaW1hZ2VcblxuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXJrZXIpO1xuICAgIC8vICAgICAgICAgLy8gJHNjb3BlLm1hcmtlcnNfaG92ZXIobWFya2VyKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cbiAgICAvLyBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTsgXG4gICAgLy8gJHNjb3BlLm1hcmtlcnNfaG92ZXIgPSBmdW5jdGlvbihsYXQsIGxuZyxmb3RvLHRpdHVsbyxkaXJlY2Npb24sZGF0YSl7IFxuICAgIC8vICAgICB2YXIgcG9zID0ge307XG4gICAgLy8gICAgIHBvcy5sYXQgPSBwYXJzZUZsb2F0KGxhdCk7XG4gICAgLy8gICAgIHBvcy5sbmcgPSBwYXJzZUZsb2F0KGxuZyk7IFxuICAgIC8vICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgLy8gICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXAsbWF4V2lkdGg6IDIwMH0pO1xuICAgIC8vICAgICBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7IFxuICAgIC8vICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoXG4gICAgLy8gICAgICAgICBbXG4gICAgLy8gICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjZW50ZXIgZ2xvYm9fdWJpY2FjaW9uXCI+JywgXG4gICAgLy8gICAgICAgICAgICAgJzxpbWcgd2lkdGg9XCIxMDAlXCIgc3JjPVwiJytmb3RvKydcIj4nLFxuICAgIC8vICAgICAgICAgICAgICc8aDY+Jyt0aXR1bG8rJzwvaDY+JywgXG4gICAgLy8gICAgICAgICAgICAgJzxwPicrZGlyZWNjaW9uKyc8L3A+JyxcbiAgICAvLyAgICAgICAgICAgICAnPGEgaHJlZj1cIiMhXCIgbmctY2xpY2s9XCJzaG93X21hcmtlcignK2RhdGErJylcIiBjbGFzcz1cImJ0biBwdWxsLXJpZ2h0XCI+VmVyPC9hPicsXG4gICAgLy8gICAgICAgICAgICAgJzwvZGl2PidcbiAgICAvLyAgICAgICAgIF0uam9pbignJylcbiAgICAvLyAgICAgKTtcbiAgICAvLyAgICAgbWFwLnNldENlbnRlcihuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHBvcykpO1xuICAgIC8vICAgICBtYXAuc2V0Wm9vbSgxNSk7ICAgIFxuICAgIC8vICAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzKCk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2cobGF0LGxuZylcbiAgICAvLyB9IFxuICAgIC8vICRzY29wZS5zZXRfZ29vZ2xlX21hcHMgPSBmdW5jdGlvbigpe1xuICAgIC8vICAgICB2YXIgaXdPdXRlciA9ICQoJy5nbS1zdHlsZS1pdycpO1xuICAgIC8vICAgICB2YXIgaXdDbG9zZUJ0biA9IGl3T3V0ZXIubmV4dCgpO1xuICAgIC8vICAgICB2YXIgaXdCYWNrZ3JvdW5kID0gaXdPdXRlci5wcmV2KCk7IFxuICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKS5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pOyBcbiAgICAvLyAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDQpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTtcbiAgICAvLyAgICAgaXdPdXRlci5wYXJlbnQoKS5wYXJlbnQoKS5jc3Moe2xlZnQ6ICc0MHB4J30pO1xuICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDg0cHggIWltcG9ydGFudDsnfSk7XG4gICAgLy8gICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnbGVmdDogODRweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAvLyAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuZmluZCgnZGl2JykuY2hpbGRyZW4oKS5jc3Moeydib3gtc2hhZG93JzogJ3JnYmEoMCwgMCwgMCwgMCkgMHB4IDFweCA2cHgnLCAnei1pbmRleCcgOiAnMSd9KTtcbiAgICAvLyAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKS5maW5kKCdkaXYnKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2hlaWdodDogMjFweCAhaW1wb3J0YW50OycrJ3dpZHRoOiAxMHB4ICFpbXBvcnRhbnQ7JysnbGVmdDo3cHggIWltcG9ydGFudDsnfSk7XG4gICAgLy8gICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDI1cHggIWltcG9ydGFudDsnKyd3aWR0aDogOXB4ICFpbXBvcnRhbnQ7J30pO1xuICAgIC8vICAgICBpd0Nsb3NlQnRuLmNzcyh7J2Rpc3BsYXknOiAnbm9uZSd9KTtcbiAgICAvLyB9XG4gICAgLy8gJHNjb3BlLnNob3dfbWFya2VyID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gICAgICRzY29wZS5zaG93X2RldGFsbGUgPSB0cnVlO1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAvLyAgICAgJHNjb3BlLmRldGFsbGUgPSBkYXRhO1xuICAgIC8vICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IGZhbHNlO1xuICAgIC8vIH1cbiAgICAvLyAkc2NvcGUucmV0dXJuID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlOyBcbiAgICAvLyAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlO1xuICAgIC8vIH1cbiAgICAkc2NvcGUuZ3VhcmRhciA9IGZ1bmN0aW9uIChkYXRhKXsgIFxuICAgICAgICBTZXJ2aWNlcy5DcmVhdGUoZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIC8vICRzY29wZS5pbml0KCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5jcmVhdGVfYm9tYmVyb3MgPSBmdW5jdGlvbigpe1xuICAgICAgICBTZXJ2aWNlcy5sb2FkX2JvbWJlcm9zKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICRzY29wZS50ZW1wX2RhdGEgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHRzID0gcmVzcG9uc2U7IFxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5yZXN1bHRzLCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgbm9tYnJlX3RlbXAgOiBcIkJvbWJlcm9zIFwiK3ZhbHVlLm5vbWJyZSxcbiAgICAgICAgICAgICAgICAgICAgaWRfaW1hZ2UgOiB1dWlkLnY0KCksXG4gICAgICAgICAgICAgICAgICAgIG5vbWJyZV9lbXByZXNhIDogdmFsdWUubm9tYnJlLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY2Npb246IHZhbHVlLmRpcmVjY2lvbixcbiAgICAgICAgICAgICAgICAgICAgaG9yYXJpbzogJ0xhcyAyNCBob3JhcycsXG4gICAgICAgICAgICAgICAgICAgIHRlbGVmb25vXzE6IHZhbHVlLnRlbGVmb25vcywgXG4gICAgICAgICAgICAgICAgICAgIGNvcnJlbzogdmFsdWUuY29ycmVvLCBcbiAgICAgICAgICAgICAgICAgICAgbGF0OiB2YWx1ZS5MYXQsXG4gICAgICAgICAgICAgICAgICAgIGxuZzogdmFsdWUuTG9uZywgXG4gICAgICAgICAgICAgICAgICAgIGlkX3NlcnZpY2VzOiA0LFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHZhbHVlLmxpbmtfd2ViXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRlbXBfZGF0YS5wdXNoKG9iaik7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmd1YXJkYXIob2JqKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnRlbXBfZGF0YSk7XG4gICAgICAgICAgICAvLyAkc2NvcGUudGVtcC5wdXNoKCRzY29wZS5kYXRhX2xvYWQpOyAgXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG5cbiAgICAkc2NvcGUuY2FyZ2FyX2FnZW50ZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICBTZXJ2aWNlcy5sb2FkX2FnZW50ZXMoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgJHNjb3BlLnRlbXBfZGF0YSA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHMgPSByZXNwb25zZS5kYXRhOyBcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUucmVzdWx0cywgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgICAgIHZhciBmb3RvID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdHJlZXR2aWV3P3NpemU9NjA2eDQwMCZsb2NhdGlvbj0nK3ZhbHVlLl9sYXQrJywnK3ZhbHVlLl9sbmcrJyZwaXRjaD0tMC43NiZrZXk9QUl6YVN5RFNKRzhKa05KM2k3cHlIWnoxZ0MxVFlWVWljbTNDM3NFJztcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgICAgICAgICAgICBub21icmVfdGVtcCA6IFwiQWdlbnRlcyBBZ2VudGUgQmFuY28gZGUgbGEgTmFjacOzbiAtIFwiK3ZhbHVlLl9lc3RhYmxlY2ltaWVudG8sXG4gICAgICAgICAgICAgICAgICAgIGlkX2ltYWdlIDogdXVpZC52NCgpLFxuICAgICAgICAgICAgICAgICAgICBub21icmVfZW1wcmVzYSA6IHZhbHVlLl9lc3RhYmxlY2ltaWVudG8sXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjY2lvbjogdmFsdWUuX2RpcixcbiAgICAgICAgICAgICAgICAgICAgaG9yYXJpbzogJ1N1amV0byBhIGhvcmFyaW8gZGVsIGxvY2FsJyxcbiAgICAgICAgICAgICAgICAgICAgdGVsZWZvbm9fMTogJycsIFxuICAgICAgICAgICAgICAgICAgICBmb3RvOiBmb3RvLFxuICAgICAgICAgICAgICAgICAgICBjb3JyZW86IHZhbHVlLmNvcnJlbywgXG4gICAgICAgICAgICAgICAgICAgIGxhdDogdmFsdWUuX2xhdCxcbiAgICAgICAgICAgICAgICAgICAgbG5nOiB2YWx1ZS5fbG5nLCBcbiAgICAgICAgICAgICAgICAgICAgaWRfc2VydmljZXM6IDEsXG4gICAgICAgICAgICAgICAgICAgIHVybDogdmFsdWUubGlua193ZWJcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkc2NvcGUudGVtcF9kYXRhLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZ3VhcmRhcihvYmopO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSkgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudGVtcF9kYXRhKTtcbiAgICAgICAgICAgIC8vICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7ICBcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH0gXG4gICAgLy8gJHNjb3BlLmNhcmdhcl9hZ2VudGVzKCk7XG5cbiAgICAkc2NvcGUuYmFuY28gPSBmdW5jdGlvbigpe1xuICAgICAgICBTZXJ2aWNlcy5iYW5jbygpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICRzY29wZS5hZ2VudGVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgU2VydmljZXMuYWdlbnRlcygpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICRzY29wZS5jYWplcm8gPSBmdW5jdGlvbigpe1xuICAgICAgICBTZXJ2aWNlcy5jYWplcm8oKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vIGZ1bmN0aW9uIGdlb2NvZGVSZXN1bHQocmVzdWx0cywgc3RhdHVzKSB7IFxuICAgIC8vICAgICBpZiAoc3RhdHVzID09ICdPSycpIHsgICAgXG4gICAgLy8gICAgICAgICB2YXIgbWFya2VyT3B0aW9ucyA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb247XG4gICAgLy8gICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAvLyBFbiBjYXNvIGRlIG5vIGhhYmVyIHJlc3VsdGFkb3MgbyBxdWUgaGF5YSBvY3VycmlkbyB1biBlcnJvclxuICAgIC8vICAgICAgICAgLy8gbGFuemFtb3MgdW4gbWVuc2FqZSBjb24gZWwgZXJyb3JcbiAgICAvLyAgICAgICAgIGFsZXJ0KFwiR2VvY29kaW5nIG5vIHR1dm8gw6l4aXRvIGRlYmlkbyBhOiBcIiArIHN0YXR1cyk7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG4gICAgLy8gJHNjb3BlLmNhamVybygpO1xuICAgIC8vICRzY29wZS5jcmVhdGVfYm9tYmVyb3MoKTtcbiBcbn1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdTZXJ2aWNlcycsIFtdKVxuLmZhY3RvcnkoJ1NlcnZpY2VzJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICByZXR1cm4geyBcbiAgICAgICAgTG9hZDogZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zP25vbWJyZT0nK3ErJyZwZXJfcGFnZT0nK3ArJyZwYWdlPScrcGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgU2VlOiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIEVkaXQ6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucy8nK2lkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgXG4gICAgICAgIFVwZGF0ZTogZnVuY3Rpb24oaWQsZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgQ3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMnLGRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBEZWxldGU6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucy8nK2lkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSAsXG4gICAgICAgIGxvYWRfYm9tYmVyb3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NpYXNCeUlkLzIyNTAwMCcpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGFnZW5jaWE6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJuLmNvbS5wZS9jYW5hbGVzLWF0ZW5jaW9uL2Jhc2UtZGF0b3MvYWdlbmNpYXMuYXNwJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9LFxuICAgICAgICBjYWplcm86IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJuLmNvbS5wZS9jYW5hbGVzLWF0ZW5jaW9uL2Jhc2UtZGF0b3MvY2FqZXJvcy5hc3AnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAsIFxuICAgICAgICAvLyBhZ2VudGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAvLyAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ibi5jb20ucGUvY2FuYWxlcy1hdGVuY2lvbi9iYXNlLWRhdG9zL2FnZW50ZXMuYXNwJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9XG4gICAgICAgICxcbiAgICAgICAgbG9hZF9ob3NwaXRhbGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2dydXBvYWl6ZW4uY29tL2hvc3BpdGFsZXMuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZF9hZ2VudGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2dydXBvYWl6ZW4uY29tL2JhbmNvX25hY2lvbl9hZ2VudGVzLmpzb24nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgfTtcbn0pOyBcbn0pKCk7Il19
