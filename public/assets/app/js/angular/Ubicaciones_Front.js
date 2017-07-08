(function () {
'use strict';
var model = angular.module('model', 
    ['Services',"ngSanitize","angular-uuid"]);

var seletedValue = 15;

model.controller('Ctrl', 
    ['$scope',
    '$http',
    '$timeout',
    'Services',  
    'uuid',
    function(
        $scope,
        $http,
        $timeout,
        Services,
        uuid)
{  
    var html = function(id) { 
        return document.getElementById(id); 
    };

    $scope.temp = [];
    $scope.new_marker = [];
    $scope.data_real = [];
    $scope.cant_rows = "10";
    $scope.mapa = 'full';
    $scope.header_search = true;
    
    $scope.load = function(q,p,page){
        if(q == undefined){ 
            q = "";
        }   
        Services.Load(q,p,page).then(function (response) {
            $scope.data_load = response.data; 
            // $scope.temp.push($scope.data_load);  
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

    $scope.update_foto = function(){
        console.log($scope.data_load);
        $scope.temp_data = [];
        angular.forEach($scope.data_load, function(value){
            
            var foto = 'https://maps.googleapis.com/maps/api/streetview?size=606x400&location='+value.lat+','+value.lng+'&pitch=-0.76&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE';
            // var id = value.id;
            var obj = {
                foto : foto 

            }
            // $scope.temp_data.push(obj);
            $scope.update_full(value.id,obj);
            // console.log(value.id, obj);
        })
    }
    $scope.update_full = function(id,data){ 
        // console.log(id, data);
        Services.Update_img(id,data).then(function (response) {
            console.log(response);
            // $('#edit').modal('hide');
            // $scope.init();
        }, function (response) {
        });
    };

    $scope.load_services = function(q,p,page){
        if(q == undefined){ 
            q = "";
        }  
        Services.Load_Services(q,p,page).then(function (response) {
            $scope.data_load_services = response.data;
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
            // console.log($scope.data_load_services);
        }, function (response) {
        }); 
    };

    $scope.load_services('',10,1);


    
    
    $scope.init = function(){
        $scope.load('',200,1);
    }   

    $scope.show_panel = true;
    $scope.show_detalle = false;
    $scope.disable_button = false;
    var map,map2,marker;
    var infoWindow = null;
    infoWindow = new google.maps.InfoWindow(); 
    
    var directionsDisplay = null;
    var directionsService = null; 
    // var style = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#31466a"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":"-13"},{"lightness":"6"},{"gamma":"1.81"},{"color":"#c9ccd1"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"weight":"1.82"}]},{"featureType":"landscape","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"lightness":"3"},{"gamma":"0.00"},{"saturation":"-1"},{"weight":"2.30"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":"-100"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"on"},{"saturation":"-100"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#5375ac"},{"visibility":"on"}]}];
    var style = [
        {
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "hue": "#ff0000"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.attraction",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ];

    function closeInfoWindow(){
        // infoWindow = new google.maps.InfoWindow(); 
        infoWindow.close();
    } 
    
    $scope.Map = function() {
        map = new google.maps.Map(document.getElementById('mapa'), {
            center: {lat: -12.046629, lng: -77.0214337},
            zoom: 11,
            styles : style
        });
        /* permite ocultar el infowindow */
        infoWindow = new google.maps.InfoWindow(); 
        google.maps.event.addListener(map, 'click', function(){
            closeInfoWindow();
        });



        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsService = new google.maps.DirectionsService();
        
    }
    $scope.Map(); 


    $scope.initMap = function() { 
        // $scope.$watch('search_entidad', function(n){ 
            if($scope.search_entidad != undefined && $scope.search_entidad != ''){
                $scope.load($scope.search_entidad,5,1);
                // $scope.mapa = 'detalle'; 
            }
            else{
                $scope.load('','0',1); 
                // $scope.mapa = 'full'; 
            }
        // });           
    }
    $scope.initMap();

    $scope.resize = function(map){
        google.maps.event.addListenerOnce(map, 'bounds_changed', function () {
           google.maps.event.trigger(map, 'resize');
           var bounds = map.getBounds();
        });
    }; 

    $scope.getKilometros = function(lat1,lon1,lat2,lon2){
        function rad(x) {
            return x * Math.PI/180;
        }
        var R = 6378.137; //Radio de la tierra en km
        var dLat = rad( lat2 - lat1 );
        var dLong = rad( lon2 - lon1 );
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        var result = d.toFixed(3); 
        return result; //Retorna tres decimales
    };

    function getMinFromArray (array_of_values) {
        var min = Math.min.apply(null, array_of_values);
        return min;   
    };

    // google.maps.event.addListener(marker, 'click', function (e) {
    //     alert("clicked marker");
    // });

    
    // $scope.location = function(){  
        //     if (navigator.geolocation) {
        //         // INIT RESIZE 
        //         $scope.mapa = 'detalle'; 
        //         $scope.disable_button = true; 
        //         $scope.data = [];

        //         $scope.initMap(); 
        //         window.setTimeout(function() {
        //           google.maps.event.trigger(map, 'resize');
        //         },500);
        //         navigator.geolocation.getCurrentPosition(function(position) {    
        //             $scope.createMarker(map);
        //             $scope.posicion_actual = {
        //               lat: position.coords.latitude,
        //               lng: position.coords.longitude
        //             }; 
                    
        //             var geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.posicion_actual.lat + ',' + $scope.posicion_actual.lng + '&sensor=false';
        //             console.log(geocoding);

        //             var image = {
        //                 url: '/assets/app/images/position_actual.png', 
        //                 size: new google.maps.Size(50, 50), 
        //                 origin: new google.maps.Point(0, 0), 
        //                 anchor: new google.maps.Point(0, 40)
        //             }; 
        //             var marker = new google.maps.Marker({
        //                 position: $scope.posicion_actual,
        //                 map: map,
        //                 icon: image
        //             });

        //             var circle = new google.maps.Circle({
        //                 center: $scope.posicion_actual,
        //                 radius: 1000,
        //                 map: map,
        //                 fillColor: '#39527b',
        //                 fillOpacity: 0,
        //                 strokeColor: '#39527b',
        //                 strokeOpacity: 0.2
        //             });   
        //             $.getJSON(geocoding).done(function(location) {
        //                 // console.log(location.results[0].formatted_address);
        //                 // $scope.search_entidad = location.results[0].formatted_address;
        //                 // $scope.$digest();
        //             });
        //             for (var i = $scope.data_load.length; i--;){ 
        //                 if(parseFloat( $scope.getKilometros( $scope.posicion_actual.lat, $scope.posicion_actual.lng, $scope.data_load[i].lat, $scope.data_load[i].lng)) <= 1){   
        //                     $scope.data_real.push($scope.data_load[i]);
        //                     // console.log($scope.data_real);
        //                     $scope.$digest();
        //                     // var min = Math.min.apply(null, array);
        //                     // console.log(i +' el minimo es: '+ min);
        //                     // console.log(result);
        //                     // console.log($scope.data_load[i]);
        //                     // if(i == 0){
        //                         // console.log($scope.data_load[i]);
        //                         // $.getJSON(geocoding).done(function(location) {
        //                             // console.log(location.results[0].formatted_address);
        //                         //     var start = location.results[0].formatted_address;
        //                         //     var end = $scope.data_load[3].direccion;
        //                         //     if(!start || !end){
        //                         //         alert("Start and End addresses are required");
        //                         //         return;
        //                         //     }
        //                         //     var request = {
        //                         //             origin: start,
        //                         //             destination: end,
        //                         //             travelMode: google.maps.DirectionsTravelMode['WALKING'],
        //                         //             unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
        //                         //             provideRouteAlternatives: false
        //                         //     };

        //                         //     directionsService.route(request, function(response, status) {
        //                         //         if (status == google.maps.DirectionsStatus.OK) {
        //                         //             directionsDisplay.setMap(map);
        //                         //             directionsDisplay.setPanel($("#directions_panel").get(0));
        //                         //             directionsDisplay.setDirections(response);
        //                         //         } else {
        //                         //             console.log(response,status);
        //                         //             alert("There is no directions available between these two points");
        //                         //         }
        //                         //     });
        //                         // })
        //                     // }
                            
        //                 } 
        //                 else{ 
        //                     $scope.del($scope.data_load.indexOf($scope.data_load[i])); 
        //                     $scope.new_marker[i].setMap(null);  
        //                     $scope.$digest(); 
        //                 } 
        //             } 

                    
        //             map.setZoom(18);
        //             map.panTo(marker.position);
        //             map.fitBounds(circle.getBounds());
        //         }, function() {   
        //             $scope.handleLocationError(true, infoWindow, map.getCenter());
        //         }); 
        //     } else { 
        //         $scope.handleLocationError(false, infoWindow, map.getCenter());

        //     }
         
    // }
    $scope.location = function(){  
        if (navigator.geolocation) { 
            navigator.geolocation.getCurrentPosition(function(position) {    
                 
                $scope.posicion_actual = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }; 
                
                var geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.posicion_actual.lat + ',' + $scope.posicion_actual.lng + '&sensor=false'; 
                var image = {
                    url: '/assets/app/images/position_actual.png', 
                    size: new google.maps.Size(50, 50), 
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 40)
                }; 
                var marker = new google.maps.Marker({
                    position: $scope.posicion_actual,
                    map: map,
                    icon: image
                });   
                // $.getJSON(geocoding).done(function(location) { 
                //     $scope.input_start = location.results[0].formatted_address;  
                //     $scope.$digest();
                //     // $scope.indicaciones();
                // });  
                map.setZoom(18);
                map.panTo(marker.position); 
            }, function() {   
                $scope.handleLocationError(true, infoWindow, map.getCenter());
            }); 
        } else { 
            $scope.handleLocationError(false, infoWindow, map.getCenter());

        }
         
    }
    /* permite mostra y ocultar los marcadores y actualizar el listado */
    $scope.toggle_Marker = function(id){ 
        console.log("Ingreso el ID: "+id);
        $scope.id = document.getElementById(id);;
        $scope.id.checked = !$scope.id.checked; 
        if($('#'+id).is(':checked')){
            for(var i = $scope.data_real.length; i--;){ 
                if($scope.data_real[i].id_services === id){  
                    var variable = '#'+$scope.data_real[i].id+'-'+id;
                    $(variable).show();
                    // $scope.del_temp($scope.data_real.indexOf($scope.data_real[i]));   
                }
                else{
                    console.log("=============");
                    console.log($scope.data_real[i].id_services);
                    console.log("============="); 
                }
            }
            for(var i = 0; i < $scope.new_marker.length; i++){
                if($scope.new_marker[i].type === id){ 
                    $scope.new_marker[i].setVisible(true);
                    
                }
            }
        }
        else{
            for(var i = $scope.data_real.length; i--;){ 
                if($scope.data_real[i].id_services === id){ 
                    var variable = '#'+$scope.data_real[i].id+'-'+id;
                    $(variable).hide();
                    // $scope.del_temp($scope.data_real.indexOf($scope.data_real[i]));   
                }
                else{
                    console.log("=============");
                    console.log($scope.data_real[i].id_services);
                    console.log("============="); 
                }
            }
            for(var j = 0; j < $scope.new_marker.length; j++){
                if($scope.new_marker[j].type === id){ 
                    $scope.new_marker[j].setVisible(false); 
                }
                else{
                    // console.log("-- no se elimino --: "+$scope.data_real[i].id_services);   
                } 
            }
        }
        // $scope.$digest();
    }

    $scope.indicaciones = function(){   
        if(!$scope.input_start || !$scope.input_end){
            alert("Start and End addresses are required");
            return;
        }
        var request = {
                origin: $scope.input_start,
                destination: $scope.input_end,
                travelMode: google.maps.DirectionsTravelMode['DRIVING'],
                unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
                provideRouteAlternatives: false
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                // directionsDisplay.setPanel($("#directions_panel").get(0));
                directionsDisplay.setDirections(response);
                $scope.origen = response.request.origin;
                $scope.destino = response.request.destination;
                $scope.indicacion_detalle = true;
                $scope.warning = response.routes[0].warnings[0];
                $scope.distancia = response.routes[0].legs[0].distance.text;
                $scope.duracion = response.routes[0].legs[0].duration.text;
                $scope.ruta_general = response.routes[0].summary;
                $scope.ruta_detalle = response.routes[0].legs[0].steps;
                // $scope.titulo = $('#deta').html(response.routes[0].legs[0].steps[1].instructions);
                 
                console.log(response);
                $scope.$digest();
            } else {
                console.log(response,status);
                alert("There is no directions available between these two points");
            }
        }); 
    }

    $scope.go_position = function(){ 
        console.log($scope.data_load[i]);
        $.getJSON(geocoding).done(function(location) {
            // console.log(location);
            var start = location.results[0].formatted_address;
            var end = $scope.data_load[3].direccion;
            if(!start || !end){
                alert("Start and End addresses are required");
                return;
            }
            var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.DirectionsTravelMode['WALKING'],
                    unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
                    provideRouteAlternatives: false
            };

            directionsService.route(request, function(response, status) {
                console.log(response);
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(map);
                    directionsDisplay.setPanel($("#directions_panel").get(0));
                    directionsDisplay.setDirections(response);
                } else {
                    console.log(response,status);
                    alert("There is no directions available between these two points");
                }
            });
        }) 
    }

    // Elimina 1 x 1 cada dato que no esta en el rango
    $scope.del = function(index){  
        $scope.data_load.splice(index,1);  
    };
    $scope.del_temp = function(index){  
        $scope.data_real.splice(index,1);  
    };
    // Hace un recorrido al array de marcadores
    $scope.setMapOnAll = function(map) {
        for(var i = 0; i < $scope.new_marker.length; i++) { 
            $scope.new_marker[i].setMap(map);
        }
    }
    // limpia todos los marcadores a null
    $scope.clearMarkers = function() {
        $scope.setMapOnAll(null);
    }
    // funcion llama a limpiar todos los marcadores
    $scope.deleteMarkers = function() {
        $scope.clearMarkers();
        $scope.new_marker = [];
    } 

    $scope.handleLocationError= function(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: El servicio de Geolocalizacion Falló.' :
            'Error: Your browser doesn\'t support geolocation.');
    } 

    
    
    $scope.createMarker = function(map) {  
        if($scope.data_load != undefined){
            for (var i = 0; i < $scope.data_load.length; i++) {  
                var data_temp = $scope.data_load[i]; 
                var pos = {
                  lat: parseFloat(data_temp.lat),
                  lng: parseFloat(data_temp.lng)
                }; 
                if(data_temp.id_services === 1){
                    var image = { 
                        url: '//localhost:3000/assets/app/images/banco-color.svg', 
                        scaledSize: new google.maps.Size(20, 20), 
                        origin: new google.maps.Point(0, 0), 
                        anchor: new google.maps.Point(0, 0),
                        scale: 1
                    };  
                } 
                else if(data_temp.id_services === 2){
                    var image = { 
                        url: '//localhost:3000/assets/app/images/comisaria-color.svg', 
                        scaledSize: new google.maps.Size(20, 20),  
                        origin: new google.maps.Point(0, 0), 
                        anchor: new google.maps.Point(0, 0),
                        scale: 1
                    };  
                }
                else if(data_temp.id_services === 3){
                    var image = { 
                        url: '//localhost:3000/assets/app/images/hospital-color.svg', 
                        scaledSize: new google.maps.Size(20, 20),  
                        origin: new google.maps.Point(0, 0), 
                        anchor: new google.maps.Point(0, 0),
                        scale: 1
                    };  
                }
                else if(data_temp.id_services === 4){
                    var image = { 
                        url: '//localhost:3000/assets/app/images/bomberos-color.svg', 
                        scaledSize: new google.maps.Size(20, 20),  
                        origin: new google.maps.Point(0, 0), 
                        anchor: new google.maps.Point(0, 0),
                        scale: 1
                    };  
                } 
                else{
                    console.log("Ocurrio un error inesperado en los ID "+data_temp.id_services+" de Entidades");
                } 
                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    animation: google.maps.Animation.DROP, 
                    draggable: false,
                    icon: image,
                    type: data_temp.id_services,
                    foto: data_temp.foto,
                    nombre_empresa: data_temp.nombre_empresa,
                    direccion: data_temp.direccion

                }); 
                $scope.new_marker.push(marker); 
                // $scope.markers_hover(marker);  
                google.maps.event.addListener(marker, 'click', function(){
                    $scope.openInfoWindow(this); 
                });
            }
        }
        else{
            alert('Ocurrio un error al cargar');

        }
        // console.log($scope.new_marker);
        //cierra el infowindow una vez cambie
        infoWindow.close();
    } 

    function toggleBounce() { 
        // marker.setAnimation(google.maps.Animation.BOUNCE); 
    }
    
    
    $scope.markers_hover = function(lat, lng,foto,titulo,direccion,data){ 
        
        var pos = {};
        pos.lat = parseFloat(lat);
        pos.lng = parseFloat(lng); 
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({map: map,maxWidth: 200});
        infoWindow.setPosition(pos); 
        infoWindow.setContent(
            [
                '<div class="center globo_ubicacion">', 
                '<img width="100%" src="'+foto+'">',
                '<h6>'+titulo+'</h6>', 
                '<p>'+direccion+'</p>', 
                '</div>'
            ].join('')
        ); 
        $scope.set_google_maps(); 
    } 

    
    $scope.openInfoWindow = function(marker){
        infoWindow.close(); 
        infoWindow = new google.maps.InfoWindow({map: map,maxWidth: 200});
        var pos = marker.position; 
        infoWindow.setPosition(pos); 
        infoWindow.setContent(
            [
                '<div class="center globo_ubicacion">', 
                '<img width="100%" src="'+marker.foto+'">',
                '<h6>'+marker.nombre_empresa+'</h6>', 
                '<p>'+marker.direccion+'</p>', 
                '</div>'
            ].join('')
        ); 
        $scope.set_google_maps();
    }

    $scope.set_google_maps = function(){
        var iwOuter = $('.gm-style-iw');
        var iwCloseBtn = iwOuter.next();
        var iwBackground = iwOuter.prev(); 
        iwBackground.children(':nth-child(2)').css({'display' : 'none'}); 
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});
        iwOuter.parent().parent().css({left: '40px'});
        iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
        iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 0, 0, 0) 0px 1px 6px', 'z-index' : '1'});
        iwBackground.children(':nth-child(3)').children(':nth-child(1)').find('div').attr('style', function(i,s){ return s + 'height: 21px !important;'+'width: 10px !important;'+'left:7px !important;'});
        iwBackground.children(':nth-child(3)').children(':nth-child(2)').find('div').attr('style', function(i,s){ return s + 'height: 25px !important;'+'width: 9px !important;'});
        iwCloseBtn.css({'display': 'none'});
    };

    $scope.show_marker = function(data){
        $scope.mapa = 'detalle'; 
        $scope.hide_search = true;
        $scope.boton_search_global = false;
        // for (var i = 0; i < marker.length; i++) {
        //     marker[i].setMap(null);
        // }  
        
        var pos = {};
        pos.lat = parseFloat(data.lat);
        pos.lng = parseFloat(data.lng);
        console.log(pos); 
        $scope.show_detalle = true;
        $scope.detalle = data;
        $scope.show_panel = false;
        /* hace zoom y renderiza la posicion */ 
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP, 
            draggable: false, 
            type: data.id_services,
            foto: data.foto,
            nombre_empresa: data.nombre_empresa,
            direccion: data.direccion

        });  
        
        window.setTimeout(function() {
          google.maps.event.trigger(map, 'resize');
        },800);
        map.setZoom(17);
        map.panTo(pos); 
    };

    $scope.search_global = function(search){
        $scope.mapa = 'detalle'; 
        $scope.hide_search = true;
        $scope.show_detalle = false; 
        $scope.show_panel = true; 
        $scope.boton_search_global = false;
        $scope.load(search,10,1);
        $scope.createMarker(map);

    }
    $scope.return = function(){
        $scope.mapa = 'full'; 
        $scope.show_detalle = false; 
        $scope.show_panel   = true;
        $scope.hide_search  = false;
        $scope.boton_search_global = true; 
        window.setTimeout(function() {
          google.maps.event.trigger(map, 'resize');
        },500);
    };

    $scope.como_llegar = function(lat, lng){ 
        $scope.show_detalle     = false; 
        $scope.show_panel       = false;
        $scope.hide_search      = true;
        $scope.boton_search_global = false; 

        var geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=false';
        console.log(geocoding);


        // mostrar el header de indicador
        $scope.header_search = false;

        $.getJSON(geocoding).done(function(location) {
            console.log(location.results[0].formatted_address);
            $scope.input_end = location.results[0].formatted_address;
            $scope.$digest();

        }); 

    }

    $scope.show_detalle_indicaciones = function(){
        $scope.detalle_distancia = true;
    }

    $scope.close_indicacion = function(){
        directionsDisplay.setMap(null);
        $scope.mapa = 'full';
        $scope.input_end = "";
        $scope.input_start = "";   
        $scope.header_search = true;
        $scope.hide_search     = false;
        $scope.indicacion_detalle = false;
        $scope.boton_search_global = true;  
        $scope.show_detalle     = false;
        $scope.show_panel       = true;
        window.setTimeout(function() {
          google.maps.event.trigger(map, 'resize');
        },500);
    }
    // ESTE CODIGO CREA HOSPITALES
    // var geocoder = new google.maps.Geocoder(); 
    // $scope.create_hospitales = function(){
    //     Services.load_hospitales().then(function (response) {
    //         console.log(response.data);
    //         $scope.temp_data = [];
    //         $scope.results = response.data; 
    //         angular.forEach($scope.results, function(value){

    //             geocoder.geocode({ 'address': value.direccion}, function geocodeResult(results, status) { 
    //                 if (status == 'OK') {    
    //                     // console.log(results[0]);
    //                     var lat = results[0].geometry.location.lat;
    //                     var lng = results[0].geometry.location.lng;
    //                     // console.log(markerOptions);
    //                     var obj = {
    //                         nombre_temp : "HOSPITAL "+value.nombre,
    //                         id_image : uuid.v4(),
    //                         nombre_empresa : value.nombre_empresa,
    //                         direccion: value.direccion,
    //                         horario: '',
    //                         telefono_1: value.telefono_1, 
    //                         correo: value.correo, 
    //                         lat: lat,
    //                         lng: lng, 
    //                         id_services: 3,
    //                         url: value.link_web

    //                     }
    //                     $scope.temp_data.push(obj);
    //                     console.log($scope.temp_data);
                        
    //                     // $scope.guardar_hospitales(obj);
    //                 } else {
    //                     // En caso de no haber resultados o que haya ocurrido un error
    //                     // lanzamos un mensaje con el error
    //                     alert("Geocoding no tuvo éxito debido a: " + status);
    //                 }
    //             }); 
                
    //         }) 
    //         // $scope.temp.push($scope.data_load);  
    //     }, function (response) {
    //     });
    // }
    // $scope.guardar_hospitales = function (data){  
    //     Services.Create(data).then(function (response) {
    //         console.log(response);
    //         // $scope.init();
    //     }, function (response) {
    //     });
    // };
    // $scope.create_hospitales();
    
}]); 
model.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});
})();

