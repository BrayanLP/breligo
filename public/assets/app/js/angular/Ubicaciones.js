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

    var obj = [
        {id: 'CdById/204000'},
        {id: 'CiasById/204000'},
        {id: 'CdById/205000'},
        {id: 'CiasById/205000'},
        {id: 'CdById/224000'},
        {id: 'CiasById/224000'},
        {id: 'CdById/225000'},
        {id: 'CiasById/225000'} 
    ];
    $scope.update_allBomberos = function(){  
        Services.Load('',300,1).then(function (response) {
            $scope.data_load = response.data;
            console.log($scope.data_load);
            var create_marker = [];
            if($scope.data_load.length > 0){ 
                for (var j = 0; j < obj.length; j++) {  
                    Services.allBomberos(obj[j].id).then(function(response){
                        $scope.result = response.data; 
                        var count = 0;
                        for (var i = 0; i < $scope.result.length; i++) {  
                            for (var x = 0; x < $scope.data_load.length; x++) {   
                                if(
                                    (parseFloat($scope.result[i].Lat) != $scope.data_load[x].lat) &&
                                    (parseFloat($scope.result[i].Long) != $scope.data_load[x].lng) &&
                                    ($scope.result[i].nombre != $scope.data_load[x].nomb) &&
                                    ($scope.result[i].codbom != $scope.data_load[x].cod)
            
                                ){  
                                    var lat = $scope.result[i].Lat;
                                    var lng = $scope.result[i].Long;
                                    var foto = 'https://maps.googleapis.com/maps/api/streetview?size=606x400&location='+lat+','+lng+'&pitch=-0.76&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE'; 
                                    var obj = {
                                        id_img : uuid.v4(),
                                        id_serv: 4,
                                        nomb : $scope.result[i].nombre, 
                                        direc: $scope.result[i].direccion,
                                        tel_1: $scope.result[i].telefonos, 
                                        hor: "Siempre Abierto",
                                        tel_2: null,
                                        cor: $scope.result[i].correo, 
                                        url: $scope.result[i].link_web,
                                        desc: null,
                                        lat: $scope.result[i].Lat,
                                        lng: $scope.result[i].Long, 
                                        foto: foto,
                                        abrev: $scope.result[i].abrev,
                                        cod: $scope.result[i].codbom,
                                        f_funda: $scope.result[i].fecha_fundacion,
                                        dr: $scope.result[i].dr,
                                        codidenest:$scope.result[i].codidenest,
                                        ubig: $scope.result[i].ubigeo
                                    }
                                    console.log(obj.nomb);
                                    $scope.guardar(obj); 
                                }
                                else{
                                    console.log("repetidas: "+count + 1);
                                    
                                }   
                            }  
                        }
                    }) 

                    
                } 
            }
            else{
                for (var j = 0; j < obj.length; j++) {  
                    Services.allBomberos(obj[j].id).then(function(response){
                        $scope.result = response.data; 
                        var count = 0;
                        for (var i = 0; i < $scope.result.length; i++) {  
                            // for (var x = 0; x < $scope.data_load.length; x++) {   
                                // if(
                                //     (parseFloat($scope.result[i].Lat) != $scope.data_load[x].lat) &&
                                //     (parseFloat($scope.result[i].Long) != $scope.data_load[x].lng) &&
                                //     ($scope.result[i].nombre != $scope.data_load[x].nomb) &&
                                //     ($scope.result[i].codbom != $scope.data_load[x].cod)
            
                                // ){  
                            var lat = $scope.result[i].Lat;
                            var lng = $scope.result[i].Long;
                            var foto = 'https://maps.googleapis.com/maps/api/streetview?size=606x400&location='+lat+','+lng+'&pitch=-0.76&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE'; 
                            var obj = {
                                id_img : uuid.v4(),
                                id_serv: 4,
                                nomb : $scope.result[i].nombre, 
                                direc: $scope.result[i].direccion,
                                tel_1: $scope.result[i].telefonos, 
                                hor: "Siempre Abierto",
                                tel_2: null,
                                cor: $scope.result[i].correo, 
                                url: $scope.result[i].link_web,
                                desc: null,
                                lat: $scope.result[i].Lat,
                                lng: $scope.result[i].Long, 
                                foto: foto,
                                abrev: $scope.result[i].abrev,
                                cod: $scope.result[i].codbom,
                                f_funda: $scope.result[i].fecha_fundacion,
                                dr: $scope.result[i].dr,
                                codidenest:$scope.result[i].codidenest,
                                ubig: $scope.result[i].ubigeo
                            }
                            console.log(obj.nomb);
                            $scope.guardar(obj); 
                                // }
                                // else{
                                //     console.log("repetidas: "+count + 1);
                                    
                                // }   
                        }  
                        // }
                    }) 

                    
                } 
            }
        })
            
            
        
    };    
    // $scope.load_allBomberos();

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
        }, 
        allBomberos: function(id){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/'+id).then(function(response){
                return response
            })
        }
        
        
        
        
    };
}); 
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3plQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlViaWNhY2lvbmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbnZhciBtb2RlbCA9IGFuZ3VsYXIubW9kdWxlKCdtb2RlbCcsIFxuICAgIFsnU2VydmljZXMnLFwiYW5ndWxhci11dWlkXCJdKTtcblxudmFyIHNlbGV0ZWRWYWx1ZSA9IDE1O1xuXG5tb2RlbC5jb250cm9sbGVyKCdDdHJsJywgXG4gICAgW1xuICAgICckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnU2VydmljZXMnLFxuICAgICd1dWlkJywgIFxuICAgIGZ1bmN0aW9uKCBcbiAgICAgICAgJHNjb3BlLFxuICAgICAgICAkaHR0cCxcbiAgICAgICAgJHRpbWVvdXQsXG4gICAgICAgIFNlcnZpY2VzLFxuICAgICAgICB1dWlkXG4gICAgICAgIClcbnsgIFxuICAgIHZhciBodG1sID0gZnVuY3Rpb24oaWQpIHsgXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7IFxuICAgIH07XG5cbiAgICAkc2NvcGUudGVtcCA9IFtdO1xuICAgICRzY29wZS5jYW50X3Jvd3MgPSBcIjEwXCI7XG4gICAgLy8gdmFyIGhhc2ggPSB1dWlkLnY0KCk7XG4gICAgLy8gY29uc29sZS5sb2coaGFzaCk7XG4gICAgJHNjb3BlLmxvYWQgPSBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgIGlmKHEgPT0gdW5kZWZpbmVkKXsgXG4gICAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfSAgIFxuICAgICAgICBTZXJ2aWNlcy5Mb2FkKHEscCxwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZCA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgICAgJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTsgIFxuICAgICAgICAgICAgJHNjb3BlLnRvID0gcmVzcG9uc2UudG87IFxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDsgXG4gICAgICAgICAgICBpZigkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gJHNjb3BlLnByZXZfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9ICRzY29wZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgIFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7IFxuICAgIH0gXG5cbiAgICAkc2NvcGUuYXJyYXkgPSBbJ2NhbnRfcm93cycsJ3NlYXJjaF90ZXh0J107XG4gICAgJHNjb3BlLiR3YXRjaEdyb3VwKCRzY29wZS5hcnJheSwgZnVuY3Rpb24obil7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG4pO1xuICAgICAgICBpZihuICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAkc2NvcGUubG9hZCgkc2NvcGUuc2VhcmNoX3RleHQsJHNjb3BlLmNhbnRfcm93cywxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgJHNjb3BlLmxvYWQoJycsJHNjb3BlLmNhbnRfcm93cywxKTtcbiAgICAgICAgfVxuICAgIH0pOyBcbiAgICBcbiAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5sb2FkKCcnLCRzY29wZS5jYW50X3Jvd3MsMSk7XG4gICAgfSAgXG4gXG4gICAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbihpZCl7XG4gICAgICAgICRzY29wZS5lZGl0X2NvcGlhID0ge307XG4gICAgICAgIFNlcnZpY2VzLkVkaXQoaWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdCA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgJHNjb3BlLmVkaXRfY29waWEubiA9IHJlc3BvbnNlLm5vbWJyZTtcbiAgICAgICAgICAgICRzY29wZS5lZGl0X2NvcGlhLmQgPSByZXNwb25zZS5kZXNjcmlwY2lvbjsgXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuZWRpdF9jb3BpYSA9IHt9O1xuICAgICAgICB2YXIgc3RvcmU7XG4gICAgICAgIHN0b3JlID1cbiAgICAgICAge1xuICAgICAgICAgICAgbm9tYnJlOiRzY29wZS5jcmVhdGUubm9tYnJlLFxuICAgICAgICAgICAgZGVzY3JpcGNpb246JHNjb3BlLmNyZWF0ZS5kZXNjcmlwY2lvblxuICAgICAgICB9XG4gICAgICAgIFNlcnZpY2VzLkNyZWF0ZShzdG9yZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICQoJyNjcmVhdGUnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgJHNjb3BlLmluaXQoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgJHNjb3BlLmVkaXRfY29waWEgPSB7fTtcbiAgICAgICAgdmFyIHVwZGF0ZTtcbiAgICAgICAgdXBkYXRlID1cbiAgICAgICAge1xuICAgICAgICAgICAgbm9tYnJlOiRzY29wZS5lZGl0Lm5vbWJyZSxcbiAgICAgICAgICAgIGRlc2NyaXBjaW9uOiRzY29wZS5lZGl0LmRlc2NyaXBjaW9uXG4gICAgICAgIH1cbiAgICAgICAgU2VydmljZXMuVXBkYXRlKGlkLHVwZGF0ZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICQoJyNlZGl0JykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICRzY29wZS5pbml0KCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5kZWxldGUgPSBmdW5jdGlvbihpZCl7IFxuICAgICAgICBTZXJ2aWNlcy5EZWxldGUoaWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7XG4gICAgfTsgIFxuICAgIC8vICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTtcbiAgICAvLyAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7XG4gICAgLy8gdmFyIG1hcDtcbiAgICAvLyB2YXIgaW5mb1dpbmRvdyA9IG51bGw7XG5cbiAgICAvLyBmdW5jdGlvbiBjbG9zZUluZm9XaW5kb3coKXtcbiAgICAvLyAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgIC8vIH1cbiAgICAgXG5cbiAgICAvLyAkc2NvcGUuTWFwID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcGEnKSwge1xuICAgIC8vICAgICAgICAgY2VudGVyOiB7bGF0OiAtMTIuMDQ2NjI5LCBsbmc6IC03Ny4wMjE0MzM3fSxcbiAgICAvLyAgICAgICAgIHpvb206IDExXG4gICAgLy8gICAgIH0pO1xuICAgICAgICBcbiAgICAvLyB9XG5cblxuXG4gICAgLy8gJHNjb3BlLmluaXRNYXAgPSBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgJHNjb3BlLk1hcCgpO1xuICAgIC8vICAgICAkc2NvcGUuc2V0TWFya2VycyhtYXApO1xuICAgIC8vICAgICAvLyAkc2NvcGUuaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG4gICAgLy8gICAgIC8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgJHNjb3BlLmNsb3NlSW5mb1dpbmRvdygpKTtcblxuICAgIC8vICAgICAvLyB2YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHttYXA6IG1hcH0pO1xuXG4gICAgLy8gICAgIC8vIFRyeSBIVE1MNSBnZW9sb2NhdGlvbi5cbiAgICAvLyAgICAgLy8gJHNjb3BlLmxvY2F0aW9uKCk7XG4gICAgICAgIFxuICAgIC8vIH1cbiAgICAvLyAkc2NvcGUubG9jYXRpb24gPSBmdW5jdGlvbigpe1xuICAgIC8vICAgICAkc2NvcGUuaW5pdE1hcCgpO1xuICAgIC8vICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgLy8gICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4gICAgLy8gICAgICAgICAgICAgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCA9IHtcbiAgICAvLyAgICAgICAgICAgICAgIGxhdDogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgIC8vICAgICAgICAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgLy8gICAgICAgICAgICAgfTtcbiAgICAvLyAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIHVybDogJy9hc3NldHMvYXBwL2ltYWdlcy9wb3NpdGlvbl9hY3R1YWwucG5nJywgXG4gICAgLy8gICAgICAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDUwLCA1MCksIFxuICAgIC8vICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgLy8gICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDQwKVxuICAgIC8vICAgICAgICAgICAgIH07IFxuICAgIC8vICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAvLyAgICAgICAgICAgICAgICAgcG9zaXRpb246ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgLy8gICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgIC8vICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZSxcbiAgICAvLyAgICAgICAgICAgICAgICAgem9vbTogMTFcbiAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgICAgICAvLyBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7XG4gICAgLy8gICAgICAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRDb250ZW50KCdMb2NhdGlvbiBmb3VuZC4nKTtcbiAgICAvLyAgICAgICAgICAgICBtYXAuc2V0Q2VudGVyKCRzY29wZS5wb3NpY2lvbl9hY3R1YWwpO1xuICAgIC8vICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IodHJ1ZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcbiAgICAvLyAgICAgICAgIH0pO1xuICAgIC8vICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgLy8gQnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgR2VvbG9jYXRpb25cbiAgICAvLyAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKGZhbHNlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuXG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcj0gZnVuY3Rpb24oYnJvd3Nlckhhc0dlb2xvY2F0aW9uLCBpbmZvV2luZG93LCBwb3MpIHtcbiAgICAvLyAgICAgLy8gaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpO1xuICAgIC8vICAgICAvLyBpbmZvV2luZG93LnNldENvbnRlbnQoYnJvd3Nlckhhc0dlb2xvY2F0aW9uID9cbiAgICAvLyAgICAgICAgIC8vICdFcnJvcjogRWwgc2VydmljaW8gZGUgR2VvbG9jYWxpemFjaW9uIEZhbGzDsy4nIDpcbiAgICAvLyAgICAgICAgIC8vICdFcnJvcjogWW91ciBicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IGdlb2xvY2F0aW9uLicpO1xuICAgIC8vIH0gXG5cbiAgICAvLyAkc2NvcGUuc2V0TWFya2VycyA9IGZ1bmN0aW9uKG1hcCkgeyBcbiAgICAvLyAgICAgdmFyIGltYWdlID0geyBcbiAgICAvLyAgICAgICAgIHVybDogJ2h0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L2V4YW1wbGVzL2Z1bGwvaW1hZ2VzL2JlYWNoZmxhZy5wbmcnLCBcbiAgICAvLyAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAzMiksIFxuICAgIC8vICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgIC8vICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMClcbiAgICAvLyAgICAgfTsgIFxuICAgIC8vICAgICAvLyB2YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHttYXA6IG1hcH0pO1xuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkLmxlbmd0aCk7XG4gICAgLy8gICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGg7IGkrKykgeyBcbiAgICAvLyAgICAgICAgIHZhciBiZWFjaCA9ICRzY29wZS5kYXRhX2xvYWRbaV07XG4gICAgLy8gICAgICAgICB2YXIgcG9zID0ge1xuICAgIC8vICAgICAgICAgICBsYXQ6IHBhcnNlRmxvYXQoYmVhY2gubGF0KSxcbiAgICAvLyAgICAgICAgICAgbG5nOiBwYXJzZUZsb2F0KGJlYWNoLmxuZylcbiAgICAvLyAgICAgICAgIH07IFxuICAgIC8vICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgIC8vICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgLy8gICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgLy8gICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCwgXG4gICAgLy8gICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICAvLyAgICAgICAgICAgICBpY29uOiBpbWFnZVxuXG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hcmtlcik7XG4gICAgLy8gICAgICAgICAvLyAkc2NvcGUubWFya2Vyc19ob3ZlcihtYXJrZXIpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuICAgIC8vIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICAvLyAkc2NvcGUubWFya2Vyc19ob3ZlciA9IGZ1bmN0aW9uKGxhdCwgbG5nLGZvdG8sdGl0dWxvLGRpcmVjY2lvbixkYXRhKXsgXG4gICAgLy8gICAgIHZhciBwb3MgPSB7fTtcbiAgICAvLyAgICAgcG9zLmxhdCA9IHBhcnNlRmxvYXQobGF0KTtcbiAgICAvLyAgICAgcG9zLmxuZyA9IHBhcnNlRmxvYXQobG5nKTsgXG4gICAgLy8gICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICAvLyAgICAgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHttYXA6IG1hcCxtYXhXaWR0aDogMjAwfSk7XG4gICAgLy8gICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTsgXG4gICAgLy8gICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChcbiAgICAvLyAgICAgICAgIFtcbiAgICAvLyAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNlbnRlciBnbG9ib191YmljYWNpb25cIj4nLCBcbiAgICAvLyAgICAgICAgICAgICAnPGltZyB3aWR0aD1cIjEwMCVcIiBzcmM9XCInK2ZvdG8rJ1wiPicsXG4gICAgLy8gICAgICAgICAgICAgJzxoNj4nK3RpdHVsbysnPC9oNj4nLCBcbiAgICAvLyAgICAgICAgICAgICAnPHA+JytkaXJlY2Npb24rJzwvcD4nLFxuICAgIC8vICAgICAgICAgICAgICc8YSBocmVmPVwiIyFcIiBuZy1jbGljaz1cInNob3dfbWFya2VyKCcrZGF0YSsnKVwiIGNsYXNzPVwiYnRuIHB1bGwtcmlnaHRcIj5WZXI8L2E+JyxcbiAgICAvLyAgICAgICAgICAgICAnPC9kaXY+J1xuICAgIC8vICAgICAgICAgXS5qb2luKCcnKVxuICAgIC8vICAgICApO1xuICAgIC8vICAgICBtYXAuc2V0Q2VudGVyKG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zKSk7XG4gICAgLy8gICAgIG1hcC5zZXRab29tKDE1KTsgICAgXG4gICAgLy8gICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhsYXQsbG5nKVxuICAgIC8vIH0gXG4gICAgLy8gJHNjb3BlLnNldF9nb29nbGVfbWFwcyA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIHZhciBpd091dGVyID0gJCgnLmdtLXN0eWxlLWl3Jyk7XG4gICAgLy8gICAgIHZhciBpd0Nsb3NlQnRuID0gaXdPdXRlci5uZXh0KCk7XG4gICAgLy8gICAgIHZhciBpd0JhY2tncm91bmQgPSBpd091dGVyLnByZXYoKTsgXG4gICAgLy8gICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSk7IFxuICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoNCknKS5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pO1xuICAgIC8vICAgICBpd091dGVyLnBhcmVudCgpLnBhcmVudCgpLmNzcyh7bGVmdDogJzQwcHgnfSk7XG4gICAgLy8gICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnbGVmdDogODRweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAvLyAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdsZWZ0OiA4NHB4ICFpbXBvcnRhbnQ7J30pO1xuICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5maW5kKCdkaXYnKS5jaGlsZHJlbigpLmNzcyh7J2JveC1zaGFkb3cnOiAncmdiYSgwLCAwLCAwLCAwKSAwcHggMXB4IDZweCcsICd6LWluZGV4JyA6ICcxJ30pO1xuICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpLmZpbmQoJ2RpdicpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnaGVpZ2h0OiAyMXB4ICFpbXBvcnRhbnQ7Jysnd2lkdGg6IDEwcHggIWltcG9ydGFudDsnKydsZWZ0OjdweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAvLyAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKS5maW5kKCdkaXYnKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2hlaWdodDogMjVweCAhaW1wb3J0YW50OycrJ3dpZHRoOiA5cHggIWltcG9ydGFudDsnfSk7XG4gICAgLy8gICAgIGl3Q2xvc2VCdG4uY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xuICAgIC8vIH1cbiAgICAvLyAkc2NvcGUuc2hvd19tYXJrZXIgPSBmdW5jdGlvbihkYXRhKXtcbiAgICAvLyAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IHRydWU7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIC8vICAgICAkc2NvcGUuZGV0YWxsZSA9IGRhdGE7XG4gICAgLy8gICAgICRzY29wZS5zaG93X3BhbmVsID0gZmFsc2U7XG4gICAgLy8gfVxuICAgIC8vICRzY29wZS5yZXR1cm4gPSBmdW5jdGlvbigpe1xuICAgIC8vICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7IFxuICAgIC8vICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7XG4gICAgLy8gfVxuICAgICRzY29wZS5ndWFyZGFyID0gZnVuY3Rpb24gKGRhdGEpeyAgXG4gICAgICAgIFNlcnZpY2VzLkNyZWF0ZShkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLmluaXQoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmNyZWF0ZV9ib21iZXJvcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFNlcnZpY2VzLmxvYWRfYm9tYmVyb3MoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgJHNjb3BlLnRlbXBfZGF0YSA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHMgPSByZXNwb25zZTsgXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLnJlc3VsdHMsIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgICAgICAgICAgICBub21icmVfdGVtcCA6IFwiQm9tYmVyb3MgXCIrdmFsdWUubm9tYnJlLFxuICAgICAgICAgICAgICAgICAgICBpZF9pbWFnZSA6IHV1aWQudjQoKSxcbiAgICAgICAgICAgICAgICAgICAgbm9tYnJlX2VtcHJlc2EgOiB2YWx1ZS5ub21icmUsXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjY2lvbjogdmFsdWUuZGlyZWNjaW9uLFxuICAgICAgICAgICAgICAgICAgICBob3JhcmlvOiAnTGFzIDI0IGhvcmFzJyxcbiAgICAgICAgICAgICAgICAgICAgdGVsZWZvbm9fMTogdmFsdWUudGVsZWZvbm9zLCBcbiAgICAgICAgICAgICAgICAgICAgY29ycmVvOiB2YWx1ZS5jb3JyZW8sIFxuICAgICAgICAgICAgICAgICAgICBsYXQ6IHZhbHVlLkxhdCxcbiAgICAgICAgICAgICAgICAgICAgbG5nOiB2YWx1ZS5Mb25nLCBcbiAgICAgICAgICAgICAgICAgICAgaWRfc2VydmljZXM6IDQsXG4gICAgICAgICAgICAgICAgICAgIHVybDogdmFsdWUubGlua193ZWJcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkc2NvcGUudGVtcF9kYXRhLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZ3VhcmRhcihvYmopO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSkgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudGVtcF9kYXRhKTtcbiAgICAgICAgICAgIC8vICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7ICBcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcblxuICAgICRzY29wZS5jYXJnYXJfYWdlbnRlcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFNlcnZpY2VzLmxvYWRfYWdlbnRlcygpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAkc2NvcGUudGVtcF9kYXRhID0gW107XG4gICAgICAgICAgICAkc2NvcGUucmVzdWx0cyA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5yZXN1bHRzLCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgdmFyIGZvdG8gPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0cmVldHZpZXc/c2l6ZT02MDZ4NDAwJmxvY2F0aW9uPScrdmFsdWUuX2xhdCsnLCcrdmFsdWUuX2xuZysnJnBpdGNoPS0wLjc2JmtleT1BSXphU3lEU0pHOEprTkozaTdweUhaejFnQzFUWVZVaWNtM0Mzc0UnO1xuICAgICAgICAgICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICAgICAgICAgIG5vbWJyZV90ZW1wIDogXCJBZ2VudGVzIEFnZW50ZSBCYW5jbyBkZSBsYSBOYWNpw7NuIC0gXCIrdmFsdWUuX2VzdGFibGVjaW1pZW50byxcbiAgICAgICAgICAgICAgICAgICAgaWRfaW1hZ2UgOiB1dWlkLnY0KCksXG4gICAgICAgICAgICAgICAgICAgIG5vbWJyZV9lbXByZXNhIDogdmFsdWUuX2VzdGFibGVjaW1pZW50byxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWNjaW9uOiB2YWx1ZS5fZGlyLFxuICAgICAgICAgICAgICAgICAgICBob3JhcmlvOiAnU3VqZXRvIGEgaG9yYXJpbyBkZWwgbG9jYWwnLFxuICAgICAgICAgICAgICAgICAgICB0ZWxlZm9ub18xOiAnJywgXG4gICAgICAgICAgICAgICAgICAgIGZvdG86IGZvdG8sXG4gICAgICAgICAgICAgICAgICAgIGNvcnJlbzogdmFsdWUuY29ycmVvLCBcbiAgICAgICAgICAgICAgICAgICAgbGF0OiB2YWx1ZS5fbGF0LFxuICAgICAgICAgICAgICAgICAgICBsbmc6IHZhbHVlLl9sbmcsIFxuICAgICAgICAgICAgICAgICAgICBpZF9zZXJ2aWNlczogMSxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB2YWx1ZS5saW5rX3dlYlxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRzY29wZS50ZW1wX2RhdGEucHVzaChvYmopO1xuICAgICAgICAgICAgICAgIC8vICRzY29wZS5ndWFyZGFyKG9iaik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KSBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS50ZW1wX2RhdGEpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTsgIFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7XG4gICAgfSBcbiAgICAvLyAkc2NvcGUuY2FyZ2FyX2FnZW50ZXMoKTtcblxuICAgICRzY29wZS5iYW5jbyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFNlcnZpY2VzLmJhbmNvKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgJHNjb3BlLmFnZW50ZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICBTZXJ2aWNlcy5hZ2VudGVzKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgJHNjb3BlLmNhamVybyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFNlcnZpY2VzLmNhamVybygpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBvYmogPSBbXG4gICAgICAgIHtpZDogJ0NkQnlJZC8yMDQwMDAnfSxcbiAgICAgICAge2lkOiAnQ2lhc0J5SWQvMjA0MDAwJ30sXG4gICAgICAgIHtpZDogJ0NkQnlJZC8yMDUwMDAnfSxcbiAgICAgICAge2lkOiAnQ2lhc0J5SWQvMjA1MDAwJ30sXG4gICAgICAgIHtpZDogJ0NkQnlJZC8yMjQwMDAnfSxcbiAgICAgICAge2lkOiAnQ2lhc0J5SWQvMjI0MDAwJ30sXG4gICAgICAgIHtpZDogJ0NkQnlJZC8yMjUwMDAnfSxcbiAgICAgICAge2lkOiAnQ2lhc0J5SWQvMjI1MDAwJ30gXG4gICAgXTtcbiAgICAkc2NvcGUudXBkYXRlX2FsbEJvbWJlcm9zID0gZnVuY3Rpb24oKXsgIFxuICAgICAgICBTZXJ2aWNlcy5Mb2FkKCcnLDMwMCwxKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkKTtcbiAgICAgICAgICAgIHZhciBjcmVhdGVfbWFya2VyID0gW107XG4gICAgICAgICAgICBpZigkc2NvcGUuZGF0YV9sb2FkLmxlbmd0aCA+IDApeyBcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG9iai5sZW5ndGg7IGorKykgeyAgXG4gICAgICAgICAgICAgICAgICAgIFNlcnZpY2VzLmFsbEJvbWJlcm9zKG9ialtqXS5pZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0ID0gcmVzcG9uc2UuZGF0YTsgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUucmVzdWx0Lmxlbmd0aDsgaSsrKSB7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyB4KyspIHsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocGFyc2VGbG9hdCgkc2NvcGUucmVzdWx0W2ldLkxhdCkgIT0gJHNjb3BlLmRhdGFfbG9hZFt4XS5sYXQpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocGFyc2VGbG9hdCgkc2NvcGUucmVzdWx0W2ldLkxvbmcpICE9ICRzY29wZS5kYXRhX2xvYWRbeF0ubG5nKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCRzY29wZS5yZXN1bHRbaV0ubm9tYnJlICE9ICRzY29wZS5kYXRhX2xvYWRbeF0ubm9tYikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgkc2NvcGUucmVzdWx0W2ldLmNvZGJvbSAhPSAkc2NvcGUuZGF0YV9sb2FkW3hdLmNvZClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApeyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF0ID0gJHNjb3BlLnJlc3VsdFtpXS5MYXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG5nID0gJHNjb3BlLnJlc3VsdFtpXS5Mb25nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvdG8gPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0cmVldHZpZXc/c2l6ZT02MDZ4NDAwJmxvY2F0aW9uPScrbGF0KycsJytsbmcrJyZwaXRjaD0tMC43NiZrZXk9QUl6YVN5RFNKRzhKa05KM2k3cHlIWnoxZ0MxVFlWVWljbTNDM3NFJzsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX2ltZyA6IHV1aWQudjQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF9zZXJ2OiA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vbWIgOiAkc2NvcGUucmVzdWx0W2ldLm5vbWJyZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWM6ICRzY29wZS5yZXN1bHRbaV0uZGlyZWNjaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbF8xOiAkc2NvcGUucmVzdWx0W2ldLnRlbGVmb25vcywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9yOiBcIlNpZW1wcmUgQWJpZXJ0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbF8yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcjogJHNjb3BlLnJlc3VsdFtpXS5jb3JyZW8sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJHNjb3BlLnJlc3VsdFtpXS5saW5rX3dlYixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogJHNjb3BlLnJlc3VsdFtpXS5MYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG5nOiAkc2NvcGUucmVzdWx0W2ldLkxvbmcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdG86IGZvdG8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJyZXY6ICRzY29wZS5yZXN1bHRbaV0uYWJyZXYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kOiAkc2NvcGUucmVzdWx0W2ldLmNvZGJvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmX2Z1bmRhOiAkc2NvcGUucmVzdWx0W2ldLmZlY2hhX2Z1bmRhY2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcjogJHNjb3BlLnJlc3VsdFtpXS5kcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RpZGVuZXN0OiRzY29wZS5yZXN1bHRbaV0uY29kaWRlbmVzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1YmlnOiAkc2NvcGUucmVzdWx0W2ldLnViaWdlb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cob2JqLm5vbWIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmd1YXJkYXIob2JqKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVwZXRpZGFzOiBcIitjb3VudCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkgXG5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvYmoubGVuZ3RoOyBqKyspIHsgIFxuICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlcy5hbGxCb21iZXJvcyhvYmpbal0uaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdCA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLnJlc3VsdC5sZW5ndGg7IGkrKykgeyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZm9yICh2YXIgeCA9IDA7IHggPCAkc2NvcGUuZGF0YV9sb2FkLmxlbmd0aDsgeCsrKSB7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgKHBhcnNlRmxvYXQoJHNjb3BlLnJlc3VsdFtpXS5MYXQpICE9ICRzY29wZS5kYXRhX2xvYWRbeF0ubGF0KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgKHBhcnNlRmxvYXQoJHNjb3BlLnJlc3VsdFtpXS5Mb25nKSAhPSAkc2NvcGUuZGF0YV9sb2FkW3hdLmxuZykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICgkc2NvcGUucmVzdWx0W2ldLm5vbWJyZSAhPSAkc2NvcGUuZGF0YV9sb2FkW3hdLm5vbWIpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAoJHNjb3BlLnJlc3VsdFtpXS5jb2Rib20gIT0gJHNjb3BlLmRhdGFfbG9hZFt4XS5jb2QpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gKXsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXQgPSAkc2NvcGUucmVzdWx0W2ldLkxhdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG5nID0gJHNjb3BlLnJlc3VsdFtpXS5Mb25nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3RvID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdHJlZXR2aWV3P3NpemU9NjA2eDQwMCZsb2NhdGlvbj0nK2xhdCsnLCcrbG5nKycmcGl0Y2g9LTAuNzYma2V5PUFJemFTeURTSkc4SmtOSjNpN3B5SFp6MWdDMVRZVlVpY20zQzNzRSc7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX2ltZyA6IHV1aWQudjQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRfc2VydjogNCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9tYiA6ICRzY29wZS5yZXN1bHRbaV0ubm9tYnJlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWM6ICRzY29wZS5yZXN1bHRbaV0uZGlyZWNjaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZWxfMTogJHNjb3BlLnJlc3VsdFtpXS50ZWxlZm9ub3MsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3I6IFwiU2llbXByZSBBYmllcnRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbF8yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3I6ICRzY29wZS5yZXN1bHRbaV0uY29ycmVvLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAkc2NvcGUucmVzdWx0W2ldLmxpbmtfd2ViLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXQ6ICRzY29wZS5yZXN1bHRbaV0uTGF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6ICRzY29wZS5yZXN1bHRbaV0uTG9uZywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdG86IGZvdG8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFicmV2OiAkc2NvcGUucmVzdWx0W2ldLmFicmV2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2Q6ICRzY29wZS5yZXN1bHRbaV0uY29kYm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmX2Z1bmRhOiAkc2NvcGUucmVzdWx0W2ldLmZlY2hhX2Z1bmRhY2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHI6ICRzY29wZS5yZXN1bHRbaV0uZHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGlkZW5lc3Q6JHNjb3BlLnJlc3VsdFtpXS5jb2RpZGVuZXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1YmlnOiAkc2NvcGUucmVzdWx0W2ldLnViaWdlb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvYmoubm9tYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmd1YXJkYXIob2JqKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwicmVwZXRpZGFzOiBcIitjb3VudCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0gICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICB9KSBcblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgXG4gICAgfTsgICAgXG4gICAgLy8gJHNjb3BlLmxvYWRfYWxsQm9tYmVyb3MoKTtcblxuICAgIC8vIGZ1bmN0aW9uIGdlb2NvZGVSZXN1bHQocmVzdWx0cywgc3RhdHVzKSB7IFxuICAgIC8vICAgICBpZiAoc3RhdHVzID09ICdPSycpIHsgICAgXG4gICAgLy8gICAgICAgICB2YXIgbWFya2VyT3B0aW9ucyA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb247XG4gICAgLy8gICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAvLyBFbiBjYXNvIGRlIG5vIGhhYmVyIHJlc3VsdGFkb3MgbyBxdWUgaGF5YSBvY3VycmlkbyB1biBlcnJvclxuICAgIC8vICAgICAgICAgLy8gbGFuemFtb3MgdW4gbWVuc2FqZSBjb24gZWwgZXJyb3JcbiAgICAvLyAgICAgICAgIGFsZXJ0KFwiR2VvY29kaW5nIG5vIHR1dm8gw6l4aXRvIGRlYmlkbyBhOiBcIiArIHN0YXR1cyk7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG4gICAgLy8gJHNjb3BlLmNhamVybygpO1xuICAgIC8vICRzY29wZS5jcmVhdGVfYm9tYmVyb3MoKTtcbiBcbn1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdTZXJ2aWNlcycsIFtdKVxuLmZhY3RvcnkoJ1NlcnZpY2VzJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICByZXR1cm4geyBcbiAgICAgICAgTG9hZDogZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zP25vbWJyZT0nK3ErJyZwZXJfcGFnZT0nK3ArJyZwYWdlPScrcGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgU2VlOiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIEVkaXQ6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucy8nK2lkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgXG4gICAgICAgIFVwZGF0ZTogZnVuY3Rpb24oaWQsZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgQ3JlYXRlOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMnLGRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBEZWxldGU6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucy8nK2lkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSAsXG4gICAgICAgIGxvYWRfYm9tYmVyb3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NpYXNCeUlkLzIyNTAwMCcpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGFnZW5jaWE6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJuLmNvbS5wZS9jYW5hbGVzLWF0ZW5jaW9uL2Jhc2UtZGF0b3MvYWdlbmNpYXMuYXNwJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9LFxuICAgICAgICBjYWplcm86IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJuLmNvbS5wZS9jYW5hbGVzLWF0ZW5jaW9uL2Jhc2UtZGF0b3MvY2FqZXJvcy5hc3AnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAsIFxuICAgICAgICAvLyBhZ2VudGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAvLyAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ibi5jb20ucGUvY2FuYWxlcy1hdGVuY2lvbi9iYXNlLWRhdG9zL2FnZW50ZXMuYXNwJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9XG4gICAgICAgICxcbiAgICAgICAgbG9hZF9ob3NwaXRhbGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2dydXBvYWl6ZW4uY29tL2hvc3BpdGFsZXMuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZF9hZ2VudGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2dydXBvYWl6ZW4uY29tL2JhbmNvX25hY2lvbl9hZ2VudGVzLmpzb24nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIFxuICAgICAgICBhbGxCb21iZXJvczogZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy8nK2lkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgfTtcbn0pOyBcbn0pKCk7Il19
