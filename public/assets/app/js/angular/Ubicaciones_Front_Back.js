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
    var geocoder = new google.maps.Geocoder(); 
    $scope.create_hospitales = function(){
        Services.load_hospitales().then(function (response) {
            console.log(response.data);
            $scope.temp_data = [];
            $scope.results = response.data; 
            angular.forEach($scope.results, function(value){

                geocoder.geocode({ 'address': value.direccion}, function geocodeResult(results, status) { 
                    if (status == 'OK') {    
                        // console.log(results[0]);
                        var lat = results[0].geometry.location.lat;
                        var lng = results[0].geometry.location.lng;
                        // console.log(markerOptions);
                        var obj = {
                            nombre_temp : "HOSPITAL "+value.nombre,
                            id_image : uuid.v4(),
                            nombre_empresa : value.nombre_empresa,
                            direccion: value.direccion,
                            horario: '',
                            telefono_1: value.telefono_1, 
                            correo: value.correo, 
                            lat: lat,
                            lng: lng, 
                            id_services: 3,
                            url: value.link_web

                        }
                        $scope.temp_data.push(obj);
                        console.log($scope.temp_data);
                        
                        // $scope.guardar_hospitales(obj);
                    } else {
                        // En caso de no haber resultados o que haya ocurrido un error
                        // lanzamos un mensaje con el error
                        alert("Geocoding no tuvo éxito debido a: " + status);
                    }
                }); 
                
            }) 
            // $scope.temp.push($scope.data_load);  
        }, function (response) {
        });
    }
    $scope.guardar = function (data){  
        Services.Create(data).then(function (response) {
            console.log(response);
            // $scope.init();
        }, function (response) {
        });
    };
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVWJpY2FjaW9uZXNfRnJvbnRfQmFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4ndXNlIHN0cmljdCc7XG52YXIgbW9kZWwgPSBhbmd1bGFyLm1vZHVsZSgnbW9kZWwnLCBcbiAgICBbJ1NlcnZpY2VzJyxcIm5nU2FuaXRpemVcIixcImFuZ3VsYXItdXVpZFwiXSk7XG5cbnZhciBzZWxldGVkVmFsdWUgPSAxNTtcblxubW9kZWwuY29udHJvbGxlcignQ3RybCcsIFxuICAgIFsnJHNjb3BlJyxcbiAgICAnJGh0dHAnLFxuICAgICckdGltZW91dCcsXG4gICAgJ1NlcnZpY2VzJywgIFxuICAgICd1dWlkJyxcbiAgICBmdW5jdGlvbihcbiAgICAgICAgJHNjb3BlLFxuICAgICAgICAkaHR0cCxcbiAgICAgICAgJHRpbWVvdXQsXG4gICAgICAgIFNlcnZpY2VzLFxuICAgICAgICB1dWlkKVxueyAgXG4gICAgdmFyIGh0bWwgPSBmdW5jdGlvbihpZCkgeyBcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTsgXG4gICAgfTtcblxuICAgICRzY29wZS50ZW1wID0gW107XG4gICAgJHNjb3BlLm5ld19tYXJrZXIgPSBbXTtcbiAgICAkc2NvcGUuZGF0YV9yZWFsID0gW107XG4gICAgJHNjb3BlLmNhbnRfcm93cyA9IFwiMTBcIjtcbiAgICAkc2NvcGUubWFwYSA9ICdmdWxsJztcbiAgICAkc2NvcGUuaGVhZGVyX3NlYXJjaCA9IHRydWU7XG4gICAgXG4gICAgJHNjb3BlLmxvYWQgPSBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgIGlmKHEgPT0gdW5kZWZpbmVkKXsgXG4gICAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfSAgIFxuICAgICAgICBTZXJ2aWNlcy5Mb2FkKHEscCxwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZCA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgICAgLy8gJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTsgIFxuICAgICAgICAgICAgJHNjb3BlLnRvID0gcmVzcG9uc2UudG87IFxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDsgXG4gICAgICAgICAgICBpZigkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gJHNjb3BlLnByZXZfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9ICRzY29wZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7IFxuICAgIH0gXG5cbiAgICAkc2NvcGUudXBkYXRlX2ZvdG8gPSBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkKTtcbiAgICAgICAgJHNjb3BlLnRlbXBfZGF0YSA9IFtdO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGFfbG9hZCwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZm90byA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvc3RyZWV0dmlldz9zaXplPTYwNng0MDAmbG9jYXRpb249Jyt2YWx1ZS5sYXQrJywnK3ZhbHVlLmxuZysnJnBpdGNoPS0wLjc2JmtleT1BSXphU3lEU0pHOEprTkozaTdweUhaejFnQzFUWVZVaWNtM0Mzc0UnO1xuICAgICAgICAgICAgLy8gdmFyIGlkID0gdmFsdWUuaWQ7XG4gICAgICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgICAgICAgIGZvdG8gOiBmb3RvIFxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAkc2NvcGUudGVtcF9kYXRhLnB1c2gob2JqKTtcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVfZnVsbCh2YWx1ZS5pZCxvYmopO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codmFsdWUuaWQsIG9iaik7XG4gICAgICAgIH0pXG4gICAgfVxuICAgICRzY29wZS51cGRhdGVfZnVsbCA9IGZ1bmN0aW9uKGlkLGRhdGEpeyBcbiAgICAgICAgLy8gY29uc29sZS5sb2coaWQsIGRhdGEpO1xuICAgICAgICBTZXJ2aWNlcy5VcGRhdGVfaW1nKGlkLGRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAvLyAkKCcjZWRpdCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAvLyAkc2NvcGUuaW5pdCgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5sb2FkX3NlcnZpY2VzID0gZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICBpZihxID09IHVuZGVmaW5lZCl7IFxuICAgICAgICAgICAgcSA9IFwiXCI7XG4gICAgICAgIH0gIFxuICAgICAgICBTZXJ2aWNlcy5Mb2FkX1NlcnZpY2VzKHEscCxwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZF9zZXJ2aWNlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAkc2NvcGUudG8gPSByZXNwb25zZS50bzsgXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSByZXNwb25zZS50b3RhbDtcbiAgICAgICAgICAgICRzY29wZS5sYXN0X3BhZ2UgPSByZXNwb25zZS5sYXN0X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudF9wYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSByZXNwb25zZS5uZXh0X3BhZ2VfdXJsO1xuICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSByZXNwb25zZS5wcmV2X3BhZ2VfdXJsOyBcbiAgICAgICAgICAgIGlmKCRzY29wZS5wcmV2X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSAkc2NvcGUucHJldl9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigkc2NvcGUubmV4dF9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gJHNjb3BlLm5leHRfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpOyBcbiAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZF9zZXJ2aWNlcyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTsgXG4gICAgfTtcblxuICAgICRzY29wZS5sb2FkX3NlcnZpY2VzKCcnLDEwLDEpO1xuXG5cbiAgICBcbiAgICBcbiAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5sb2FkKCcnLDIwMCwxKTtcbiAgICB9ICAgXG5cbiAgICAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7XG4gICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlO1xuICAgICRzY29wZS5kaXNhYmxlX2J1dHRvbiA9IGZhbHNlO1xuICAgIHZhciBtYXAsbWFwMixtYXJrZXI7XG4gICAgdmFyIGluZm9XaW5kb3cgPSBudWxsO1xuICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICBcbiAgICB2YXIgZGlyZWN0aW9uc0Rpc3BsYXkgPSBudWxsO1xuICAgIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG51bGw7IFxuICAgIC8vIHZhciBzdHlsZSA9IFt7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjMzE0NjZhXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6XCItMTNcIn0se1wibGlnaHRuZXNzXCI6XCI2XCJ9LHtcImdhbW1hXCI6XCIxLjgxXCJ9LHtcImNvbG9yXCI6XCIjYzljY2QxXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVsc1wiLFwic3R5bGVyc1wiOlt7XCJ3ZWlnaHRcIjpcIjEuODJcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHRcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib25cIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJsaWdodG5lc3NcIjpcIjNcIn0se1wiZ2FtbWFcIjpcIjAuMDBcIn0se1wic2F0dXJhdGlvblwiOlwiLTFcIn0se1wid2VpZ2h0XCI6XCIyLjMwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInBvaVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6LTEwMH0se1wibGlnaHRuZXNzXCI6NDV9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuaGlnaHdheVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJzaW1wbGlmaWVkXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5hcnRlcmlhbFwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy5pY29uXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInRyYW5zaXRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib25cIn0se1wic2F0dXJhdGlvblwiOlwiLTEwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ3YXRlclwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzUzNzVhY1wifSx7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19XTtcbiAgICB2YXIgc3R5bGUgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5jb3VudHJ5XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJodWVcIjogXCIjZmYwMDAwXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5hdHRyYWN0aW9uXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuYnVzaW5lc3NcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICBmdW5jdGlvbiBjbG9zZUluZm9XaW5kb3coKXtcbiAgICAgICAgLy8gaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7IFxuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgfSBcbiAgICBcbiAgICAkc2NvcGUuTWFwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcGEnKSwge1xuICAgICAgICAgICAgY2VudGVyOiB7bGF0OiAtMTIuMDQ2NjI5LCBsbmc6IC03Ny4wMjE0MzM3fSxcbiAgICAgICAgICAgIHpvb206IDExLFxuICAgICAgICAgICAgc3R5bGVzIDogc3R5bGVcbiAgICAgICAgfSk7XG4gICAgICAgIC8qIHBlcm1pdGUgb2N1bHRhciBlbCBpbmZvd2luZG93ICovXG4gICAgICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY2xvc2VJbmZvV2luZG93KCk7XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoKTtcbiAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbiAgICAgICAgXG4gICAgfVxuICAgICRzY29wZS5NYXAoKTsgXG5cblxuICAgICRzY29wZS5pbml0TWFwID0gZnVuY3Rpb24oKSB7IFxuICAgICAgICAvLyAkc2NvcGUuJHdhdGNoKCdzZWFyY2hfZW50aWRhZCcsIGZ1bmN0aW9uKG4peyBcbiAgICAgICAgICAgIGlmKCRzY29wZS5zZWFyY2hfZW50aWRhZCAhPSB1bmRlZmluZWQgJiYgJHNjb3BlLnNlYXJjaF9lbnRpZGFkICE9ICcnKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZCgkc2NvcGUuc2VhcmNoX2VudGlkYWQsNSwxKTtcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkKCcnLCcwJywxKTsgXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLm1hcGEgPSAnZnVsbCc7IFxuICAgICAgICAgICAgfVxuICAgICAgICAvLyB9KTsgICAgICAgICAgIFxuICAgIH1cbiAgICAkc2NvcGUuaW5pdE1hcCgpO1xuXG4gICAgJHNjb3BlLnJlc2l6ZSA9IGZ1bmN0aW9uKG1hcCl7XG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyT25jZShtYXAsICdib3VuZHNfY2hhbmdlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXAsICdyZXNpemUnKTtcbiAgICAgICAgICAgdmFyIGJvdW5kcyA9IG1hcC5nZXRCb3VuZHMoKTtcbiAgICAgICAgfSk7XG4gICAgfTsgXG5cbiAgICAkc2NvcGUuZ2V0S2lsb21ldHJvcyA9IGZ1bmN0aW9uKGxhdDEsbG9uMSxsYXQyLGxvbjIpe1xuICAgICAgICBmdW5jdGlvbiByYWQoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHggKiBNYXRoLlBJLzE4MDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgUiA9IDYzNzguMTM3OyAvL1JhZGlvIGRlIGxhIHRpZXJyYSBlbiBrbVxuICAgICAgICB2YXIgZExhdCA9IHJhZCggbGF0MiAtIGxhdDEgKTtcbiAgICAgICAgdmFyIGRMb25nID0gcmFkKCBsb24yIC0gbG9uMSApO1xuICAgICAgICB2YXIgYSA9IE1hdGguc2luKGRMYXQvMikgKiBNYXRoLnNpbihkTGF0LzIpICsgTWF0aC5jb3MocmFkKGxhdDEpKSAqIE1hdGguY29zKHJhZChsYXQyKSkgKiBNYXRoLnNpbihkTG9uZy8yKSAqIE1hdGguc2luKGRMb25nLzIpO1xuICAgICAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEtYSkpO1xuICAgICAgICB2YXIgZCA9IFIgKiBjO1xuICAgICAgICB2YXIgcmVzdWx0ID0gZC50b0ZpeGVkKDMpOyBcbiAgICAgICAgcmV0dXJuIHJlc3VsdDsgLy9SZXRvcm5hIHRyZXMgZGVjaW1hbGVzXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE1pbkZyb21BcnJheSAoYXJyYXlfb2ZfdmFsdWVzKSB7XG4gICAgICAgIHZhciBtaW4gPSBNYXRoLm1pbi5hcHBseShudWxsLCBhcnJheV9vZl92YWx1ZXMpO1xuICAgICAgICByZXR1cm4gbWluOyAgIFxuICAgIH07XG5cbiAgICAvLyBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gICAgIGFsZXJ0KFwiY2xpY2tlZCBtYXJrZXJcIik7XG4gICAgLy8gfSk7XG5cbiAgICBcbiAgICAvLyAkc2NvcGUubG9jYXRpb24gPSBmdW5jdGlvbigpeyAgXG4gICAgICAgIC8vICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgICAgIC8vICAgICAgICAgLy8gSU5JVCBSRVNJWkUgXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7IFxuICAgICAgICAvLyAgICAgICAgICRzY29wZS5kaXNhYmxlX2J1dHRvbiA9IHRydWU7IFxuICAgICAgICAvLyAgICAgICAgICRzY29wZS5kYXRhID0gW107XG5cbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuaW5pdE1hcCgpOyBcbiAgICAgICAgLy8gICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgIC8vICAgICAgICAgfSw1MDApO1xuICAgICAgICAvLyAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHsgICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICRzY29wZS5jcmVhdGVNYXJrZXIobWFwKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCA9IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICBsYXQ6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICBsbmc6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVcbiAgICAgICAgLy8gICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgZ2VvY29kaW5nID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24/bGF0bG5nPScgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxhdCArICcsJyArICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nICsgJyZzZW5zb3I9ZmFsc2UnO1xuICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhnZW9jb2RpbmcpO1xuXG4gICAgICAgIC8vICAgICAgICAgICAgIHZhciBpbWFnZSA9IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHVybDogJy9hc3NldHMvYXBwL2ltYWdlcy9wb3NpdGlvbl9hY3R1YWwucG5nJywgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg1MCwgNTApLCBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDQwKVxuICAgICAgICAvLyAgICAgICAgICAgICB9OyBcbiAgICAgICAgLy8gICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcG9zaXRpb246ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGljb246IGltYWdlXG4gICAgICAgIC8vICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vICAgICAgICAgICAgIHZhciBjaXJjbGUgPSBuZXcgZ29vZ2xlLm1hcHMuQ2lyY2xlKHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGNlbnRlcjogJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJhZGl1czogMTAwMCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiAnIzM5NTI3YicsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBmaWxsT3BhY2l0eTogMCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnIzM5NTI3YicsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBzdHJva2VPcGFjaXR5OiAwLjJcbiAgICAgICAgLy8gICAgICAgICAgICAgfSk7ICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLnNlYXJjaF9lbnRpZGFkID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgICAgICBmb3IgKHZhciBpID0gJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGg7IGktLTspeyBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmKHBhcnNlRmxvYXQoICRzY29wZS5nZXRLaWxvbWV0cm9zKCAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxhdCwgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sbmcsICRzY29wZS5kYXRhX2xvYWRbaV0ubGF0LCAkc2NvcGUuZGF0YV9sb2FkW2ldLmxuZykpIDw9IDEpeyAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhX3JlYWwucHVzaCgkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9yZWFsKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBtaW4gPSBNYXRoLm1pbi5hcHBseShudWxsLCBhcnJheSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSArJyBlbCBtaW5pbW8gZXM6ICcrIG1pbik7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBpZihpID09IDApe1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgc3RhcnQgPSBsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGVuZCA9ICRzY29wZS5kYXRhX2xvYWRbM10uZGlyZWNjaW9uO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYoIXN0YXJ0IHx8ICFlbmQpe1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGFsZXJ0KFwiU3RhcnQgYW5kIEVuZCBhZGRyZXNzZXMgYXJlIHJlcXVpcmVkXCIpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBvcmlnaW46IHN0YXJ0LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkZXN0aW5hdGlvbjogZW5kLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB0cmF2ZWxNb2RlOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVHJhdmVsTW9kZVsnV0FMS0lORyddLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB1bml0U3lzdGVtOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVW5pdFN5c3RlbVsnTUVUUklDJ10sXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHByb3ZpZGVSb3V0ZUFsdGVybmF0aXZlczogZmFsc2VcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH07XG5cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGRpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKCQoXCIjZGlyZWN0aW9uc19wYW5lbFwiKS5nZXQoMCkpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3BvbnNlKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSxzdGF0dXMpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBhbGVydChcIlRoZXJlIGlzIG5vIGRpcmVjdGlvbnMgYXZhaWxhYmxlIGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1wiKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZWxzZXsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlbCgkc2NvcGUuZGF0YV9sb2FkLmluZGV4T2YoJHNjb3BlLmRhdGFfbG9hZFtpXSkpOyBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlcltpXS5zZXRNYXAobnVsbCk7ICBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpOyBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH0gXG4gICAgICAgIC8vICAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAgICAgICAgIG1hcC5zZXRab29tKDE4KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5wb3NpdGlvbik7XG4gICAgICAgIC8vICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoY2lyY2xlLmdldEJvdW5kcygpKTtcbiAgICAgICAgLy8gICAgICAgICB9LCBmdW5jdGlvbigpIHsgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IodHJ1ZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcbiAgICAgICAgLy8gICAgICAgICB9KTsgXG4gICAgICAgIC8vICAgICB9IGVsc2UgeyBcbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcihmYWxzZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcblxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAgXG4gICAgLy8gfVxuICAgICRzY29wZS5sb2NhdGlvbiA9IGZ1bmN0aW9uKCl7ICBcbiAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikgeyBcbiAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHsgICAgXG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICRzY29wZS5wb3NpY2lvbl9hY3R1YWwgPSB7XG4gICAgICAgICAgICAgICAgICBsYXQ6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICAgIGxuZzogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZVxuICAgICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBnZW9jb2RpbmcgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9JyArICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubGF0ICsgJywnICsgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sbmcgKyAnJnNlbnNvcj1mYWxzZSc7IFxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2Fzc2V0cy9hcHAvaW1hZ2VzL3Bvc2l0aW9uX2FjdHVhbC5wbmcnLCBcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNTAsIDUwKSwgXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgNDApXG4gICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgICAgIGljb246IGltYWdlXG4gICAgICAgICAgICAgICAgfSk7ICAgXG4gICAgICAgICAgICAgICAgLy8gJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikgeyBcbiAgICAgICAgICAgICAgICAvLyAgICAgJHNjb3BlLmlucHV0X3N0YXJ0ID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzczsgIFxuICAgICAgICAgICAgICAgIC8vICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgICAgIC8vICAgICAvLyAkc2NvcGUuaW5kaWNhY2lvbmVzKCk7XG4gICAgICAgICAgICAgICAgLy8gfSk7ICBcbiAgICAgICAgICAgICAgICBtYXAuc2V0Wm9vbSgxOCk7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5wb3NpdGlvbik7IFxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAgXG4gICAgICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IodHJ1ZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcbiAgICAgICAgICAgIH0pOyBcbiAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcihmYWxzZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcblxuICAgICAgICB9XG4gICAgICAgICBcbiAgICB9XG4gICAgLyogcGVybWl0ZSBtb3N0cmEgeSBvY3VsdGFyIGxvcyBtYXJjYWRvcmVzIHkgYWN0dWFsaXphciBlbCBsaXN0YWRvICovXG4gICAgJHNjb3BlLnRvZ2dsZV9NYXJrZXIgPSBmdW5jdGlvbihpZCl7IFxuICAgICAgICBjb25zb2xlLmxvZyhcIkluZ3Jlc28gZWwgSUQ6IFwiK2lkKTtcbiAgICAgICAgJHNjb3BlLmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpOztcbiAgICAgICAgJHNjb3BlLmlkLmNoZWNrZWQgPSAhJHNjb3BlLmlkLmNoZWNrZWQ7IFxuICAgICAgICBpZigkKCcjJytpZCkuaXMoJzpjaGVja2VkJykpe1xuICAgICAgICAgICAgZm9yKHZhciBpID0gJHNjb3BlLmRhdGFfcmVhbC5sZW5ndGg7IGktLTspeyBcbiAgICAgICAgICAgICAgICBpZigkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzID09PSBpZCl7ICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gJyMnKyRzY29wZS5kYXRhX3JlYWxbaV0uaWQrJy0nK2lkO1xuICAgICAgICAgICAgICAgICAgICAkKHZhcmlhYmxlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIC8vICRzY29wZS5kZWxfdGVtcCgkc2NvcGUuZGF0YV9yZWFsLmluZGV4T2YoJHNjb3BlLmRhdGFfcmVhbFtpXSkpOyAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT09PT09PT1cIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX3JlYWxbaV0uaWRfc2VydmljZXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT09PT09PT1cIik7IFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUubmV3X21hcmtlci5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYoJHNjb3BlLm5ld19tYXJrZXJbaV0udHlwZSA9PT0gaWQpeyBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbaV0uc2V0VmlzaWJsZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAkc2NvcGUuZGF0YV9yZWFsLmxlbmd0aDsgaS0tOyl7IFxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5kYXRhX3JlYWxbaV0uaWRfc2VydmljZXMgPT09IGlkKXsgXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9ICcjJyskc2NvcGUuZGF0YV9yZWFsW2ldLmlkKyctJytpZDtcbiAgICAgICAgICAgICAgICAgICAgJCh2YXJpYWJsZSkuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZGVsX3RlbXAoJHNjb3BlLmRhdGFfcmVhbC5pbmRleE9mKCRzY29wZS5kYXRhX3JlYWxbaV0pKTsgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpOyBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgJHNjb3BlLm5ld19tYXJrZXIubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5uZXdfbWFya2VyW2pdLnR5cGUgPT09IGlkKXsgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyW2pdLnNldFZpc2libGUoZmFsc2UpOyBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLSBubyBzZSBlbGltaW5vIC0tOiBcIiskc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzKTsgICBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vICRzY29wZS4kZGlnZXN0KCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmluZGljYWNpb25lcyA9IGZ1bmN0aW9uKCl7ICAgXG4gICAgICAgIGlmKCEkc2NvcGUuaW5wdXRfc3RhcnQgfHwgISRzY29wZS5pbnB1dF9lbmQpe1xuICAgICAgICAgICAgYWxlcnQoXCJTdGFydCBhbmQgRW5kIGFkZHJlc3NlcyBhcmUgcmVxdWlyZWRcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuaW5wdXRfc3RhcnQsXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5pbnB1dF9lbmQsXG4gICAgICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1RyYXZlbE1vZGVbJ0RSSVZJTkcnXSxcbiAgICAgICAgICAgICAgICB1bml0U3lzdGVtOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVW5pdFN5c3RlbVsnTUVUUklDJ10sXG4gICAgICAgICAgICAgICAgcHJvdmlkZVJvdXRlQWx0ZXJuYXRpdmVzOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIGRpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICAgICAgICAgICAgIC8vIGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKCQoXCIjZGlyZWN0aW9uc19wYW5lbFwiKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICRzY29wZS5vcmlnZW4gPSByZXNwb25zZS5yZXF1ZXN0Lm9yaWdpbjtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGVzdGlubyA9IHJlc3BvbnNlLnJlcXVlc3QuZGVzdGluYXRpb247XG4gICAgICAgICAgICAgICAgJHNjb3BlLmluZGljYWNpb25fZGV0YWxsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgJHNjb3BlLndhcm5pbmcgPSByZXNwb25zZS5yb3V0ZXNbMF0ud2FybmluZ3NbMF07XG4gICAgICAgICAgICAgICAgJHNjb3BlLmRpc3RhbmNpYSA9IHJlc3BvbnNlLnJvdXRlc1swXS5sZWdzWzBdLmRpc3RhbmNlLnRleHQ7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmR1cmFjaW9uID0gcmVzcG9uc2Uucm91dGVzWzBdLmxlZ3NbMF0uZHVyYXRpb24udGV4dDtcbiAgICAgICAgICAgICAgICAkc2NvcGUucnV0YV9nZW5lcmFsID0gcmVzcG9uc2Uucm91dGVzWzBdLnN1bW1hcnk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJ1dGFfZGV0YWxsZSA9IHJlc3BvbnNlLnJvdXRlc1swXS5sZWdzWzBdLnN0ZXBzO1xuICAgICAgICAgICAgICAgIC8vICRzY29wZS50aXR1bG8gPSAkKCcjZGV0YScpLmh0bWwocmVzcG9uc2Uucm91dGVzWzBdLmxlZ3NbMF0uc3RlcHNbMV0uaW5zdHJ1Y3Rpb25zKTtcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLHN0YXR1cyk7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJUaGVyZSBpcyBubyBkaXJlY3Rpb25zIGF2YWlsYWJsZSBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyBcbiAgICB9XG5cbiAgICAkc2NvcGUuZ29fcG9zaXRpb24gPSBmdW5jdGlvbigpeyBcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uKTtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgICAgICB2YXIgZW5kID0gJHNjb3BlLmRhdGFfbG9hZFszXS5kaXJlY2Npb247XG4gICAgICAgICAgICBpZighc3RhcnQgfHwgIWVuZCl7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJTdGFydCBhbmQgRW5kIGFkZHJlc3NlcyBhcmUgcmVxdWlyZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBlbmQsXG4gICAgICAgICAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNUcmF2ZWxNb2RlWydXQUxLSU5HJ10sXG4gICAgICAgICAgICAgICAgICAgIHVuaXRTeXN0ZW06IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNVbml0U3lzdGVtWydNRVRSSUMnXSxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZVJvdXRlQWx0ZXJuYXRpdmVzOiBmYWxzZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKCQoXCIjZGlyZWN0aW9uc19wYW5lbFwiKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSxzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlRoZXJlIGlzIG5vIGRpcmVjdGlvbnMgYXZhaWxhYmxlIGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkgXG4gICAgfVxuXG4gICAgLy8gRWxpbWluYSAxIHggMSBjYWRhIGRhdG8gcXVlIG5vIGVzdGEgZW4gZWwgcmFuZ29cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24oaW5kZXgpeyAgXG4gICAgICAgICRzY29wZS5kYXRhX2xvYWQuc3BsaWNlKGluZGV4LDEpOyAgXG4gICAgfTtcbiAgICAkc2NvcGUuZGVsX3RlbXAgPSBmdW5jdGlvbihpbmRleCl7ICBcbiAgICAgICAgJHNjb3BlLmRhdGFfcmVhbC5zcGxpY2UoaW5kZXgsMSk7ICBcbiAgICB9O1xuICAgIC8vIEhhY2UgdW4gcmVjb3JyaWRvIGFsIGFycmF5IGRlIG1hcmNhZG9yZXNcbiAgICAkc2NvcGUuc2V0TWFwT25BbGwgPSBmdW5jdGlvbihtYXApIHtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5uZXdfbWFya2VyLmxlbmd0aDsgaSsrKSB7IFxuICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbaV0uc2V0TWFwKG1hcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gbGltcGlhIHRvZG9zIGxvcyBtYXJjYWRvcmVzIGEgbnVsbFxuICAgICRzY29wZS5jbGVhck1hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnNldE1hcE9uQWxsKG51bGwpO1xuICAgIH1cbiAgICAvLyBmdW5jaW9uIGxsYW1hIGEgbGltcGlhciB0b2RvcyBsb3MgbWFyY2Fkb3Jlc1xuICAgICRzY29wZS5kZWxldGVNYXJrZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5jbGVhck1hcmtlcnMoKTtcbiAgICAgICAgJHNjb3BlLm5ld19tYXJrZXIgPSBbXTtcbiAgICB9IFxuXG4gICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3I9IGZ1bmN0aW9uKGJyb3dzZXJIYXNHZW9sb2NhdGlvbiwgaW5mb1dpbmRvdywgcG9zKSB7XG4gICAgICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KGJyb3dzZXJIYXNHZW9sb2NhdGlvbiA/XG4gICAgICAgICAgICAnRXJyb3I6IEVsIHNlcnZpY2lvIGRlIEdlb2xvY2FsaXphY2lvbiBGYWxsw7MuJyA6XG4gICAgICAgICAgICAnRXJyb3I6IFlvdXIgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBnZW9sb2NhdGlvbi4nKTtcbiAgICB9IFxuXG4gICAgXG4gICAgXG4gICAgJHNjb3BlLmNyZWF0ZU1hcmtlciA9IGZ1bmN0aW9uKG1hcCkgeyAgXG4gICAgICAgIGlmKCRzY29wZS5kYXRhX2xvYWQgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGg7IGkrKykgeyAgXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFfdGVtcCA9ICRzY29wZS5kYXRhX2xvYWRbaV07IFxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSB7XG4gICAgICAgICAgICAgICAgICBsYXQ6IHBhcnNlRmxvYXQoZGF0YV90ZW1wLmxhdCksXG4gICAgICAgICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQoZGF0YV90ZW1wLmxuZylcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICBpZihkYXRhX3RlbXAuaWRfc2VydmljZXMgPT09IDEpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6MzAwMC9hc3NldHMvYXBwL2ltYWdlcy9iYW5jby1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDozMDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2NvbWlzYXJpYS1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyA9PT0gMyl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDozMDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2hvc3BpdGFsLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZGF0YV90ZW1wLmlkX3NlcnZpY2VzID09PSA0KXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjMwMDAvYXNzZXRzL2FwcC9pbWFnZXMvYm9tYmVyb3MtY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT2N1cnJpbyB1biBlcnJvciBpbmVzcGVyYWRvIGVuIGxvcyBJRCBcIitkYXRhX3RlbXAuaWRfc2VydmljZXMrXCIgZGUgRW50aWRhZGVzXCIpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCwgXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGljb246IGltYWdlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhX3RlbXAuaWRfc2VydmljZXMsXG4gICAgICAgICAgICAgICAgICAgIGZvdG86IGRhdGFfdGVtcC5mb3RvLFxuICAgICAgICAgICAgICAgICAgICBub21icmVfZW1wcmVzYTogZGF0YV90ZW1wLm5vbWJyZV9lbXByZXNhLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY2Npb246IGRhdGFfdGVtcC5kaXJlY2Npb25cblxuICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlci5wdXNoKG1hcmtlcik7IFxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5tYXJrZXJzX2hvdmVyKG1hcmtlcik7ICBcbiAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5vcGVuSW5mb1dpbmRvdyh0aGlzKTsgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGFsZXJ0KCdPY3VycmlvIHVuIGVycm9yIGFsIGNhcmdhcicpO1xuXG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLm5ld19tYXJrZXIpO1xuICAgICAgICAvL2NpZXJyYSBlbCBpbmZvd2luZG93IHVuYSB2ZXogY2FtYmllXG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICB9IFxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlQm91bmNlKCkgeyBcbiAgICAgICAgLy8gbWFya2VyLnNldEFuaW1hdGlvbihnb29nbGUubWFwcy5BbmltYXRpb24uQk9VTkNFKTsgXG4gICAgfVxuICAgIFxuICAgIFxuICAgICRzY29wZS5tYXJrZXJzX2hvdmVyID0gZnVuY3Rpb24obGF0LCBsbmcsZm90byx0aXR1bG8sZGlyZWNjaW9uLGRhdGEpeyBcbiAgICAgICAgXG4gICAgICAgIHZhciBwb3MgPSB7fTtcbiAgICAgICAgcG9zLmxhdCA9IHBhcnNlRmxvYXQobGF0KTtcbiAgICAgICAgcG9zLmxuZyA9IHBhcnNlRmxvYXQobG5nKTsgXG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHttYXA6IG1hcCxtYXhXaWR0aDogMjAwfSk7XG4gICAgICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTsgXG4gICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNlbnRlciBnbG9ib191YmljYWNpb25cIj4nLCBcbiAgICAgICAgICAgICAgICAnPGltZyB3aWR0aD1cIjEwMCVcIiBzcmM9XCInK2ZvdG8rJ1wiPicsXG4gICAgICAgICAgICAgICAgJzxoNj4nK3RpdHVsbysnPC9oNj4nLCBcbiAgICAgICAgICAgICAgICAnPHA+JytkaXJlY2Npb24rJzwvcD4nLCBcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgXS5qb2luKCcnKVxuICAgICAgICApOyBcbiAgICAgICAgJHNjb3BlLnNldF9nb29nbGVfbWFwcygpOyBcbiAgICB9IFxuXG4gICAgXG4gICAgJHNjb3BlLm9wZW5JbmZvV2luZG93ID0gZnVuY3Rpb24obWFya2VyKXtcbiAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpOyBcbiAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHttYXA6IG1hcCxtYXhXaWR0aDogMjAwfSk7XG4gICAgICAgIHZhciBwb3MgPSBtYXJrZXIucG9zaXRpb247IFxuICAgICAgICBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7IFxuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjZW50ZXIgZ2xvYm9fdWJpY2FjaW9uXCI+JywgXG4gICAgICAgICAgICAgICAgJzxpbWcgd2lkdGg9XCIxMDAlXCIgc3JjPVwiJyttYXJrZXIuZm90bysnXCI+JyxcbiAgICAgICAgICAgICAgICAnPGg2PicrbWFya2VyLm5vbWJyZV9lbXByZXNhKyc8L2g2PicsIFxuICAgICAgICAgICAgICAgICc8cD4nK21hcmtlci5kaXJlY2Npb24rJzwvcD4nLCBcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgXS5qb2luKCcnKVxuICAgICAgICApOyBcbiAgICAgICAgJHNjb3BlLnNldF9nb29nbGVfbWFwcygpO1xuICAgIH1cblxuICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgaXdPdXRlciA9ICQoJy5nbS1zdHlsZS1pdycpO1xuICAgICAgICB2YXIgaXdDbG9zZUJ0biA9IGl3T3V0ZXIubmV4dCgpO1xuICAgICAgICB2YXIgaXdCYWNrZ3JvdW5kID0gaXdPdXRlci5wcmV2KCk7IFxuICAgICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKS5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pOyBcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDQpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTtcbiAgICAgICAgaXdPdXRlci5wYXJlbnQoKS5wYXJlbnQoKS5jc3Moe2xlZnQ6ICc0MHB4J30pO1xuICAgICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDg0cHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnbGVmdDogODRweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuZmluZCgnZGl2JykuY2hpbGRyZW4oKS5jc3Moeydib3gtc2hhZG93JzogJ3JnYmEoMCwgMCwgMCwgMCkgMHB4IDFweCA2cHgnLCAnei1pbmRleCcgOiAnMSd9KTtcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKS5maW5kKCdkaXYnKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2hlaWdodDogMjFweCAhaW1wb3J0YW50OycrJ3dpZHRoOiAxMHB4ICFpbXBvcnRhbnQ7JysnbGVmdDo3cHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDI1cHggIWltcG9ydGFudDsnKyd3aWR0aDogOXB4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICBpd0Nsb3NlQnRuLmNzcyh7J2Rpc3BsYXknOiAnbm9uZSd9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNob3dfbWFya2VyID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgJHNjb3BlLmhpZGVfc2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmJvdG9uX3NlYXJjaF9nbG9iYWwgPSBmYWxzZTtcbiAgICAgICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCBtYXJrZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIG1hcmtlcltpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgIC8vIH0gIFxuICAgICAgICBcbiAgICAgICAgdmFyIHBvcyA9IHt9O1xuICAgICAgICBwb3MubGF0ID0gcGFyc2VGbG9hdChkYXRhLmxhdCk7XG4gICAgICAgIHBvcy5sbmcgPSBwYXJzZUZsb2F0KGRhdGEubG5nKTtcbiAgICAgICAgY29uc29sZS5sb2cocG9zKTsgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuZGV0YWxsZSA9IGRhdGE7XG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsID0gZmFsc2U7XG4gICAgICAgIC8qIGhhY2Ugem9vbSB5IHJlbmRlcml6YSBsYSBwb3NpY2lvbiAqLyBcbiAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgcG9zaXRpb246IHBvcyxcbiAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCwgXG4gICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLCBcbiAgICAgICAgICAgIHR5cGU6IGRhdGEuaWRfc2VydmljZXMsXG4gICAgICAgICAgICBmb3RvOiBkYXRhLmZvdG8sXG4gICAgICAgICAgICBub21icmVfZW1wcmVzYTogZGF0YS5ub21icmVfZW1wcmVzYSxcbiAgICAgICAgICAgIGRpcmVjY2lvbjogZGF0YS5kaXJlY2Npb25cblxuICAgICAgICB9KTsgIFxuICAgICAgICBcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXAsICdyZXNpemUnKTtcbiAgICAgICAgfSw4MDApO1xuICAgICAgICBtYXAuc2V0Wm9vbSgxNyk7XG4gICAgICAgIG1hcC5wYW5Ubyhwb3MpOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNlYXJjaF9nbG9iYWwgPSBmdW5jdGlvbihzZWFyY2gpe1xuICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCA9IHRydWU7XG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTsgXG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5sb2FkKHNlYXJjaCwxMCwxKTtcbiAgICAgICAgJHNjb3BlLmNyZWF0ZU1hcmtlcihtYXApO1xuXG4gICAgfVxuICAgICRzY29wZS5yZXR1cm4gPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubWFwYSA9ICdmdWxsJzsgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsICAgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaGlkZV9zZWFyY2ggID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsID0gdHJ1ZTsgXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgIH0sNTAwKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvbW9fbGxlZ2FyID0gZnVuY3Rpb24obGF0LCBsbmcpeyBcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSAgICAgPSBmYWxzZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsICAgICAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCAgICAgID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmJvdG9uX3NlYXJjaF9nbG9iYWwgPSBmYWxzZTsgXG5cbiAgICAgICAgdmFyIGdlb2NvZGluZyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgbGF0ICsgJywnICsgbG5nICsgJyZzZW5zb3I9ZmFsc2UnO1xuICAgICAgICBjb25zb2xlLmxvZyhnZW9jb2RpbmcpO1xuXG5cbiAgICAgICAgLy8gbW9zdHJhciBlbCBoZWFkZXIgZGUgaW5kaWNhZG9yXG4gICAgICAgICRzY29wZS5oZWFkZXJfc2VhcmNoID0gZmFsc2U7XG5cbiAgICAgICAgJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XG4gICAgICAgICAgICAkc2NvcGUuaW5wdXRfZW5kID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG5cbiAgICAgICAgfSk7IFxuXG4gICAgfVxuXG4gICAgJHNjb3BlLnNob3dfZGV0YWxsZV9pbmRpY2FjaW9uZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuZGV0YWxsZV9kaXN0YW5jaWEgPSB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS5jbG9zZV9pbmRpY2FjaW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG51bGwpO1xuICAgICAgICAkc2NvcGUubWFwYSA9ICdmdWxsJztcbiAgICAgICAgJHNjb3BlLmlucHV0X2VuZCA9IFwiXCI7XG4gICAgICAgICRzY29wZS5pbnB1dF9zdGFydCA9IFwiXCI7ICAgXG4gICAgICAgICRzY29wZS5oZWFkZXJfc2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmhpZGVfc2VhcmNoICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaW5kaWNhY2lvbl9kZXRhbGxlID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsID0gdHJ1ZTsgIFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCAgICAgICA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgIH0sNTAwKTtcbiAgICB9XG4gICAgLy8gRVNURSBDT0RJR08gQ1JFQSBIT1NQSVRBTEVTXG4gICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7IFxuICAgICRzY29wZS5jcmVhdGVfaG9zcGl0YWxlcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFNlcnZpY2VzLmxvYWRfaG9zcGl0YWxlcygpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICRzY29wZS50ZW1wX2RhdGEgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHRzID0gcmVzcG9uc2UuZGF0YTsgXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLnJlc3VsdHMsIGZ1bmN0aW9uKHZhbHVlKXtcblxuICAgICAgICAgICAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeyAnYWRkcmVzcyc6IHZhbHVlLmRpcmVjY2lvbn0sIGZ1bmN0aW9uIGdlb2NvZGVSZXN1bHQocmVzdWx0cywgc3RhdHVzKSB7IFxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09ICdPSycpIHsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXQgPSByZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsbmcgPSByZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxuZztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hcmtlck9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub21icmVfdGVtcCA6IFwiSE9TUElUQUwgXCIrdmFsdWUubm9tYnJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX2ltYWdlIDogdXVpZC52NCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vbWJyZV9lbXByZXNhIDogdmFsdWUubm9tYnJlX2VtcHJlc2EsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWNjaW9uOiB2YWx1ZS5kaXJlY2Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9yYXJpbzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVsZWZvbm9fMTogdmFsdWUudGVsZWZvbm9fMSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVvOiB2YWx1ZS5jb3JyZW8sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogbGF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogbG5nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF9zZXJ2aWNlczogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHZhbHVlLmxpbmtfd2ViXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50ZW1wX2RhdGEucHVzaChvYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnRlbXBfZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICRzY29wZS5ndWFyZGFyX2hvc3BpdGFsZXMob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVuIGNhc28gZGUgbm8gaGFiZXIgcmVzdWx0YWRvcyBvIHF1ZSBoYXlhIG9jdXJyaWRvIHVuIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsYW56YW1vcyB1biBtZW5zYWplIGNvbiBlbCBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJHZW9jb2Rpbmcgbm8gdHV2byDDqXhpdG8gZGViaWRvIGE6IFwiICsgc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pIFxuICAgICAgICAgICAgLy8gJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTsgIFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICRzY29wZS5ndWFyZGFyID0gZnVuY3Rpb24gKGRhdGEpeyAgXG4gICAgICAgIFNlcnZpY2VzLkNyZWF0ZShkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLmluaXQoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gJHNjb3BlLmNyZWF0ZV9ob3NwaXRhbGVzKCk7XG5cbn1dKTsgXG5tb2RlbC5kaXJlY3RpdmUoJ3Rvb2x0aXAnLCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gb24gbW91c2VlbnRlclxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudG9vbHRpcCgnc2hvdycpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBvbiBtb3VzZWxlYXZlXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50b29sdGlwKCdoaWRlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbn0pKCk7XG5cbi8qIFxuICAgIDEuIGN1YW5kbyBlbCB1c3VhcmlvIGVzY3JpYmEgbGUgbXVlc3RyZSB1biBsaXN0YWRvIGRlIGVudGlkYWRlc1xuICAgIDIuIGN1YW5kbyBzZSB1YmljYSBubyBoYXlhIG1hcmNhZG9yZXNcbiAgICAzLiBsaW1pdGFjaW9uZXM6IHRvZG9zIGxvcyB1c3VhcmlvcyB0aWVuZW4gcXVlIGNvbnRhciBjb24gdW4gc21hcnRwaG9uZSBxdWUgdGVuZ2EgZ3BzXG4qLyIsIihmdW5jdGlvbiAoKSB7XG4ndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnU2VydmljZXMnLCBbXSlcbi5mYWN0b3J5KCdTZXJ2aWNlcycsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgcmV0dXJuIHsgXG4gICAgICAgIExvYWQ6IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucz9ub21icmU9JytxKycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIExvYWRfU2VydmljZXM6IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzP25vbWJyZT0nK3ErJyZwZXJfcGFnZT0nK3ArJyZwYWdlPScrcGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgVXBkYXRlX2ltZzogZnVuY3Rpb24oaWQsZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZF9ob3NwaXRhbGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2dydXBvYWl6ZW4uY29tL2hvc3BpdGFsZXMuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTsgXG59KSgpOyJdfQ==