/* 
    1. cuando el usuario escriba le muestre un listado de entidades
    2. cuando se ubica no haya marcadores
    3. limitaciones: todos los usuarios tienen que contar con un smartphone que tenga gps
*/
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
        Load_Services: function(q,p,page){
            return $http.get(base_url +'/api/v1/services?nombre='+q+'&per_page='+p+'&page='+page).then(function (response){  
                return response.data;
            });
        },
        Update_img: function(id,data){
            return $http.put(base_url +'/api/v1/locations/'+id,data).then(function (response){
                return response.data;
            });
        },
        load_hospitales: function(){
            return $http.get('http://grupoaizen.com/hospitales.json').then(function (response){  
                console.log(response);
                return response;
            });
        }
    };
}); 
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVWJpY2FjaW9uZXNfRnJvbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xudmFyIG1vZGVsID0gYW5ndWxhci5tb2R1bGUoJ21vZGVsJywgXG4gICAgWydTZXJ2aWNlcycsXCJuZ1Nhbml0aXplXCIsXCJhbmd1bGFyLXV1aWRcIl0pO1xuXG52YXIgc2VsZXRlZFZhbHVlID0gMTU7XG5cbm1vZGVsLmNvbnRyb2xsZXIoJ0N0cmwnLCBcbiAgICBbJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAnJHRpbWVvdXQnLFxuICAgICdTZXJ2aWNlcycsICBcbiAgICAndXVpZCcsXG4gICAgZnVuY3Rpb24oXG4gICAgICAgICRzY29wZSxcbiAgICAgICAgJGh0dHAsXG4gICAgICAgICR0aW1lb3V0LFxuICAgICAgICBTZXJ2aWNlcyxcbiAgICAgICAgdXVpZClcbnsgIFxuICAgIHZhciBodG1sID0gZnVuY3Rpb24oaWQpIHsgXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7IFxuICAgIH07XG5cbiAgICAkc2NvcGUudGVtcCA9IFtdO1xuICAgICRzY29wZS5uZXdfbWFya2VyID0gW107XG4gICAgJHNjb3BlLmRhdGFfcmVhbCA9IFtdO1xuICAgICRzY29wZS5jYW50X3Jvd3MgPSBcIjEwXCI7XG4gICAgJHNjb3BlLm1hcGEgPSAnZnVsbCc7XG4gICAgJHNjb3BlLmhlYWRlcl9zZWFyY2ggPSB0cnVlO1xuICAgIFxuICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICBpZihxID09IHVuZGVmaW5lZCl7IFxuICAgICAgICAgICAgcSA9IFwiXCI7XG4gICAgICAgIH0gICBcbiAgICAgICAgU2VydmljZXMuTG9hZChxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWQgPSByZXNwb25zZS5kYXRhOyBcbiAgICAgICAgICAgIC8vICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7ICBcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pOyBcbiAgICB9IFxuXG4gICAgJHNjb3BlLnVwZGF0ZV9mb3RvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZCk7XG4gICAgICAgICRzY29wZS50ZW1wX2RhdGEgPSBbXTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhX2xvYWQsIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGZvdG8gPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0cmVldHZpZXc/c2l6ZT02MDZ4NDAwJmxvY2F0aW9uPScrdmFsdWUubGF0KycsJyt2YWx1ZS5sbmcrJyZwaXRjaD0tMC43NiZrZXk9QUl6YVN5RFNKRzhKa05KM2k3cHlIWnoxZ0MxVFlWVWljbTNDM3NFJztcbiAgICAgICAgICAgIC8vIHZhciBpZCA9IHZhbHVlLmlkO1xuICAgICAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgICAgICBmb3RvIDogZm90byBcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gJHNjb3BlLnRlbXBfZGF0YS5wdXNoKG9iaik7XG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlX2Z1bGwodmFsdWUuaWQsb2JqKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbHVlLmlkLCBvYmopO1xuICAgICAgICB9KVxuICAgIH1cbiAgICAkc2NvcGUudXBkYXRlX2Z1bGwgPSBmdW5jdGlvbihpZCxkYXRhKXsgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkLCBkYXRhKTtcbiAgICAgICAgU2VydmljZXMuVXBkYXRlX2ltZyhpZCxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgLy8gJCgnI2VkaXQnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLmluaXQoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUubG9hZF9zZXJ2aWNlcyA9IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgaWYocSA9PSB1bmRlZmluZWQpeyBcbiAgICAgICAgICAgIHEgPSBcIlwiO1xuICAgICAgICB9ICBcbiAgICAgICAgU2VydmljZXMuTG9hZF9TZXJ2aWNlcyhxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWRfc2VydmljZXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgJHNjb3BlLnRvID0gcmVzcG9uc2UudG87IFxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDsgXG4gICAgICAgICAgICBpZigkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gJHNjb3BlLnByZXZfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9ICRzY29wZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTsgXG4gICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRfc2VydmljZXMpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7IFxuICAgIH07XG5cbiAgICAkc2NvcGUubG9hZF9zZXJ2aWNlcygnJywxMCwxKTtcblxuXG4gICAgXG4gICAgXG4gICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubG9hZCgnJywyMDAsMSk7XG4gICAgfSAgIFxuXG4gICAgJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlO1xuICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTtcbiAgICAkc2NvcGUuZGlzYWJsZV9idXR0b24gPSBmYWxzZTtcbiAgICB2YXIgbWFwLG1hcDIsbWFya2VyO1xuICAgIHZhciBpbmZvV2luZG93ID0gbnVsbDtcbiAgICBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTsgXG4gICAgXG4gICAgdmFyIGRpcmVjdGlvbnNEaXNwbGF5ID0gbnVsbDtcbiAgICB2YXIgZGlyZWN0aW9uc1NlcnZpY2UgPSBudWxsOyBcbiAgICAvLyB2YXIgc3R5bGUgPSBbe1wiZmVhdHVyZVR5cGVcIjpcImFkbWluaXN0cmF0aXZlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzMxNDY2YVwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOlwiLTEzXCJ9LHtcImxpZ2h0bmVzc1wiOlwiNlwifSx7XCJnYW1tYVwiOlwiMS44MVwifSx7XCJjb2xvclwiOlwiI2M5Y2NkMVwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHNcIixcInN0eWxlcnNcIjpbe1wid2VpZ2h0XCI6XCIxLjgyXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0XCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LmZpbGxcIixcInN0eWxlcnNcIjpbe1wibGlnaHRuZXNzXCI6XCIzXCJ9LHtcImdhbW1hXCI6XCIwLjAwXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xXCJ9LHtcIndlaWdodFwiOlwiMi4zMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJwb2lcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOi0xMDB9LHtcImxpZ2h0bmVzc1wiOjQ1fSx7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmhpZ2h3YXlcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuYXJ0ZXJpYWxcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMuaWNvblwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn0se1wic2F0dXJhdGlvblwiOlwiLTEwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ0cmFuc2l0XCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9uXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwid2F0ZXJcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiM1Mzc1YWNcIn0se1widmlzaWJpbGl0eVwiOlwib25cIn1dfV07XG4gICAgdmFyIHN0eWxlID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUuY291bnRyeVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaHVlXCI6IFwiI2ZmMDAwMFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuYXR0cmFjdGlvblwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLmJ1c2luZXNzXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gY2xvc2VJbmZvV2luZG93KCl7XG4gICAgICAgIC8vIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgIH0gXG4gICAgXG4gICAgJHNjb3BlLk1hcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBhJyksIHtcbiAgICAgICAgICAgIGNlbnRlcjoge2xhdDogLTEyLjA0NjYyOSwgbG5nOiAtNzcuMDIxNDMzN30sXG4gICAgICAgICAgICB6b29tOiAxMSxcbiAgICAgICAgICAgIHN0eWxlcyA6IHN0eWxlXG4gICAgICAgIH0pO1xuICAgICAgICAvKiBwZXJtaXRlIG9jdWx0YXIgZWwgaW5mb3dpbmRvdyAqL1xuICAgICAgICBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTsgXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNsb3NlSW5mb1dpbmRvdygpO1xuICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyKCk7XG4gICAgICAgIGRpcmVjdGlvbnNTZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTZXJ2aWNlKCk7XG4gICAgICAgIFxuICAgIH1cbiAgICAkc2NvcGUuTWFwKCk7IFxuXG5cbiAgICAkc2NvcGUuaW5pdE1hcCA9IGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgLy8gJHNjb3BlLiR3YXRjaCgnc2VhcmNoX2VudGlkYWQnLCBmdW5jdGlvbihuKXsgXG4gICAgICAgICAgICBpZigkc2NvcGUuc2VhcmNoX2VudGlkYWQgIT0gdW5kZWZpbmVkICYmICRzY29wZS5zZWFyY2hfZW50aWRhZCAhPSAnJyl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWQoJHNjb3BlLnNlYXJjaF9lbnRpZGFkLDUsMSk7XG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZCgnJywnMCcsMSk7IFxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5tYXBhID0gJ2Z1bGwnOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgLy8gfSk7ICAgICAgICAgICBcbiAgICB9XG4gICAgJHNjb3BlLmluaXRNYXAoKTtcblxuICAgICRzY29wZS5yZXNpemUgPSBmdW5jdGlvbihtYXApe1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCAnYm91bmRzX2NoYW5nZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgICAgIHZhciBib3VuZHMgPSBtYXAuZ2V0Qm91bmRzKCk7XG4gICAgICAgIH0pO1xuICAgIH07IFxuXG4gICAgJHNjb3BlLmdldEtpbG9tZXRyb3MgPSBmdW5jdGlvbihsYXQxLGxvbjEsbGF0Mixsb24yKXtcbiAgICAgICAgZnVuY3Rpb24gcmFkKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogTWF0aC5QSS8xODA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIFIgPSA2Mzc4LjEzNzsgLy9SYWRpbyBkZSBsYSB0aWVycmEgZW4ga21cbiAgICAgICAgdmFyIGRMYXQgPSByYWQoIGxhdDIgLSBsYXQxICk7XG4gICAgICAgIHZhciBkTG9uZyA9IHJhZCggbG9uMiAtIGxvbjEgKTtcbiAgICAgICAgdmFyIGEgPSBNYXRoLnNpbihkTGF0LzIpICogTWF0aC5zaW4oZExhdC8yKSArIE1hdGguY29zKHJhZChsYXQxKSkgKiBNYXRoLmNvcyhyYWQobGF0MikpICogTWF0aC5zaW4oZExvbmcvMikgKiBNYXRoLnNpbihkTG9uZy8yKTtcbiAgICAgICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxLWEpKTtcbiAgICAgICAgdmFyIGQgPSBSICogYztcbiAgICAgICAgdmFyIHJlc3VsdCA9IGQudG9GaXhlZCgzKTsgXG4gICAgICAgIHJldHVybiByZXN1bHQ7IC8vUmV0b3JuYSB0cmVzIGRlY2ltYWxlc1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNaW5Gcm9tQXJyYXkgKGFycmF5X29mX3ZhbHVlcykge1xuICAgICAgICB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgYXJyYXlfb2ZfdmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIG1pbjsgICBcbiAgICB9O1xuXG4gICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIC8vICAgICBhbGVydChcImNsaWNrZWQgbWFya2VyXCIpO1xuICAgIC8vIH0pO1xuXG4gICAgXG4gICAgLy8gJHNjb3BlLmxvY2F0aW9uID0gZnVuY3Rpb24oKXsgIFxuICAgICAgICAvLyAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgICAgICAvLyAgICAgICAgIC8vIElOSVQgUkVTSVpFIFxuICAgICAgICAvLyAgICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuZGlzYWJsZV9idXR0b24gPSB0cnVlOyBcbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuZGF0YSA9IFtdO1xuXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLmluaXRNYXAoKTsgXG4gICAgICAgIC8vICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICAvLyAgICAgICAgIH0sNTAwKTtcbiAgICAgICAgLy8gICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7ICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAkc2NvcGUuY3JlYXRlTWFya2VyKG1hcCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICRzY29wZS5wb3NpY2lvbl9hY3R1YWwgPSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgbGF0OiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICAgIC8vICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgdmFyIGdlb2NvZGluZyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sYXQgKyAnLCcgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxuZyArICcmc2Vuc29yPWZhbHNlJztcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coZ2VvY29kaW5nKTtcblxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNTAsIDUwKSwgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCA0MClcbiAgICAgICAgLy8gICAgICAgICAgICAgfTsgXG4gICAgICAgIC8vICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZVxuICAgICAgICAvLyAgICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgY2lyY2xlID0gbmV3IGdvb2dsZS5tYXBzLkNpcmNsZSh7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBjZW50ZXI6ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICByYWRpdXM6IDEwMDAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogJyMzOTUyN2InLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogJyMzOTUyN2InLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgc3Ryb2tlT3BhY2l0eTogMC4yXG4gICAgICAgIC8vICAgICAgICAgICAgIH0pOyAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vICRzY29wZS5zZWFyY2hfZW50aWRhZCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgZm9yICh2YXIgaSA9ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpLS07KXsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpZihwYXJzZUZsb2F0KCAkc2NvcGUuZ2V0S2lsb21ldHJvcyggJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sYXQsICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nLCAkc2NvcGUuZGF0YV9sb2FkW2ldLmxhdCwgJHNjb3BlLmRhdGFfbG9hZFtpXS5sbmcpKSA8PSAxKXsgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YV9yZWFsLnB1c2goJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfcmVhbCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgYXJyYXkpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkgKycgZWwgbWluaW1vIGVzOiAnKyBtaW4pO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaSA9PSAwKXtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIHN0YXJ0ID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBlbmQgPSAkc2NvcGUuZGF0YV9sb2FkWzNdLmRpcmVjY2lvbjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGlmKCFzdGFydCB8fCAhZW5kKXtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBhbGVydChcIlN0YXJ0IGFuZCBFbmQgYWRkcmVzc2VzIGFyZSByZXF1aXJlZFwiKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm47XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgb3JpZ2luOiBzdGFydCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGVzdGluYXRpb246IGVuZCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1RyYXZlbE1vZGVbJ1dBTEtJTkcnXSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdW5pdFN5c3RlbTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1VuaXRTeXN0ZW1bJ01FVFJJQyddLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBwcm92aWRlUm91dGVBbHRlcm5hdGl2ZXM6IGZhbHNlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9O1xuXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRQYW5lbCgkKFwiI2RpcmVjdGlvbnNfcGFuZWxcIikuZ2V0KDApKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Usc3RhdHVzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYWxlcnQoXCJUaGVyZSBpcyBubyBkaXJlY3Rpb25zIGF2YWlsYWJsZSBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcIik7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGVsc2V7IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWwoJHNjb3BlLmRhdGFfbG9hZC5pbmRleE9mKCRzY29wZS5kYXRhX2xvYWRbaV0pKTsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbaV0uc2V0TWFwKG51bGwpOyAgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAvLyAgICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICBtYXAuc2V0Wm9vbSgxOCk7XG4gICAgICAgIC8vICAgICAgICAgICAgIG1hcC5wYW5UbyhtYXJrZXIucG9zaXRpb24pO1xuICAgICAgICAvLyAgICAgICAgICAgICBtYXAuZml0Qm91bmRzKGNpcmNsZS5nZXRCb3VuZHMoKSk7XG4gICAgICAgIC8vICAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKHRydWUsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG4gICAgICAgIC8vICAgICAgICAgfSk7IFxuICAgICAgICAvLyAgICAgfSBlbHNlIHsgXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IoZmFsc2UsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG5cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgIFxuICAgIC8vIH1cbiAgICAkc2NvcGUubG9jYXRpb24gPSBmdW5jdGlvbigpeyAgXG4gICAgICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHsgXG4gICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7ICAgIFxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkc2NvcGUucG9zaWNpb25fYWN0dWFsID0ge1xuICAgICAgICAgICAgICAgICAgbGF0OiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgICAgICAgICBsbmc6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgZ2VvY29kaW5nID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24/bGF0bG5nPScgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxhdCArICcsJyArICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nICsgJyZzZW5zb3I9ZmFsc2UnOyBcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hc3NldHMvYXBwL2ltYWdlcy9wb3NpdGlvbl9hY3R1YWwucG5nJywgXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDUwLCA1MCksIFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDQwKVxuICAgICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZVxuICAgICAgICAgICAgICAgIH0pOyAgIFxuICAgICAgICAgICAgICAgIC8vICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHsgXG4gICAgICAgICAgICAgICAgLy8gICAgICRzY29wZS5pbnB1dF9zdGFydCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7ICBcbiAgICAgICAgICAgICAgICAvLyAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gJHNjb3BlLmluZGljYWNpb25lcygpO1xuICAgICAgICAgICAgICAgIC8vIH0pOyAgXG4gICAgICAgICAgICAgICAgbWFwLnNldFpvb20oMTgpO1xuICAgICAgICAgICAgICAgIG1hcC5wYW5UbyhtYXJrZXIucG9zaXRpb24pOyBcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkgeyAgIFxuICAgICAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKHRydWUsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG4gICAgICAgICAgICB9KTsgXG4gICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IoZmFsc2UsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG5cbiAgICAgICAgfVxuICAgICAgICAgXG4gICAgfVxuICAgIC8qIHBlcm1pdGUgbW9zdHJhIHkgb2N1bHRhciBsb3MgbWFyY2Fkb3JlcyB5IGFjdHVhbGl6YXIgZWwgbGlzdGFkbyAqL1xuICAgICRzY29wZS50b2dnbGVfTWFya2VyID0gZnVuY3Rpb24oaWQpeyBcbiAgICAgICAgY29uc29sZS5sb2coXCJJbmdyZXNvIGVsIElEOiBcIitpZCk7XG4gICAgICAgICRzY29wZS5pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTs7XG4gICAgICAgICRzY29wZS5pZC5jaGVja2VkID0gISRzY29wZS5pZC5jaGVja2VkOyBcbiAgICAgICAgaWYoJCgnIycraWQpLmlzKCc6Y2hlY2tlZCcpKXtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9ICRzY29wZS5kYXRhX3JlYWwubGVuZ3RoOyBpLS07KXsgXG4gICAgICAgICAgICAgICAgaWYoJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyA9PT0gaWQpeyAgXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9ICcjJyskc2NvcGUuZGF0YV9yZWFsW2ldLmlkKyctJytpZDtcbiAgICAgICAgICAgICAgICAgICAgJCh2YXJpYWJsZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZGVsX3RlbXAoJHNjb3BlLmRhdGFfcmVhbC5pbmRleE9mKCRzY29wZS5kYXRhX3JlYWxbaV0pKTsgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpOyBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm5ld19tYXJrZXIubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5uZXdfbWFya2VyW2ldLnR5cGUgPT09IGlkKXsgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyW2ldLnNldFZpc2libGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgZm9yKHZhciBpID0gJHNjb3BlLmRhdGFfcmVhbC5sZW5ndGg7IGktLTspeyBcbiAgICAgICAgICAgICAgICBpZigkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzID09PSBpZCl7IFxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFyaWFibGUgPSAnIycrJHNjb3BlLmRhdGFfcmVhbFtpXS5pZCsnLScraWQ7XG4gICAgICAgICAgICAgICAgICAgICQodmFyaWFibGUpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLmRlbF90ZW1wKCRzY29wZS5kYXRhX3JlYWwuaW5kZXhPZigkc2NvcGUuZGF0YV9yZWFsW2ldKSk7ICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PVwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PVwiKTsgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8ICRzY29wZS5uZXdfbWFya2VyLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgICAgICBpZigkc2NvcGUubmV3X21hcmtlcltqXS50eXBlID09PSBpZCl7IFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlcltqXS5zZXRWaXNpYmxlKGZhbHNlKTsgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0gbm8gc2UgZWxpbWlubyAtLTogXCIrJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyk7ICAgXG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgIH1cblxuICAgICRzY29wZS5pbmRpY2FjaW9uZXMgPSBmdW5jdGlvbigpeyAgIFxuICAgICAgICBpZighJHNjb3BlLmlucHV0X3N0YXJ0IHx8ICEkc2NvcGUuaW5wdXRfZW5kKXtcbiAgICAgICAgICAgIGFsZXJ0KFwiU3RhcnQgYW5kIEVuZCBhZGRyZXNzZXMgYXJlIHJlcXVpcmVkXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLmlucHV0X3N0YXJ0LFxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuaW5wdXRfZW5kLFxuICAgICAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNUcmF2ZWxNb2RlWydEUklWSU5HJ10sXG4gICAgICAgICAgICAgICAgdW5pdFN5c3RlbTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1VuaXRTeXN0ZW1bJ01FVFJJQyddLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVSb3V0ZUFsdGVybmF0aXZlczogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKSB7XG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRNYXAobWFwKTtcbiAgICAgICAgICAgICAgICAvLyBkaXJlY3Rpb25zRGlzcGxheS5zZXRQYW5lbCgkKFwiI2RpcmVjdGlvbnNfcGFuZWxcIikuZ2V0KDApKTtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUub3JpZ2VuID0gcmVzcG9uc2UucmVxdWVzdC5vcmlnaW47XG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlc3Rpbm8gPSByZXNwb25zZS5yZXF1ZXN0LmRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgICAgICRzY29wZS5pbmRpY2FjaW9uX2RldGFsbGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICRzY29wZS53YXJuaW5nID0gcmVzcG9uc2Uucm91dGVzWzBdLndhcm5pbmdzWzBdO1xuICAgICAgICAgICAgICAgICRzY29wZS5kaXN0YW5jaWEgPSByZXNwb25zZS5yb3V0ZXNbMF0ubGVnc1swXS5kaXN0YW5jZS50ZXh0O1xuICAgICAgICAgICAgICAgICRzY29wZS5kdXJhY2lvbiA9IHJlc3BvbnNlLnJvdXRlc1swXS5sZWdzWzBdLmR1cmF0aW9uLnRleHQ7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJ1dGFfZ2VuZXJhbCA9IHJlc3BvbnNlLnJvdXRlc1swXS5zdW1tYXJ5O1xuICAgICAgICAgICAgICAgICRzY29wZS5ydXRhX2RldGFsbGUgPSByZXNwb25zZS5yb3V0ZXNbMF0ubGVnc1swXS5zdGVwcztcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudGl0dWxvID0gJCgnI2RldGEnKS5odG1sKHJlc3BvbnNlLnJvdXRlc1swXS5sZWdzWzBdLnN0ZXBzWzFdLmluc3RydWN0aW9ucyk7XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSxzdGF0dXMpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlcmUgaXMgbm8gZGlyZWN0aW9ucyBhdmFpbGFibGUgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgXG4gICAgfVxuXG4gICAgJHNjb3BlLmdvX3Bvc2l0aW9uID0gZnVuY3Rpb24oKXsgXG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRbaV0pO1xuICAgICAgICAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbik7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAgICAgdmFyIGVuZCA9ICRzY29wZS5kYXRhX2xvYWRbM10uZGlyZWNjaW9uO1xuICAgICAgICAgICAgaWYoIXN0YXJ0IHx8ICFlbmQpe1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiU3RhcnQgYW5kIEVuZCBhZGRyZXNzZXMgYXJlIHJlcXVpcmVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogZW5kLFxuICAgICAgICAgICAgICAgICAgICB0cmF2ZWxNb2RlOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVHJhdmVsTW9kZVsnV0FMS0lORyddLFxuICAgICAgICAgICAgICAgICAgICB1bml0U3lzdGVtOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVW5pdFN5c3RlbVsnTUVUUklDJ10sXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVSb3V0ZUFsdGVybmF0aXZlczogZmFsc2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRQYW5lbCgkKFwiI2RpcmVjdGlvbnNfcGFuZWxcIikuZ2V0KDApKTtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Usc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJUaGVyZSBpcyBubyBkaXJlY3Rpb25zIGF2YWlsYWJsZSBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pIFxuICAgIH1cblxuICAgIC8vIEVsaW1pbmEgMSB4IDEgY2FkYSBkYXRvIHF1ZSBubyBlc3RhIGVuIGVsIHJhbmdvXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uKGluZGV4KXsgIFxuICAgICAgICAkc2NvcGUuZGF0YV9sb2FkLnNwbGljZShpbmRleCwxKTsgIFxuICAgIH07XG4gICAgJHNjb3BlLmRlbF90ZW1wID0gZnVuY3Rpb24oaW5kZXgpeyAgXG4gICAgICAgICRzY29wZS5kYXRhX3JlYWwuc3BsaWNlKGluZGV4LDEpOyAgXG4gICAgfTtcbiAgICAvLyBIYWNlIHVuIHJlY29ycmlkbyBhbCBhcnJheSBkZSBtYXJjYWRvcmVzXG4gICAgJHNjb3BlLnNldE1hcE9uQWxsID0gZnVuY3Rpb24obWFwKSB7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUubmV3X21hcmtlci5sZW5ndGg7IGkrKykgeyBcbiAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyW2ldLnNldE1hcChtYXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGxpbXBpYSB0b2RvcyBsb3MgbWFyY2Fkb3JlcyBhIG51bGxcbiAgICAkc2NvcGUuY2xlYXJNYXJrZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5zZXRNYXBPbkFsbChudWxsKTtcbiAgICB9XG4gICAgLy8gZnVuY2lvbiBsbGFtYSBhIGxpbXBpYXIgdG9kb3MgbG9zIG1hcmNhZG9yZXNcbiAgICAkc2NvcGUuZGVsZXRlTWFya2VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuY2xlYXJNYXJrZXJzKCk7XG4gICAgICAgICRzY29wZS5uZXdfbWFya2VyID0gW107XG4gICAgfSBcblxuICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yPSBmdW5jdGlvbihicm93c2VySGFzR2VvbG9jYXRpb24sIGluZm9XaW5kb3csIHBvcykge1xuICAgICAgICBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7XG4gICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChicm93c2VySGFzR2VvbG9jYXRpb24gP1xuICAgICAgICAgICAgJ0Vycm9yOiBFbCBzZXJ2aWNpbyBkZSBHZW9sb2NhbGl6YWNpb24gRmFsbMOzLicgOlxuICAgICAgICAgICAgJ0Vycm9yOiBZb3VyIGJyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgZ2VvbG9jYXRpb24uJyk7XG4gICAgfSBcblxuICAgIFxuICAgIFxuICAgICRzY29wZS5jcmVhdGVNYXJrZXIgPSBmdW5jdGlvbihtYXApIHsgIFxuICAgICAgICBpZigkc2NvcGUuZGF0YV9sb2FkICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpKyspIHsgIFxuICAgICAgICAgICAgICAgIHZhciBkYXRhX3RlbXAgPSAkc2NvcGUuZGF0YV9sb2FkW2ldOyBcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0ge1xuICAgICAgICAgICAgICAgICAgbGF0OiBwYXJzZUZsb2F0KGRhdGFfdGVtcC5sYXQpLFxuICAgICAgICAgICAgICAgICAgbG5nOiBwYXJzZUZsb2F0KGRhdGFfdGVtcC5sbmcpXG4gICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgaWYoZGF0YV90ZW1wLmlkX3NlcnZpY2VzID09PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjMwMDAvYXNzZXRzL2FwcC9pbWFnZXMvYmFuY28tY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSBpZihkYXRhX3RlbXAuaWRfc2VydmljZXMgPT09IDIpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6MzAwMC9hc3NldHMvYXBwL2ltYWdlcy9jb21pc2FyaWEtY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihkYXRhX3RlbXAuaWRfc2VydmljZXMgPT09IDMpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6MzAwMC9hc3NldHMvYXBwL2ltYWdlcy9ob3NwaXRhbC1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyA9PT0gNCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDozMDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2JvbWJlcm9zLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9jdXJyaW8gdW4gZXJyb3IgaW5lc3BlcmFkbyBlbiBsb3MgSUQgXCIrZGF0YV90ZW1wLmlkX3NlcnZpY2VzK1wiIGRlIEVudGlkYWRlc1wiKTtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvcyxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsIFxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YV90ZW1wLmlkX3NlcnZpY2VzLFxuICAgICAgICAgICAgICAgICAgICBmb3RvOiBkYXRhX3RlbXAuZm90byxcbiAgICAgICAgICAgICAgICAgICAgbm9tYnJlX2VtcHJlc2E6IGRhdGFfdGVtcC5ub21icmVfZW1wcmVzYSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWNjaW9uOiBkYXRhX3RlbXAuZGlyZWNjaW9uXG5cbiAgICAgICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXIucHVzaChtYXJrZXIpOyBcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubWFya2Vyc19ob3ZlcihtYXJrZXIpOyAgXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3BlbkluZm9XaW5kb3codGhpcyk7IFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBhbGVydCgnT2N1cnJpbyB1biBlcnJvciBhbCBjYXJnYXInKTtcblxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5uZXdfbWFya2VyKTtcbiAgICAgICAgLy9jaWVycmEgZWwgaW5mb3dpbmRvdyB1bmEgdmV6IGNhbWJpZVxuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgfSBcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUJvdW5jZSgpIHsgXG4gICAgICAgIC8vIG1hcmtlci5zZXRBbmltYXRpb24oZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkJPVU5DRSk7IFxuICAgIH1cbiAgICBcbiAgICBcbiAgICAkc2NvcGUubWFya2Vyc19ob3ZlciA9IGZ1bmN0aW9uKGxhdCwgbG5nLGZvdG8sdGl0dWxvLGRpcmVjY2lvbixkYXRhKXsgXG4gICAgICAgIFxuICAgICAgICB2YXIgcG9zID0ge307XG4gICAgICAgIHBvcy5sYXQgPSBwYXJzZUZsb2F0KGxhdCk7XG4gICAgICAgIHBvcy5sbmcgPSBwYXJzZUZsb2F0KGxuZyk7IFxuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXAsbWF4V2lkdGg6IDIwMH0pO1xuICAgICAgICBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7IFxuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjZW50ZXIgZ2xvYm9fdWJpY2FjaW9uXCI+JywgXG4gICAgICAgICAgICAgICAgJzxpbWcgd2lkdGg9XCIxMDAlXCIgc3JjPVwiJytmb3RvKydcIj4nLFxuICAgICAgICAgICAgICAgICc8aDY+Jyt0aXR1bG8rJzwvaDY+JywgXG4gICAgICAgICAgICAgICAgJzxwPicrZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIF0uam9pbignJylcbiAgICAgICAgKTsgXG4gICAgICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTsgXG4gICAgfSBcblxuICAgIFxuICAgICRzY29wZS5vcGVuSW5mb1dpbmRvdyA9IGZ1bmN0aW9uKG1hcmtlcil7XG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTsgXG4gICAgICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXAsbWF4V2lkdGg6IDIwMH0pO1xuICAgICAgICB2YXIgcG9zID0gbWFya2VyLnBvc2l0aW9uOyBcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpOyBcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2VudGVyIGdsb2JvX3ViaWNhY2lvblwiPicsIFxuICAgICAgICAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrbWFya2VyLmZvdG8rJ1wiPicsXG4gICAgICAgICAgICAgICAgJzxoNj4nK21hcmtlci5ub21icmVfZW1wcmVzYSsnPC9oNj4nLCBcbiAgICAgICAgICAgICAgICAnPHA+JyttYXJrZXIuZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIF0uam9pbignJylcbiAgICAgICAgKTsgXG4gICAgICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGl3T3V0ZXIgPSAkKCcuZ20tc3R5bGUtaXcnKTtcbiAgICAgICAgdmFyIGl3Q2xvc2VCdG4gPSBpd091dGVyLm5leHQoKTtcbiAgICAgICAgdmFyIGl3QmFja2dyb3VuZCA9IGl3T3V0ZXIucHJldigpOyBcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTsgXG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCg0KScpLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSk7XG4gICAgICAgIGl3T3V0ZXIucGFyZW50KCkucGFyZW50KCkuY3NzKHtsZWZ0OiAnNDBweCd9KTtcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdsZWZ0OiA4NHB4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDg0cHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmZpbmQoJ2RpdicpLmNoaWxkcmVuKCkuY3NzKHsnYm94LXNoYWRvdyc6ICdyZ2JhKDAsIDAsIDAsIDApIDBweCAxcHggNnB4JywgJ3otaW5kZXgnIDogJzEnfSk7XG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDIxcHggIWltcG9ydGFudDsnKyd3aWR0aDogMTBweCAhaW1wb3J0YW50OycrJ2xlZnQ6N3B4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpLmZpbmQoJ2RpdicpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnaGVpZ2h0OiAyNXB4ICFpbXBvcnRhbnQ7Jysnd2lkdGg6IDlweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgICAgaXdDbG9zZUJ0bi5jc3MoeydkaXNwbGF5JzogJ25vbmUnfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaG93X21hcmtlciA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCA9IHRydWU7XG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsID0gZmFsc2U7XG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBtYXJrZXJbaV0uc2V0TWFwKG51bGwpO1xuICAgICAgICAvLyB9ICBcbiAgICAgICAgXG4gICAgICAgIHZhciBwb3MgPSB7fTtcbiAgICAgICAgcG9zLmxhdCA9IHBhcnNlRmxvYXQoZGF0YS5sYXQpO1xuICAgICAgICBwb3MubG5nID0gcGFyc2VGbG9hdChkYXRhLmxuZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHBvcyk7IFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmRldGFsbGUgPSBkYXRhO1xuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IGZhbHNlO1xuICAgICAgICAvKiBoYWNlIHpvb20geSByZW5kZXJpemEgbGEgcG9zaWNpb24gKi8gXG4gICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsIFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSwgXG4gICAgICAgICAgICB0eXBlOiBkYXRhLmlkX3NlcnZpY2VzLFxuICAgICAgICAgICAgZm90bzogZGF0YS5mb3RvLFxuICAgICAgICAgICAgbm9tYnJlX2VtcHJlc2E6IGRhdGEubm9tYnJlX2VtcHJlc2EsXG4gICAgICAgICAgICBkaXJlY2Npb246IGRhdGEuZGlyZWNjaW9uXG5cbiAgICAgICAgfSk7ICBcbiAgICAgICAgXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgIH0sODAwKTtcbiAgICAgICAgbWFwLnNldFpvb20oMTcpO1xuICAgICAgICBtYXAucGFuVG8ocG9zKTsgXG4gICAgfTtcblxuICAgICRzY29wZS5zZWFyY2hfZ2xvYmFsID0gZnVuY3Rpb24oc2VhcmNoKXtcbiAgICAgICAgJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7IFxuICAgICAgICAkc2NvcGUuaGlkZV9zZWFyY2ggPSB0cnVlO1xuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7IFxuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7IFxuICAgICAgICAkc2NvcGUuYm90b25fc2VhcmNoX2dsb2JhbCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUubG9hZChzZWFyY2gsMTAsMSk7XG4gICAgICAgICRzY29wZS5jcmVhdGVNYXJrZXIobWFwKTtcblxuICAgIH1cbiAgICAkc2NvcGUucmV0dXJuID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLm1hcGEgPSAnZnVsbCc7IFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7IFxuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCAgID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmhpZGVfc2VhcmNoICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuYm90b25fc2VhcmNoX2dsb2JhbCA9IHRydWU7IFxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICB9LDUwMCk7XG4gICAgfTtcblxuICAgICRzY29wZS5jb21vX2xsZWdhciA9IGZ1bmN0aW9uKGxhdCwgbG5nKXsgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgICAgID0gZmFsc2U7IFxuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaGlkZV9zZWFyY2ggICAgICA9IHRydWU7XG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsID0gZmFsc2U7IFxuXG4gICAgICAgIHZhciBnZW9jb2RpbmcgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9JyArIGxhdCArICcsJyArIGxuZyArICcmc2Vuc29yPWZhbHNlJztcbiAgICAgICAgY29uc29sZS5sb2coZ2VvY29kaW5nKTtcblxuXG4gICAgICAgIC8vIG1vc3RyYXIgZWwgaGVhZGVyIGRlIGluZGljYWRvclxuICAgICAgICAkc2NvcGUuaGVhZGVyX3NlYXJjaCA9IGZhbHNlO1xuXG4gICAgICAgICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xuICAgICAgICAgICAgJHNjb3BlLmlucHV0X2VuZCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuXG4gICAgICAgIH0pOyBcblxuICAgIH1cblxuICAgICRzY29wZS5zaG93X2RldGFsbGVfaW5kaWNhY2lvbmVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmRldGFsbGVfZGlzdGFuY2lhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUuY2xvc2VfaW5kaWNhY2lvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChudWxsKTtcbiAgICAgICAgJHNjb3BlLm1hcGEgPSAnZnVsbCc7XG4gICAgICAgICRzY29wZS5pbnB1dF9lbmQgPSBcIlwiO1xuICAgICAgICAkc2NvcGUuaW5wdXRfc3RhcnQgPSBcIlwiOyAgIFxuICAgICAgICAkc2NvcGUuaGVhZGVyX3NlYXJjaCA9IHRydWU7XG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmluZGljYWNpb25fZGV0YWxsZSA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuYm90b25fc2VhcmNoX2dsb2JhbCA9IHRydWU7ICBcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgICAgICAgPSB0cnVlO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICB9LDUwMCk7XG4gICAgfVxuICAgIC8vIEVTVEUgQ09ESUdPIENSRUEgSE9TUElUQUxFU1xuICAgIC8vIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpOyBcbiAgICAvLyAkc2NvcGUuY3JlYXRlX2hvc3BpdGFsZXMgPSBmdW5jdGlvbigpe1xuICAgIC8vICAgICBTZXJ2aWNlcy5sb2FkX2hvc3BpdGFsZXMoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgLy8gICAgICAgICAkc2NvcGUudGVtcF9kYXRhID0gW107XG4gICAgLy8gICAgICAgICAkc2NvcGUucmVzdWx0cyA9IHJlc3BvbnNlLmRhdGE7IFxuICAgIC8vICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5yZXN1bHRzLCBmdW5jdGlvbih2YWx1ZSl7XG5cbiAgICAvLyAgICAgICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHsgJ2FkZHJlc3MnOiB2YWx1ZS5kaXJlY2Npb259LCBmdW5jdGlvbiBnZW9jb2RlUmVzdWx0KHJlc3VsdHMsIHN0YXR1cykgeyBcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAnT0snKSB7ICAgIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0c1swXSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB2YXIgbGF0ID0gcmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQ7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB2YXIgbG5nID0gcmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sbmc7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXJrZXJPcHRpb25zKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbm9tYnJlX3RlbXAgOiBcIkhPU1BJVEFMIFwiK3ZhbHVlLm5vbWJyZSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBpZF9pbWFnZSA6IHV1aWQudjQoKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBub21icmVfZW1wcmVzYSA6IHZhbHVlLm5vbWJyZV9lbXByZXNhLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjY2lvbjogdmFsdWUuZGlyZWNjaW9uLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGhvcmFyaW86ICcnLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHRlbGVmb25vXzE6IHZhbHVlLnRlbGVmb25vXzEsIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGNvcnJlbzogdmFsdWUuY29ycmVvLCBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBsYXQ6IGxhdCxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGxuZywgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWRfc2VydmljZXM6IDMsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB2YWx1ZS5saW5rX3dlYlxuXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGVtcF9kYXRhLnB1c2gob2JqKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS50ZW1wX2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZ3VhcmRhcl9ob3NwaXRhbGVzKG9iaik7XG4gICAgLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBFbiBjYXNvIGRlIG5vIGhhYmVyIHJlc3VsdGFkb3MgbyBxdWUgaGF5YSBvY3VycmlkbyB1biBlcnJvclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gbGFuemFtb3MgdW4gbWVuc2FqZSBjb24gZWwgZXJyb3JcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiR2VvY29kaW5nIG5vIHR1dm8gw6l4aXRvIGRlYmlkbyBhOiBcIiArIHN0YXR1cyk7XG4gICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICAgICAgXG4gICAgLy8gICAgICAgICB9KSBcbiAgICAvLyAgICAgICAgIC8vICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7ICBcbiAgICAvLyAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH1cbiAgICAvLyAkc2NvcGUuZ3VhcmRhcl9ob3NwaXRhbGVzID0gZnVuY3Rpb24gKGRhdGEpeyAgXG4gICAgLy8gICAgIFNlcnZpY2VzLkNyZWF0ZShkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIC8vICAgICAgICAgLy8gJHNjb3BlLmluaXQoKTtcbiAgICAvLyAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH07XG4gICAgLy8gJHNjb3BlLmNyZWF0ZV9ob3NwaXRhbGVzKCk7XG4gICAgXG59XSk7IFxubW9kZWwuZGlyZWN0aXZlKCd0b29sdGlwJywgZnVuY3Rpb24oKXtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgICAgICAgJChlbGVtZW50KS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIG9uIG1vdXNlZW50ZXJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRvb2x0aXAoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gb24gbW91c2VsZWF2ZVxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudG9vbHRpcCgnaGlkZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG59KSgpO1xuXG4vKiBcbiAgICAxLiBjdWFuZG8gZWwgdXN1YXJpbyBlc2NyaWJhIGxlIG11ZXN0cmUgdW4gbGlzdGFkbyBkZSBlbnRpZGFkZXNcbiAgICAyLiBjdWFuZG8gc2UgdWJpY2Egbm8gaGF5YSBtYXJjYWRvcmVzXG4gICAgMy4gbGltaXRhY2lvbmVzOiB0b2RvcyBsb3MgdXN1YXJpb3MgdGllbmVuIHF1ZSBjb250YXIgY29uIHVuIHNtYXJ0cGhvbmUgcXVlIHRlbmdhIGdwc1xuKi8iLCIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ1NlcnZpY2VzJywgW10pXG4uZmFjdG9yeSgnU2VydmljZXMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHJldHVybiB7IFxuICAgICAgICBMb2FkOiBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnM/bm9tYnJlPScrcSsnJnBlcl9wYWdlPScrcCsnJnBhZ2U9JytwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBMb2FkX1NlcnZpY2VzOiBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9zZXJ2aWNlcz9ub21icmU9JytxKycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIFVwZGF0ZV9pbWc6IGZ1bmN0aW9uKGlkLGRhdGEpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zLycraWQsZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxvYWRfaG9zcGl0YWxlczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9ncnVwb2FpemVuLmNvbS9ob3NwaXRhbGVzLmpzb24nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7IFxufSkoKTsiXX0=
